/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */
import {MenuItem, canInsert} from "../../menu/"
import {TextField, openPrompt} from "../../prompt"
import {NodeSelection} from "prosemirror-state"

export function insertImageItem(nodeType) {
    return new MenuItem({
        title: "Insert image",
        label: "Image",
        enable(state) {
            return canInsert(state, nodeType)
        },
        run(state, _, view) {
            let {from, to} = state.selection, attrs = null
            if (state.selection instanceof NodeSelection && state.selection.node.type == nodeType) {
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
                    view.dispatch(view.state.tr.replaceSelectionWith(nodeType.createAndFill(attrs)))
                    view.focus()
                }
            })
        }
    })
}