/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */
import {MenuItem, canInsert} from "../../menu/"
import {TextField, openPrompt} from "../../prompt"
import {NodeSelection} from "prosemirror-state"

function insertImageItem(context) {
    return new MenuItem({
        title: context.translate("Insert image"),
        label: context.translate("Image"),
        sortOrder: 100,
        enable(state) {
            return canInsert(state, context.schema.nodes.image)
        },
        run(state, _, view) {
            let {from, to} = state.selection, attrs = null;
            if (state.selection instanceof NodeSelection && state.selection.node.type === context.schema.nodes.image) {
                attrs = state.selection.node.attrs
            }

            openPrompt({
                title: context.translate("Insert image"),
                fields: {
                    src: new TextField({label: context.translate("Location"), required: true, value: attrs && attrs.src}),
                    title: new TextField({label: context.translate("Title"), value: attrs && attrs.title}),
                    alt: new TextField({label: context.translate("Description"), value: attrs ? attrs.alt : state.doc.textBetween(from, to, " ")}),
                    width: new TextField({label: context.translate("Width"), value: attrs && attrs.width}),
                    height: new TextField({label: context.translate("Height"),  value: attrs && attrs.height})
                },
                callback(attrs) {
                    view.dispatch(view.state.tr.replaceSelectionWith(context.schema.nodes.image.createAndFill(attrs)));
                    view.focus()
                }
            })
        }
    })
}

export function menu(context) {
    return [
        {
            id: 'insertImage',
            node: 'image',
            group: 'insert',
            item: insertImageItem(context)
        }
    ]
}