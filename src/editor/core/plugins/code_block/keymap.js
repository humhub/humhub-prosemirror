import {Selection} from 'prosemirror-state';

function arrowHandler(dir) {
    return (state, dispatch, view) => {
        if (state.selection.empty && view.endOfTextblock(dir)) {
            let side = dir === "left" || dir === "up" ? -1 : 1,
                $head = state.selection.$head;
            let nextPos = Selection.near(
                state.doc.resolve(side > 0 ? $head.after() : $head.before()),
                side
            );
            if (nextPos.$head && nextPos.$head.parent.type.name === "code_block") {
                dispatch(state.tr.setSelection(nextPos));
                return true;
            }
        }
        return false;
    };
}

let keymap = () => {
    return {
        ArrowLeft: arrowHandler("left"),
        ArrowRight: arrowHandler("right"),
        ArrowUp: arrowHandler("up"),
        ArrowDown: arrowHandler("down")
    };
};

export {keymap};
