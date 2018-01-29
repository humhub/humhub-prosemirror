/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */
import {MenuItem, canInsert} from "../../menu/"

function insertHorizontalRule(context) {
    let hr = context.schema.nodes.horizontal_rule;
    return new MenuItem({
        title: context.translate("Insert horizontal rule"),
        label: context.translate("Horizontal rule"),
        sortOrder: 200,
        enable(state) {
            return canInsert(state, hr)
        },
        run(state, dispatch) {
            dispatch(state.tr.replaceSelectionWith(hr.create()))
        }
    })
}

export function menu(context) {
    return [
        {
            id: 'insertHorizontalRule',
            node: 'horizontal_rule',
            group: 'insert',
            item: insertHorizontalRule(context)
        }
    ]
}