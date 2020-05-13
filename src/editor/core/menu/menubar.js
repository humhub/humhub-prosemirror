import crelt from "crelt"

import {Plugin} from "prosemirror-state"

import {MenuItemGroup, icons, joinUpItem, liftItem, redoItem, undoItem, selectParentNodeItem} from "./menu"

const prefix = "ProseMirror-menubar";

function buildMenuItems(context) {
    let groups = {
        types:  {type: 'dropdown', sortOrder: 100, label: context.translate("Type"), seperator: true, icon: icons.text, items: []},
        marks:  {type: 'group', id: 'marks-group', sortOrder: 200, items: []},
        format:  {type: 'group', id: 'format-group',  sortOrder: 300, items: [liftItem()]},
        insert: {type: 'dropdown', id: 'insert-dropdown',  sortOrder: 400, label: context.translate("Insert"), seperator: true, icon: icons.image, items: []},
        helper:  {type: 'group', id: 'helper-group', sortOrder: 500, items: [undoItem(), redoItem()]},
        resize:  {type: 'group', id: 'resize-group', sortOrder: 600, items: []},
    };

    let definitions = [groups.types, groups.insert, groups.marks, groups.format, groups.helper, groups.resize];

    context.plugins.forEach(function (plugin) {
        if(plugin.menu) {
            plugin.menu(context).forEach(function(menuDefinition) {
                if(checkMenuDefinition(context, menuDefinition)) {
                    menuDefinition.item.options.id = menuDefinition.id;

                    if(menuDefinition.group && groups[menuDefinition.group]) {
                        groups[menuDefinition.group].items.push(menuDefinition.item);
                    } else if(!menuDefinition.group) {
                        definitions.push(menuDefinition.item);
                    }
                }
            });
        }
    });

    //selectParentNodeItem -> don't know if we should add this one

    // TODO: fire event
    return definitions;
}

function checkMenuDefinition(context, menuDefinition) {
    if(!menuDefinition || menuDefinition.node && !context.schema.nodes[menuDefinition.node]) {
        return false;
    }

    if(menuDefinition.mark && !context.schema.marks[menuDefinition.mark]) {
        return false;
    }

    if(context.options.menu && Array.isArray(context.options.menu.exclude) && context.options.menu.exclude[menuDefinition.id]) {
        return false;
    }

    return true;
}

export function buildMenuBar(context) {
    context.menu = menuBar({
        content: buildMenuItems(context),
        floating: false,
        context: context
    });

    return context.menu;
}


function isIOS() {
    if (typeof navigator == "undefined") return false
    let agent = navigator.userAgent
    return !/Edge\/\d/.test(agent) && /AppleWebKit/.test(agent) && /Mobile\/\w+/.test(agent)
}

// :: (Object) → Plugin
// A plugin that will place a menu bar above the editor. Note that
// this involves wrapping the editor in an additional `<div>`.
//
//   options::-
//   Supports the following options:
//
//     content:: [[MenuElement]]
//     Provides the content of the menu, as a nested array to be
//     passed to `renderGrouped`.
//
//     floating:: ?bool
//     Determines whether the menu floats, i.e. whether it sticks to
//     the top of the viewport when the editor is partially scrolled
//     out of view.
export function menuBar(options) {
    return new Plugin({
        view(editorView) {
            options.context.menu = new MenuBarView(editorView, options);
            options.context.event.trigger('afterMenuBarInit', options.context.menu);
            return options.context.menu;
        }
    })
}

class MenuBarView {
    constructor(editorView, options) {
        this.editorView = editorView;
        this.options = options;
        this.context = this.options.context;

        this.wrapper = crelt("div", {class: prefix + "-wrapper"});
        this.menu = this.wrapper.appendChild(crelt("div", {class: prefix}));
        this.menu.className = prefix;
        this.spacer = null;

        editorView.dom.parentNode.replaceChild(this.wrapper, editorView.dom);
        this.wrapper.appendChild(editorView.dom);

        this.maxHeight = 0;
        this.widthForMaxHeight = 0;
        this.floating = false;

        this.groupItem = new MenuItemGroup(this.options.content);
        let dom = this.groupItem.render(this.editorView);

        this.menu.appendChild(dom);

        $(this.menu).on('mousedown', function(evt) {
            // Prevent focusout if we click outside of a menu item, but still inside menu container
            evt.preventDefault();
        });

        this.update();

        if (options.floating && !isIOS()) {
            this.updateFloat();
            this.scrollFunc = () => {
                let root = this.editorView.root;
                if (!(root.body || root).contains(this.wrapper))
                    window.removeEventListener("scroll", this.scrollFunc);
                else
                    this.updateFloat()
            };
            window.addEventListener("scroll", this.scrollFunc)
        }
    }

    update() {
        this.groupItem.update(this.editorView.state);

        let $mainGroup = $(this.menu).find('.'+prefix+'-menu-group:first');
        $mainGroup.find('');

        if (this.floating) {
            this.updateScrollCursor()
        } else {
            if (this.menu.offsetWidth != this.widthForMaxHeight) {
                this.widthForMaxHeight = this.menu.offsetWidth
                this.maxHeight = 0
            }
            if (this.menu.offsetHeight > this.maxHeight) {
                this.maxHeight = this.menu.offsetHeight;
            }
        }
        this.context.event.trigger('afterMenuBarUpdate', this);
    }

    updateScrollCursor() {
        let selection = this.editorView.root.getSelection();
        if (!selection.focusNode) return;
        let rects = selection.getRangeAt(0).getClientRects();
        let selRect = rects[selectionIsInverted(selection) ? 0 : rects.length - 1];
        if (!selRect) return;
        let menuRect = this.menu.getBoundingClientRect();
        if (selRect.top < menuRect.bottom && selRect.bottom > menuRect.top) {
            let scrollable = findWrappingScrollable(this.wrapper);
            if (scrollable) scrollable.scrollTop -= (menuRect.bottom - selRect.top)
        }
    }

    updateFloat() {
        let parent = this.wrapper, editorRect = parent.getBoundingClientRect();
        if (this.floating) {
            if (editorRect.top >= 0 || editorRect.bottom < this.menu.offsetHeight + 10) {
                this.floating = false;
                this.menu.style.position = this.menu.style.left = this.menu.style.width = "";
                this.menu.style.display = "";
                this.spacer.parentNode.removeChild(this.spacer);
                this.spacer = null
            } else {
                let border = (parent.offsetWidth - parent.clientWidth) / 2;
                this.menu.style.left = (editorRect.left + border) + "px";
                this.menu.style.display = (editorRect.top > window.innerHeight ? "none" : "")
            }
        } else {
            if (editorRect.top < 0 && editorRect.bottom >= this.menu.offsetHeight + 10) {
                this.floating = true;
                let menuRect = this.menu.getBoundingClientRect();
                this.menu.style.left = menuRect.left + "px";
                this.menu.style.width = menuRect.width + "px";
                this.menu.style.position = "fixed";
                this.spacer = crel("div", {class: prefix + "-spacer", style: `height: ${menuRect.height}px`});
                parent.insertBefore(this.spacer, this.menu)
            }
        }
    }

    destroy() {
        if (this.wrapper.parentNode)
            this.wrapper.parentNode.replaceChild(this.editorView.dom, this.wrapper)
    }
}

// Not precise, but close enough
function selectionIsInverted(selection) {
    if (selection.anchorNode == selection.focusNode) return selection.anchorOffset > selection.focusOffset;
    return selection.anchorNode.compareDocumentPosition(selection.focusNode) == Node.DOCUMENT_POSITION_FOLLOWING;
}

function findWrappingScrollable(node) {
    for (let cur = node.parentNode; cur; cur = cur.parentNode)
        if (cur.scrollHeight > cur.clientHeight) return cur
}
