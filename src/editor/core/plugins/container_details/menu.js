/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {icons, cmdItem, wrapItem} from "../../menu"
import {TextSelection, NodeSelection} from "prosemirror-state";
import {openPrompt, TextField, SelectField} from "../../prompt";

function wrapDetails(context) {
    return wrapItem(context.schema.nodes.container_details, {
        title: context.translate("Wrap in collapsible block"),
        icon: icons.container_details,
        hideOnCollapse: true,
        sortOrder: 300
    });
}

export function menu(context) {
    return [
        {
            id: 'wrapDetails',
            node: 'container_details',
            group: 'format',
            item: wrapDetails(context)
        }
    ]
}

export function editNode(node, nodePos, context) {
    let doc = context.editor.view.state.doc;
    let view = context.editor.view;

    if (node.type != context.schema.nodes.container_details) {
        return;
    }

    let $pos = doc.resolve(nodePos);
    let $end = $pos.node(0).resolve($pos.pos + node.nodeSize);

    view.dispatch(view.state.tr.setSelection(new TextSelection($pos, $end)));

    prompt(context.translate("Edit collapsible block"), context, node.attrs, node);
}

export function prompt(title, context, attrs, node) {
    let view = context.editor.view;

    let fields =  {
        summary:  new TextField({
            label: context.translate("Summary (supports markdown)"),
            value: attrs && attrs.summary
        }),
        state:  new SelectField({
            label: context.translate("State"),
            value: attrs && attrs.state,
            options: [
                {label: context.translate("Open"), value: "open"},
                {label: context.translate("Closed"), value: "closed"}
            ]
        }),
        style:  new SelectField({
            label: context.translate("Style"),
            value: attrs && attrs.style,
            options: [
                {label: context.translate("Default"), value: "default"},
                {label: context.translate("Box"), value: "box"}
            ]
        })
    };

    openPrompt({
        title: title,
        fields: fields,
        callback(attrs) {
            let newNode = context.schema.nodes.container_details.createAndFill(attrs)
            newNode.content = node.content

            view.dispatch(view.state.tr.replaceSelectionWith(newNode));
            view.focus()
        }
    })
}