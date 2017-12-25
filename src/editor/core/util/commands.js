import {toggleMark} from "prosemirror-commands"

export function markActive(state, type) {
    let {from, $from, to, empty} = state.selection
    if (empty) return type.isInSet(state.storedMarks || $from.marks())
    else return state.doc.rangeHasMark(from, to, type)
}

export function markItem(markType, options) {
    let passedOptions = {
        active(state) {
            return markActive(state, markType)
        },
        enable: true
    }
    for (let prop in options) passedOptions[prop] = options[prop]
    return cmdItem(toggleMark(markType), passedOptions)
}

export function linkItem(markType) {
    return new MenuItem({
        title: "Add or remove link",
        icon: icons.link,
        active(state) {
            return markActive(state, markType)
        },
        enable(state) {
            return !state.selection.empty
        },
        run(state, dispatch, view) {
            if (markActive(state, markType)) {
                toggleMark(markType)(state, dispatch)
                return true
            }
            openPrompt({
                title: "Create a link",
                fields: {
                    href: new TextField({
                        label: "Link target",
                        required: true,
                        clean: (val) => {
                            if (!/^https?:\/\//i.test(val))
                                val = 'http://' + val
                            return val
                        }
                    }),
                    title: new TextField({label: "Title"})
                },
                callback(attrs) {
                    toggleMark(markType, attrs)(view.state, view.dispatch)
                    view.focus()
                }
            })
        }
    })
}

export function wrapListItem(nodeType, options) {
    return cmdItem(wrapInList(nodeType, options.attrs), options)
}