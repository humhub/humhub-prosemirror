/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {MenuItem, icons, markActive} from "../../menu/menu"
import {openPrompt, TextField} from "../../prompt"
import {toggleMark} from "prosemirror-commands"

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
            return !state.selection.empty
        },
        run(state, dispatch, view) {
            if (markActive(state, mark)) {
                toggleMark(mark)(state, dispatch);
                return true
            }
            openPrompt({
                title: context.translate("Create a link"),
                fields: {
                    href: new TextField({
                        label: context.translate("Link target"),
                        required: true,
                        clean: (val) => {
                            if (!/^https?:\/\//i.test(val))
                                val = 'http://' + val;
                            return val
                        }
                    }),
                    title: new TextField({label: "Title"})
                },
                callback(attrs) {
                    toggleMark(mark, attrs)(view.state, view.dispatch);
                    view.focus()
                }
            })
        }
    })
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

