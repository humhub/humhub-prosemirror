/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */
import {MenuItem, canInsert} from "../../menu/"
import {TextField, openPrompt} from "../../prompt"
import {NodeSelection} from "prosemirror-state"

function insertImageItem(options) {
    return new MenuItem({
        title: "Insert image",
        label: "Image",
        sortOrder: 100,
        enable(state) {
            return canInsert(state, options.schema.nodes.image)
        },
        run(state, _, view) {
            let {from, to} = state.selection, attrs = null
            if (state.selection instanceof NodeSelection && state.selection.node.type === options.schema.nodes.image) {
                attrs = state.selection.node.attrs
            }

            openPrompt({
                title: "Insert image",
                fields: {
                    src: new TextField({label: "Location", required: true, value: attrs && attrs.src}),
                    title: new TextField({label: "Title", value: attrs && attrs.title}),
                    alt: new TextField({label: "Description", value: attrs ? attrs.alt : state.doc.textBetween(from, to, " ")}),
                    width: new TextField({label: "Width", value: attrs && attrs.width}),
                    height: new TextField({label: "Height",  value: attrs && attrs.height})
                },
                callback(attrs) {
                    view.dispatch(view.state.tr.replaceSelectionWith(options.schema.nodes.image.createAndFill(attrs)))
                    view.focus()
                }
            })
        }
    })
}

export function menu(options) {
    return [
        {
            id: 'insertImage',
            node: 'image',
            group: 'insert',
            item: insertImageItem(options)
        }
    ]
}