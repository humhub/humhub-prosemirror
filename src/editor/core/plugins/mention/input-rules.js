import {InputRule} from "prosemirror-inputrules"

// https://github.com/ProseMirror/prosemirror/issues/262
const objectReplacementCharacter = '\ufffc';

let mentionRule = function(schema) {
    return new InputRule(new RegExp('(^|[\\s\(' + objectReplacementCharacter + '])@$'), function (state, match, start, end) {
        const mark = schema.mark('mentionQuery');
        const mentionText = schema.text('@', [mark]);

        return state.tr
            .removeMark(0, state.doc.nodeSize -2, mark)
            .replaceSelectionWith(mentionText, false);
    })
};

export {mentionRule}