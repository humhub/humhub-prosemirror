/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {MenuItem, icons, markActive, canInsertLink} from "../../menu/menu"
import { TextSelection } from 'prosemirror-state';
import {openPrompt, TextField} from "../../prompt";
import {toggleMark} from "prosemirror-commands";
import {validateHref} from "../../util/linkUtil";
import {escapeHtml} from "markdown-it/lib/common/utils";

function linkItem(context) {
    let mark = context.schema.marks.link;
    return new MenuItem({
        title: context.translate("Add or remove link"),
        sortOrder: 500,
        icon: icons.link,
        active(state) {
            return markActive(state, mark)
        },
        enable(state) {
            if(state.selection.empty) {
                return false;
            }

            return canInsertLink(state);
        },
        run(state, dispatch, view) {
            if (markActive(state, mark)) {
                toggleMark(mark)(state, dispatch);
                return true
            }

            promt(context.translate("Create a link"), context);
        }
    })
}

export function editNode(dom, context) {
    let doc = context.editor.view.state.doc;
    let view = context.editor.view;

    let nodePos = view.posAtDOM(dom);
    let node = doc.nodeAt(nodePos);

    if(node.type != context.schema.nodes.text) {
        return;
    }

    let $pos = doc.resolve(nodePos);
    let $end = $pos.node(0).resolve($pos.pos + node.nodeSize);
    view.dispatch(view.state.tr.setSelection(new TextSelection($pos, $end)).scrollIntoView());

    let mark = getLinkMark(node, context);

    promt(context.translate("Edit link"), context, $.extend({}, mark.attrs, {text: node.text}), node, mark);
}

export function promt(title, context, attrs, node, mark) {
    let view = context.editor.view;

    let fields =  {
        text:  new TextField({label: "Text", value: attrs && attrs.text}),
        href: new TextField({
            label: context.translate("Link target"),
            value: attrs && attrs.href,
            required: true,
            clean: (val) => {
                if (!validateHref(val))  {
                    return 'https://' + val;
                }

                return val;
            }
        }),
        title: new TextField({label: "Title", value: attrs && attrs.title})
    };

    if(!node) {
        delete fields['text'];
    }

    openPrompt({
        title: title,
        fields: fields,
        callback(attrs) {
            if(node) {
                if(mark.attrs.href === attrs.href) {
                    attrs.fileGuid = mark.attrs.fileGuid;
                }

                let newSet = mark.type.removeFromSet(node.marks);
                let newNode = node.copy(attrs.text);
                newNode.marks = newSet;

                delete attrs.text;

                mark.attrs = attrs;

                newNode.marks = mark.addToSet(newNode.marks);
                view.dispatch(view.state.tr.replaceSelectionWith(newNode, false));
            } else {
                toggleMark(context.schema.marks.link, attrs)(view.state, view.dispatch);
            }
            view.focus()
        }
    })
}

function getLinkMark(node, context) {
    let result = null;
    node.marks.forEach((mark) => {
        if(mark.type == context.schema.marks.link) {
            result = mark;
        }
    });

    return result;
}

export function menu(context) {
    return [
        {
            id: 'linkItem',
            mark: 'link',
            group: 'marks',
            item: linkItem(context)
        }
    ]
}

