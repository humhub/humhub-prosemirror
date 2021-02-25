import crelt from "crelt"
import {joinUp, selectParentNode, wrapIn, setBlockType, toggleMark} from "prosemirror-commands"
import {undo, redo} from "prosemirror-history"

import {getIcon} from "./icons"
import {liftTarget} from "prosemirror-transform";

const prefix = "ProseMirror-menu";

// Helpers to create specific types of items
export function cmdItem(cmd, options) {
    let passedOptions = {
        label: options.title,
        run: cmd
    };
    for (let prop in options) passedOptions[prop] = options[prop]
    if ((!options.enable || options.enable === true) && !options.select)
        passedOptions[options.enable ? "enable" : "select"] = state => cmd(state)

    return new MenuItem(passedOptions)
}

export function markItem(markType, options) {
    let passedOptions = {
        active(state) {
            return markActive(state, markType)
        },
        enable: true
    };
    for (let prop in options) passedOptions[prop] = options[prop]
    return cmdItem(toggleMark(markType), passedOptions)
}

export function markActive(state, type) {
    let {from, $from, to, empty} = state.selection
    if (empty) return type.isInSet(state.storedMarks || $from.marks())
    else return state.doc.rangeHasMark(from, to, type)
}

export function wrapListItem(nodeType, options) {
    return cmdItem(wrapInList(nodeType, options.attrs), options)
}

// ::- An icon or label that, when clicked, executes a command.
export class MenuItem {
    // :: (MenuItemSpec)
    constructor(options) {
        // :: MenuItemSpec
        // The options used to create the menu item.
        this.options = options || {};
        this.sortOrder = this.options.sortOrder;
    }

    // :: (EditorView) → {dom: dom.Node, update: (EditorState) → bool}
    // Renders the icon according to its [display
    // options](#menu.MenuItemSpec.display), and adds an event handler which
    // executes the command when the representation is clicked.
    render(view) {
        let options = this.options;

        if (typeof this.options.render === 'function') {
            return this.options.render.apply(this, [options]);
        }

        this.dom = options.icon ? getIcon(options.icon)
            : options.label ? $('<div>').html(translate(view, options.label))[0]
                : null;

        if(this.options.id) {
            this.dom.classList.add(prefix+'-'+this.options.id);
        }

        if (!this.dom) throw new RangeError("MenuItem without icon or label property");

        if (options.title !== 'undefined') {
            const title = (typeof options.title === "function" ? options.title(view.state) : options.title);
            this.dom.setAttribute("title", translate(view, title));
        }

        if (options.class) this.dom.classList.add(options.class);
        if (options.css) this.dom.style.cssText += options.css;

        $(this.dom).on("mousedown", e => {
            e.preventDefault();
            if (!$(this.dom).hasClass(prefix + "-disabled")) {
                options.run.call(this, view.state, view.dispatch, view, e);
            }
        });

        return this.dom;
    }

    switchIcon(icon, title) {
        if(title) {
            $(this.dom).attr('title', title);
        }
        $(this.dom).find('svg').replaceWith($(getIcon(icon)).find('svg'));
    }

    update(state) {
        this.adoptItemState(state);
        return this.selected;
    }

    adoptItemState(state, forceEnable, forceActive) {
        this.setEnabledItemState(state, forceEnable);
        this.setActiveItemState(state, forceActive);
        this.setSelectedItemState(state, forceEnable);
    }

    setActiveItemState(state, forceActive) {
        this.active = false;
        if (this.options.active) {
            this.active = (this.options.active(state) || forceActive) || false;
            setClass(this.dom, prefix + "-active", this.active)
        }
    }

    setEnabledItemState(state, forceEnable) {
        this.enabled = true;
        if (this.options.enable) {
            this.enabled = this.options.enable(state) || forceEnable || false;
            setClass(this.dom, prefix + "-disabled", !this.enabled)
        }
    }

    setSelectedItemState(state, forceEnable) {
        this.selected = true;
        if (this.options.select) {
            this.selected = this.options.select(state);
            this.dom.style.display = this.selected || forceEnable ? "" : "none";

            if(!this.selected) {
                this.dom.classList.add('hidden');
            } else {
                this.dom.classList.remove('hidden');
            }
            if (!this.selected) return false
        }
    }
}

function translate(view, text) {
    return view._props.translate ? view._props.translate(text) : text
}

// MenuItemSpec:: interface
// The configuration object passed to the `MenuItem` constructor.
//
//   run:: (EditorState, (Transaction), EditorView, dom.Event)
//   The function to execute when the menu item is activated.
//
//   select:: ?(EditorState) → bool
//   Optional function that is used to determine whether the item is
//   appropriate at the moment. Deselected items will be hidden.
//
//   enable:: ?(EditorState) → bool
//   Function that is used to determine if the item is enabled. If
//   given and returning false, the item will be given a disabled
//   styling.
//
//   active:: ?(EditorState) → bool
//   A predicate function to determine whether the item is 'active' (for
//   example, the item for toggling the strong mark might be active then
//   the cursor is in strong text).
//
//   render:: ?(EditorView) → dom.Node
//   A function that renders the item. You must provide either this,
//   [`icon`](#menu.MenuItemSpec.icon), or [`label`](#MenuItemSpec.label).
//
//   icon:: ?Object
//   Describes an icon to show for this item. The object may specify
//   an SVG icon, in which case its `path` property should be an [SVG
//   path
//   spec](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d),
//   and `width` and `height` should provide the viewbox in which that
//   path exists. Alternatively, it may have a `text` property
//   specifying a string of text that makes up the icon, with an
//   optional `css` property giving additional CSS styling for the
//   text. _Or_ it may contain `dom` property containing a DOM node.
//
//   label:: ?string
//   Makes the item show up as a text label. Mostly useful for items
//   wrapped in a [drop-down](#menu.Dropdown) or similar menu. The object
//   should have a `label` property providing the text to display.
//
//   title:: ?union<string, (EditorState) → string>
//   Defines DOM title (mouseover) text for the item.
//
//   class:: string
//   Optionally adds a CSS class to the item's DOM representation.
//
//   css:: string
//   Optionally adds a string of inline CSS to the item's DOM
//   representation.
//
//   execEvent:: string
//   Defines which event on the command's DOM representation should
//   trigger the execution of the command. Defaults to mousedown.

let lastMenuEvent = {time: 0, node: null};

function markMenuEvent(e) {
    lastMenuEvent.time = Date.now();
    lastMenuEvent.node = e.target
}

function isMenuEvent(wrapper) {
    return Date.now() - 100 < lastMenuEvent.time &&
        lastMenuEvent.node && wrapper.contains(lastMenuEvent.node)
}

function sort(items) {
    let result = [];
    items.forEach((item) => {
        if (item && item.type && item.type === 'dropdown') {
            result.push(new Dropdown(sort(item.items), item));
        } else if (item && item.type && item.type === 'group') {
            result.push(new MenuItemGroup(sort(item.items), item));
        } else if (item) {
            result.push(item);
        }
    });

    return result.sort(function (a, b) {
        if (typeof a.sortOrder === 'undefined') {
            return 1;
        }
        if (typeof b.sortOrder === 'undefined') {
            return -1;
        }
        return a.sortOrder - b.sortOrder;
    });
}


export class MenuItemGroup extends MenuItem {
    constructor(content, options) {
        super(options);
        this.content = {
            items: sort(Array.isArray(content) ? content : [content]),
            update: (state) => {

                let result = false;

                sort(this.content.items).forEach((item, i) => {
                    let updateResult = item.update(state);
                    let $item = $(item.dom);

                    if(!updateResult) {
                        $item.hide();
                    } else {
                        $item.show();
                    }

                    if((i === this.content.items.length - 1)) {
                        $item.addClass('last');
                    }

                    result = result || updateResult;
                });
                return result;
            }
        };
    }

    render(view) {
        let $dom = $('<div>').addClass(prefix + '-group');

        if(this.options.id) {
            $dom.addClass(this.options.id);
        }

        this.renderItems(view).forEach((itemDom) => {
            $dom.append(itemDom);
        });

        return this.dom = $dom[0];
    }

    update(state) {
        return this.content.update(state);
    }

    renderItems(view) {
        let rendered = [];

        this.content.items.forEach((item) => {
            let dom = item.render(view);
            rendered.push(crelt("div", {class: prefix + "item"}, dom));
        });

        return rendered;
    }
}

// ::- A drop-down menu, displayed as a label with a downwards-pointing
// triangle to the right of it.
export class Dropdown extends MenuItemGroup {
    // :: ([MenuElement], ?Object)
    // Create a dropdown wrapping the elements. Options may include
    // the following properties:
    //
    // **`label`**`: string`
    //   : The label to show on the drop-down control.
    //
    // **`title`**`: string`
    //   : Sets the
    //     [`title`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title)
    //     attribute given to the menu control.
    //
    // **`class`**`: string`
    //   : When given, adds an extra CSS class to the menu control.
    //
    // **`css`**`: string`
    //   : When given, adds an extra set of CSS styles to the menu control.
    constructor(content, options) {
        super(content, options);
        this.content.update = (state) => {
            let result = false;
            this.content.items.forEach((item) => {
                let updateResult = item.update(state);
                item.dom.style.display = updateResult ? "" : "none";
                result = result || updateResult;
            });
            return result;
        };
    }

    // :: (EditorView) → {dom: dom.Node, update: (EditorState)}
    // Render the dropdown menu and sub-items.
    render(view) {
        let contentDom = this.renderItems(view);

        let innerDom = this.options.icon ? getIcon(this.options.icon)
            : this.options.label ? crelt("div", {style: this.options.css}, translate(view, this.options.label))
                : null;

        if (!innerDom) {
            throw new RangeError("Dropdown without icon or label property")
        }

        innerDom.className += " " + prefix + "-dropdown " + (this.options.class || "");

        if (this.options.title) {
            innerDom.setAttribute("title", translate(view, this.options.title));
        }

        if(this.options.id) {
            innerDom.classList.add(this.options.id);
        }

        this.dom = crelt("div", {class: prefix + "-dropdown-wrap"}, innerDom);

        if(this.options.seperator) {
            this.dom.className += ' seperator';
        }

        let open = null, listeningOnClose = null;
        let close = () => {
            if (open && open.close()) {
                open = null;
                window.removeEventListener("mousedown", listeningOnClose)
            }
        };

        innerDom.addEventListener("mousedown", e => {
            e.preventDefault();
            if (!this.selected || !this.enabled) return;
            markMenuEvent(e);
            if (open) {
                close()
            } else {
                open = this.expand(this.dom, contentDom);
                window.addEventListener("mousedown", listeningOnClose = () => {
                    if (!isMenuEvent(this.dom)) close()
                })
            }
        });

        return this.dom;
    }

    renderItems(view) {
        let rendered = [];

        this.content.items.forEach((item) => {
            let dom = item.render(view);
            rendered.push(crelt("div", {class: prefix + "-dropdown-item"}, dom));
        });

        return rendered;
    }

    update(state) {
        let contentUpdateResult = this.content.update(state);
        this.dom.style.display = contentUpdateResult ? "" : "none";

        let innerEnabled = false;
        let innerActive = false;

        this.content.items.forEach((item) => {
            innerEnabled = innerEnabled || item.enabled;
            innerActive = innerActive || item.active;
        });

        this.adoptItemState(state, innerEnabled, innerActive);
        return contentUpdateResult;
    }

    expand(dom, contentDom) {
        let menuDOM = crelt("div", {class: prefix + "-dropdown-menu " + (this.options.class || "")}, contentDom);



        let done = false;

        function close() {
            if (done) return;
            done = true;
            dom.removeChild(menuDOM);
            return true
        }

        dom.appendChild(menuDOM);

        var $menuDom = $(menuDOM);
        var right = $menuDom.offset().left + $menuDom.width() ;

        if(right > $(window).width() / 2) {
            $menuDom.addClass(prefix + "-dropdown-right");
        } else {
            $menuDom.removeClass(prefix + "-dropdown-right");
        }

        return {close, node: menuDOM}
    }
}

// ::- Represents a submenu wrapping a group of elements that start
// hidden and expand to the right when hovered over or tapped.
export class DropdownSubmenu extends Dropdown {
    // :: ([MenuElement], ?Object)
    // Creates a submenu for the given group of menu elements. The
    // following options are recognized:
    //
    // **`label`**`: string`
    //   : The label to show on the submenu.
    constructor(content, options) {
        super(content, options);
    }

    // :: (EditorView) → {dom: dom.Node, update: (EditorState) → bool}
    // Renders the submenu.
    render(view) {
        let itemDom = this.renderItems(view);

        let innerDom = $('<div>').addClass(prefix + "-submenu-label").html(translate(view, this.options.label))[0];

        //let innerDom = crelt("div", {class: prefix + "-submenu-label"}, translate(view, this.options.label));
        this.dom = crelt("div", {class: prefix + "-submenu-wrap"}, innerDom,
            crelt("div", {class: prefix + "-submenu"}, itemDom));
        let listeningOnClose = null;

        innerDom.addEventListener("mousedown", e => {
            e.preventDefault();
            markMenuEvent(e);
            setClass(this.dom, prefix + "-submenu-wrap-active");
            if (!listeningOnClose)
                window.addEventListener("mousedown", listeningOnClose = () => {
                    if (!isMenuEvent(this.dom)) {
                        this.dom.classList.remove(prefix + "-submenu-wrap-active");
                        window.removeEventListener("mousedown", listeningOnClose);
                        listeningOnClose = null
                    }
                })
        });

        return this.dom;
    }

    update(state) {
        let contentUpdateResult = this.content.update(state);
        this.dom.style.display = contentUpdateResult ? "" : "none";
        return contentUpdateResult;
    }
}

// :: Object
// A set of basic editor-related icons. Contains the properties
// `join`, `lift`, `selectParentNode`, `undo`, `redo`, `strong`, `em`,
// `code`, `link`, `bulletList`, `orderedList`, and `blockquote`, each
// holding an object that can be used as the `icon` option to
// `MenuItem`.
export const icons = {
    headline: {
        width: 27, height: 27,
        path: "M26.281 26c-1.375 0-2.766-0.109-4.156-0.109-1.375 0-2.75 0.109-4.125 0.109-0.531 0-0.781-0.578-0.781-1.031 0-1.391 1.563-0.797 2.375-1.328 0.516-0.328 0.516-1.641 0.516-2.188l-0.016-6.109c0-0.172 0-0.328-0.016-0.484-0.25-0.078-0.531-0.063-0.781-0.063h-10.547c-0.266 0-0.547-0.016-0.797 0.063-0.016 0.156-0.016 0.313-0.016 0.484l-0.016 5.797c0 0.594 0 2.219 0.578 2.562 0.812 0.5 2.656-0.203 2.656 1.203 0 0.469-0.219 1.094-0.766 1.094-1.453 0-2.906-0.109-4.344-0.109-1.328 0-2.656 0.109-3.984 0.109-0.516 0-0.75-0.594-0.75-1.031 0-1.359 1.437-0.797 2.203-1.328 0.5-0.344 0.516-1.687 0.516-2.234l-0.016-0.891v-12.703c0-0.75 0.109-3.156-0.594-3.578-0.781-0.484-2.453 0.266-2.453-1.141 0-0.453 0.203-1.094 0.75-1.094 1.437 0 2.891 0.109 4.328 0.109 1.313 0 2.641-0.109 3.953-0.109 0.562 0 0.781 0.625 0.781 1.094 0 1.344-1.547 0.688-2.312 1.172-0.547 0.328-0.547 1.937-0.547 2.5l0.016 5c0 0.172 0 0.328 0.016 0.5 0.203 0.047 0.406 0.047 0.609 0.047h10.922c0.187 0 0.391 0 0.594-0.047 0.016-0.172 0.016-0.328 0.016-0.5l0.016-5c0-0.578 0-2.172-0.547-2.5-0.781-0.469-2.344 0.156-2.344-1.172 0-0.469 0.219-1.094 0.781-1.094 1.375 0 2.75 0.109 4.125 0.109 1.344 0 2.688-0.109 4.031-0.109 0.562 0 0.781 0.625 0.781 1.094 0 1.359-1.609 0.672-2.391 1.156-0.531 0.344-0.547 1.953-0.547 2.516l0.016 14.734c0 0.516 0.031 1.875 0.531 2.188 0.797 0.5 2.484-0.141 2.484 1.219 0 0.453-0.203 1.094-0.75 1.094z"
    },
    plus: {
        width: 32, height: 32,
        path: "M31 12h-11v-11c0-0.552-0.448-1-1-1h-6c-0.552 0-1 0.448-1 1v11h-11c-0.552 0-1 0.448-1 1v6c0 0.552 0.448 1 1 1h11v11c0 0.552 0.448 1 1 1h6c0.552 0 1-0.448 1-1v-11h11c0.552 0 1-0.448 1-1v-6c0-0.552-0.448-1-1-1z"
    },
    table: {
        width: 32, height: 32,
        path: "M0 2v28h32v-28h-32zM12 20v-6h8v6h-8zM20 22v6h-8v-6h8zM20 6v6h-8v-6h8zM10 6v6h-8v-6h8zM2 14h8v6h-8v-6zM22 14h8v6h-8v-6zM22 12v-6h8v6h-8zM2 22h8v6h-8v-6zM22 28v-6h8v6h-8z"
    },
    join: {
        width: 800, height: 900,
        path: "M0 75h800v125h-800z M0 825h800v-125h-800z M250 400h100v-100h100v100h100v100h-100v100h-100v-100h-100z"
    },
    lift: {
        width: 1024, height: 1024,
        path: "M219 310v329q0 7-5 12t-12 5q-8 0-13-5l-164-164q-5-5-5-13t5-13l164-164q5-5 13-5 7 0 12 5t5 12zM1024 749v109q0 7-5 12t-12 5h-987q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h987q7 0 12 5t5 12zM1024 530v109q0 7-5 12t-12 5h-621q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h621q7 0 12 5t5 12zM1024 310v109q0 7-5 12t-12 5h-621q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h621q7 0 12 5t5 12zM1024 91v109q0 7-5 12t-12 5h-987q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h987q7 0 12 5t5 12z"
    },
    indent: {
        width: 28, height: 28,
        path: "M5.5 13c0 0.125-0.047 0.266-0.141 0.359l-4.5 4.5c-0.094 0.094-0.234 0.141-0.359 0.141-0.266 0-0.5-0.234-0.5-0.5v-9c0-0.266 0.234-0.5 0.5-0.5 0.125 0 0.266 0.047 0.359 0.141l4.5 4.5c0.094 0.094 0.141 0.234 0.141 0.359zM28 20.5v3c0 0.266-0.234 0.5-0.5 0.5h-27c-0.266 0-0.5-0.234-0.5-0.5v-3c0-0.266 0.234-0.5 0.5-0.5h27c0.266 0 0.5 0.234 0.5 0.5zM28 14.5v3c0 0.266-0.234 0.5-0.5 0.5h-17c-0.266 0-0.5-0.234-0.5-0.5v-3c0-0.266 0.234-0.5 0.5-0.5h17c0.266 0 0.5 0.234 0.5 0.5zM28 8.5v3c0 0.266-0.234 0.5-0.5 0.5h-17c-0.266 0-0.5-0.234-0.5-0.5v-3c0-0.266 0.234-0.5 0.5-0.5h17c0.266 0 0.5 0.234 0.5 0.5zM28 2.5v3c0 0.266-0.234 0.5-0.5 0.5h-27c-0.266 0-0.5-0.234-0.5-0.5v-3c0-0.266 0.234-0.5 0.5-0.5h27c0.266 0 0.5 0.234 0.5 0.5z"
    },
    outdent: {
        width: 28, height: 28,
        path: "M6 8.5v9c0 0.266-0.234 0.5-0.5 0.5-0.125 0-0.266-0.047-0.359-0.141l-4.5-4.5c-0.094-0.094-0.141-0.234-0.141-0.359s0.047-0.266 0.141-0.359l4.5-4.5c0.094-0.094 0.234-0.141 0.359-0.141 0.266 0 0.5 0.234 0.5 0.5zM28 20.5v3c0 0.266-0.234 0.5-0.5 0.5h-27c-0.266 0-0.5-0.234-0.5-0.5v-3c0-0.266 0.234-0.5 0.5-0.5h27c0.266 0 0.5 0.234 0.5 0.5zM28 14.5v3c0 0.266-0.234 0.5-0.5 0.5h-17c-0.266 0-0.5-0.234-0.5-0.5v-3c0-0.266 0.234-0.5 0.5-0.5h17c0.266 0 0.5 0.234 0.5 0.5zM28 8.5v3c0 0.266-0.234 0.5-0.5 0.5h-17c-0.266 0-0.5-0.234-0.5-0.5v-3c0-0.266 0.234-0.5 0.5-0.5h17c0.266 0 0.5 0.234 0.5 0.5zM28 2.5v3c0 0.266-0.234 0.5-0.5 0.5h-27c-0.266 0-0.5-0.234-0.5-0.5v-3c0-0.266 0.234-0.5 0.5-0.5h27c0.266 0 0.5 0.234 0.5 0.5z"
    },
    selectParentNode: {text: "\u2b1a", css: "font-weight: bold"},
    undo: {
        width: 1024, height: 1024,
        path: "M761 1024c113-206 132-520-313-509v253l-384-384 384-384v248c534-13 594 472 313 775z"
    },
    redo: {
        width: 1024, height: 1024,
        path: "M576 248v-248l384 384-384 384v-253c-446-10-427 303-313 509-280-303-221-789 313-775z"
    },
    strong: {
        width: 805, height: 1024,
        path: "M317 869q42 18 80 18 214 0 214-191 0-65-23-102-15-25-35-42t-38-26-46-14-48-6-54-1q-41 0-57 5 0 30-0 90t-0 90q0 4-0 38t-0 55 2 47 6 38zM309 442q24 4 62 4 46 0 81-7t62-25 42-51 14-81q0-40-16-70t-45-46-61-24-70-8q-28 0-74 7 0 28 2 86t2 86q0 15-0 45t-0 45q0 26 0 39zM0 950l1-53q8-2 48-9t60-15q4-6 7-15t4-19 3-18 1-21 0-19v-37q0-561-12-585-2-4-12-8t-25-6-28-4-27-2-17-1l-2-47q56-1 194-6t213-5q13 0 39 0t38 0q40 0 78 7t73 24 61 40 42 59 16 78q0 29-9 54t-22 41-36 32-41 25-48 22q88 20 146 76t58 141q0 57-20 102t-53 74-78 48-93 27-100 8q-25 0-75-1t-75-1q-60 0-175 6t-132 6z"
    },
    em: {
        width: 585, height: 1024,
        path: "M0 949l9-48q3-1 46-12t63-21q16-20 23-57 0-4 35-165t65-310 29-169v-14q-13-7-31-10t-39-4-33-3l10-58q18 1 68 3t85 4 68 1q27 0 56-1t69-4 56-3q-2 22-10 50-17 5-58 16t-62 19q-4 10-8 24t-5 22-4 26-3 24q-15 84-50 239t-44 203q-1 5-7 33t-11 51-9 47-3 32l0 10q9 2 105 17-1 25-9 56-6 0-18 0t-18 0q-16 0-49-5t-49-5q-78-1-117-1-29 0-81 5t-69 6z"
    },
    emoji: {
        width: 20, height: 20,
        path: "M10 0.4c-5.302 0-9.6 4.298-9.6 9.6s4.298 9.6 9.6 9.6c5.301 0 9.6-4.298 9.6-9.601 0-5.301-4.299-9.599-9.6-9.599zM10 17.599c-4.197 0-7.6-3.402-7.6-7.6s3.402-7.599 7.6-7.599c4.197 0 7.601 3.402 7.601 7.6s-3.404 7.599-7.601 7.599zM7.501 9.75c0.828 0 1.499-0.783 1.499-1.75s-0.672-1.75-1.5-1.75-1.5 0.783-1.5 1.75 0.672 1.75 1.501 1.75zM12.5 9.75c0.829 0 1.5-0.783 1.5-1.75s-0.672-1.75-1.5-1.75-1.5 0.784-1.5 1.75 0.672 1.75 1.5 1.75zM14.341 11.336c-0.363-0.186-0.815-0.043-1.008 0.32-0.034 0.066-0.869 1.593-3.332 1.593-2.451 0-3.291-1.513-3.333-1.592-0.188-0.365-0.632-0.514-1.004-0.329-0.37 0.186-0.52 0.636-0.335 1.007 0.050 0.099 1.248 2.414 4.672 2.414 3.425 0 4.621-2.316 4.67-2.415 0.184-0.367 0.036-0.81-0.33-0.998z"
    },
    code: {
        width: 896, height: 1024,
        path: "M608 192l-96 96 224 224-224 224 96 96 288-320-288-320zM288 192l-288 320 288 320 96-96-224-224 224-224-96-96z"
    },
    embed: {
        width: 40, height: 32,
        path: [
            'M26 23l3 3 10-10-10-10-3 3 7 7z',
            'M14 9l-3-3-10 10 10 10 3-3-7-7z',
            'M21.916 4.704l2.171 0.592-6 22.001-2.171-0.592 6-22.001z'
        ]
    },
    text: {
        width: 768, height: 768,
        path: [
            'M688.5 288v96h-96v223.5h-96v-223.5h-96v-96h288z',
            'M79.5 127.5h417v96h-160.5v384h-96v-384h-160.5v-96z'
        ]
    },
    image: {
        width: 512, height: 512,
        path: [
            'M479.942 64c0.020 0.017 0.041 0.038 0.058 0.058v383.885c-0.017 0.020-0.038 0.041-0.058 0.058h-447.885c-0.020-0.017-0.041-0.038-0.057-0.058v-383.886c0.017-0.020 0.038-0.041 0.057-0.057h447.885zM480 32h-448c-17.6 0-32 14.4-32 32v384c0 17.6 14.4 32 32 32h448c17.6 0 32-14.4 32-32v-384c0-17.6-14.4-32-32-32v0z',
            'M416 144c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48z',
            'M448 416h-384v-64l112-192 128 160h32l112-96z'
        ]
    },
    add: {
        width: 22, height: 28,
        path: "M18 12.5v1c0 0.281-0.219 0.5-0.5 0.5h-5.5v5.5c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-5.5h-5.5c-0.281 0-0.5-0.219-0.5-0.5v-1c0-0.281 0.219-0.5 0.5-0.5h5.5v-5.5c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5v5.5h5.5c0.281 0 0.5 0.219 0.5 0.5zM20 19.5v-13c0-1.375-1.125-2.5-2.5-2.5h-13c-1.375 0-2.5 1.125-2.5 2.5v13c0 1.375 1.125 2.5 2.5 2.5h13c1.375 0 2.5-1.125 2.5-2.5zM22 6.5v13c0 2.484-2.016 4.5-4.5 4.5h-13c-2.484 0-4.5-2.016-4.5-4.5v-13c0-2.484 2.016-4.5 4.5-4.5h13c2.484 0 4.5 2.016 4.5 4.5z"
    },
    link: {
        width: 951, height: 1024,
        path: "M832 694q0-22-16-38l-118-118q-16-16-38-16-24 0-41 18 1 1 10 10t12 12 8 10 7 14 2 15q0 22-16 38t-38 16q-8 0-15-2t-14-7-10-8-12-12-10-10q-18 17-18 41 0 22 16 38l117 118q15 15 38 15 22 0 38-14l84-83q16-16 16-38zM430 292q0-22-16-38l-117-118q-16-16-38-16-22 0-38 15l-84 83q-16 16-16 38 0 22 16 38l118 118q15 15 38 15 24 0 41-17-1-1-10-10t-12-12-8-10-7-14-2-15q0-22 16-38t38-16q8 0 15 2t14 7 10 8 12 12 10 10q18-17 18-41zM941 694q0 68-48 116l-84 83q-47 47-116 47-69 0-116-48l-117-118q-47-47-47-116 0-70 50-119l-50-50q-49 50-118 50-68 0-116-48l-118-118q-48-48-48-116t48-116l84-83q47-47 116-47 69 0 116 48l117 118q47 47 47 116 0 70-50 119l50 50q49-50 118-50 68 0 116 48l118 118q48 48 48 116z"
    },
    bulletList: {
        width: 768, height: 896,
        path: "M0 512h128v-128h-128v128zM0 256h128v-128h-128v128zM0 768h128v-128h-128v128zM256 512h512v-128h-512v128zM256 256h512v-128h-512v128zM256 768h512v-128h-512v128z"
    },
    orderedList: {
        width: 768, height: 896,
        path: "M320 512h448v-128h-448v128zM320 768h448v-128h-448v128zM320 128v128h448v-128h-448zM79 384h78v-256h-36l-85 23v50l43-2v185zM189 590c0-36-12-78-96-78-33 0-64 6-83 16l1 66c21-10 42-15 67-15s32 11 32 28c0 26-30 58-110 112v50h192v-67l-91 2c49-30 87-66 87-113l1-1z"
    },
    blockquote: {
        width: 640, height: 896,
        path: "M0 448v256h256v-256h-128c0 0 0-128 128-128v-128c0 0-256 0-256 256zM640 320v-128c0 0-256 0-256 256v256h256v-256h-128c0 0 0-128 128-128z"
    },
    strikethrough: {
        width: 28, height: 28,
        path: "M27.5 14c0.281 0 0.5 0.219 0.5 0.5v1c0 0.281-0.219 0.5-0.5 0.5h-27c-0.281 0-0.5-0.219-0.5-0.5v-1c0-0.281 0.219-0.5 0.5-0.5h27zM7.547 13c-0.297-0.375-0.562-0.797-0.797-1.25-0.5-1.016-0.75-2-0.75-2.938 0-1.906 0.703-3.5 2.094-4.828s3.437-1.984 6.141-1.984c0.594 0 1.453 0.109 2.609 0.297 0.688 0.125 1.609 0.375 2.766 0.75 0.109 0.406 0.219 1.031 0.328 1.844 0.141 1.234 0.219 2.187 0.219 2.859 0 0.219-0.031 0.453-0.078 0.703l-0.187 0.047-1.313-0.094-0.219-0.031c-0.531-1.578-1.078-2.641-1.609-3.203-0.922-0.953-2.031-1.422-3.281-1.422-1.188 0-2.141 0.313-2.844 0.922s-1.047 1.375-1.047 2.281c0 0.766 0.344 1.484 1.031 2.188s2.141 1.375 4.359 2.016c0.75 0.219 1.641 0.562 2.703 1.031 0.562 0.266 1.062 0.531 1.484 0.812h-11.609zM15.469 17h6.422c0.078 0.438 0.109 0.922 0.109 1.437 0 1.125-0.203 2.234-0.641 3.313-0.234 0.578-0.594 1.109-1.109 1.625-0.375 0.359-0.938 0.781-1.703 1.266-0.781 0.469-1.563 0.828-2.391 1.031-0.828 0.219-1.875 0.328-3.172 0.328-0.859 0-1.891-0.031-3.047-0.359l-2.188-0.625c-0.609-0.172-0.969-0.313-1.125-0.438-0.063-0.063-0.125-0.172-0.125-0.344v-0.203c0-0.125 0.031-0.938-0.031-2.438-0.031-0.781 0.031-1.328 0.031-1.641v-0.688l1.594-0.031c0.578 1.328 0.844 2.125 1.016 2.406 0.375 0.609 0.797 1.094 1.25 1.469s1 0.672 1.641 0.891c0.625 0.234 1.328 0.344 2.063 0.344 0.656 0 1.391-0.141 2.172-0.422 0.797-0.266 1.437-0.719 1.906-1.344 0.484-0.625 0.734-1.297 0.734-2.016 0-0.875-0.422-1.687-1.266-2.453-0.344-0.297-1.062-0.672-2.141-1.109z"
    },
    enlarge: {
        width:32, height: 32,
        path: "M32 0v13l-5-5-6 6-3-3 6-6-5-5zM14 21l-6 6 5 5h-13v-13l5 5 6-6z"
    },
    angleDoubleRight: {
        width:16, height: 28,
        path: "M9.297 15c0 0.125-0.063 0.266-0.156 0.359l-7.281 7.281c-0.094 0.094-0.234 0.156-0.359 0.156s-0.266-0.063-0.359-0.156l-0.781-0.781c-0.094-0.094-0.156-0.234-0.156-0.359s0.063-0.266 0.156-0.359l6.141-6.141-6.141-6.141c-0.094-0.094-0.156-0.234-0.156-0.359s0.063-0.266 0.156-0.359l0.781-0.781c0.094-0.094 0.234-0.156 0.359-0.156s0.266 0.063 0.359 0.156l7.281 7.281c0.094 0.094 0.156 0.234 0.156 0.359zM15.297 15c0 0.125-0.063 0.266-0.156 0.359l-7.281 7.281c-0.094 0.094-0.234 0.156-0.359 0.156s-0.266-0.063-0.359-0.156l-0.781-0.781c-0.094-0.094-0.156-0.234-0.156-0.359s0.063-0.266 0.156-0.359l6.141-6.141-6.141-6.141c-0.094-0.094-0.156-0.234-0.156-0.359s0.063-0.266 0.156-0.359l0.781-0.781c0.094-0.094 0.234-0.156 0.359-0.156s0.266 0.063 0.359 0.156l7.281 7.281c0.094 0.094 0.156 0.234 0.156 0.359z"
    },
    angleDoubleLeft: {
        width:16, height: 28,
        path: "M9.797 21.5c0 0.125-0.063 0.266-0.156 0.359l-0.781 0.781c-0.094 0.094-0.234 0.156-0.359 0.156s-0.266-0.063-0.359-0.156l-7.281-7.281c-0.094-0.094-0.156-0.234-0.156-0.359s0.063-0.266 0.156-0.359l7.281-7.281c0.094-0.094 0.234-0.156 0.359-0.156s0.266 0.063 0.359 0.156l0.781 0.781c0.094 0.094 0.156 0.234 0.156 0.359s-0.063 0.266-0.156 0.359l-6.141 6.141 6.141 6.141c0.094 0.094 0.156 0.234 0.156 0.359zM15.797 21.5c0 0.125-0.063 0.266-0.156 0.359l-0.781 0.781c-0.094 0.094-0.234 0.156-0.359 0.156s-0.266-0.063-0.359-0.156l-7.281-7.281c-0.094-0.094-0.156-0.234-0.156-0.359s0.063-0.266 0.156-0.359l7.281-7.281c0.094-0.094 0.234-0.156 0.359-0.156s0.266 0.063 0.359 0.156l0.781 0.781c0.094 0.094 0.156 0.234 0.156 0.359s-0.063 0.266-0.156 0.359l-6.141 6.141 6.141 6.141c0.094 0.094 0.156 0.234 0.156 0.359z"
    },
    shrink: {
        width:32, height: 32,
        path: "M14 18v13l-5-5-6 6-3-3 6-6-5-5zM32 3l-6 6 5 5h-13v-13l5 5 6-6z"
    }
};

// :: MenuItem
// Menu item for the `joinUp` command.
export const joinUpItem = function () {
    return new MenuItem({
        title: "Join with above block",
        run: joinUp,
        select: state => joinUp(state),
        icon: icons.join
    });
};

// :: MenuItem
// Menu item for the `lift` command.
export const liftItem = function () {
    return new MenuItem({
        title: "Lift out of enclosing block",
        run: lift,
        select: state => lift(state),
        icon: icons.outdent
    });
};

function lift(state, dispatch) {
    var ref = state.selection;
    var $from = ref.$from;
    var $to = ref.$to;

    var inList = $from.blockRange($to, function (node) {
        return node.childCount && node.firstChild.type.name === 'list_item';
    });

    if(inList) {
        return false;
    }

    var range = $from.blockRange($to), target = range && liftTarget(range);
    if (target == null) { return false }
    if (dispatch) { dispatch(state.tr.lift(range, target).scrollIntoView()); }
    return true
}

// :: MenuItem
// Menu item for the `selectParentNode` command.
export const selectParentNodeItem = function () {
    return new MenuItem({
        title: "Select parent node",
        run: selectParentNode,
        select: state => selectParentNode(state),
        icon: icons.selectParentNode
    });
};

// :: (Object) → MenuItem
// Menu item for the `undo` command.
export let undoItem = function () {
    return new MenuItem({
        title: "Undo last change",
        run: undo,
        enable: state => undo(state),
        icon: icons.undo
    });
};

// :: (Object) → MenuItem
// Menu item for the `redo` command.
export let redoItem = function () {
    return new MenuItem({
        title: "Redo last undone change",
        run: redo,
        enable: state => redo(state),
        icon: icons.redo
    });
};

// :: (NodeType, Object) → MenuItem
// Build a menu item for wrapping the selection in a given node type.
// Adds `run` and `select` properties to the ones present in
// `options`. `options.attrs` may be an object or a function, as in
// `toggleMarkItem`.
export function wrapItem(nodeType, options) {
    let passedOptions = {
        run(state, dispatch) {
            // FIXME if (options.attrs instanceof Function) options.attrs(state, attrs => wrapIn(nodeType, attrs)(state))
            return wrapIn(nodeType, options.attrs)(state, dispatch)
        },
        select(state) {
            return wrapIn(nodeType, options.attrs instanceof Function ? null : options.attrs)(state)
        }
    };
    for (let prop in options) passedOptions[prop] = options[prop]
    return new MenuItem(passedOptions)
}

// :: (NodeType, Object) → MenuItem
// Build a menu item for changing the type of the textblock around the
// selection to the given type. Provides `run`, `active`, and `select`
// properties. Others must be given in `options`. `options.attrs` may
// be an object to provide the attributes for the textblock node.
export function blockTypeItem(nodeType, options) {
    let command = setBlockType(nodeType, options.attrs)
    let passedOptions = {
        run: command,
        enable(state) {
            return command(state)
        },
        active(state) {
            let {$from, to, node} = state.selection
            if (node) return node.hasMarkup(nodeType, options.attrs)
            return to <= $from.end() && $from.parent.hasMarkup(nodeType, options.attrs)
        }
    };
    for (let prop in options) passedOptions[prop] = options[prop]
    return new MenuItem(passedOptions)
}

// Work around classList.toggle being broken in IE11
function setClass(dom, cls, on) {
    if (on) dom.classList.add(cls)
    else dom.classList.remove(cls)
}

export function canInsert(state, nodeType) {
    let $from = state.selection.$from;
    for (let d = $from.depth; d >= 0; d--) {
        let index = $from.index(d)
        if ($from.node(d).canReplaceWith(index, index, nodeType)) return true
    }
    return false
}

export function canInsertLink(state) {
    var allowLink = true;
    state.doc.nodesBetween(state.selection.$from.pos, state.selection.$to.pos, function(node) {
        if(node.type.spec.code) {
            allowLink = false;
        } else {
            node.marks.forEach(function(mark) {
                let spec = mark.type.spec;
                if(spec.preventMarks && $.inArray('link', spec.preventMarks) >= 0) {
                    allowLink = false;
                }
            });
        }
    });

    return allowLink;
}
