import {InputRule} from "prosemirror-inputrules"
import * as util from "./util"

// https://github.com/ProseMirror/prosemirror/issues/262
const objectReplacementCharacter = '\ufffc';

function quoteRE(str) {
    return str.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
}

// all emoji shortcuts in string seperated by |
let shortcutStr = Object.keys(util.shortcuts)
    .sort()
    .reverse()
    .map(function (name) { return quoteRE(name); })
    .join('|');

let scanRE = new RegExp('(^|[\\s\(' + objectReplacementCharacter + '])'+shortcutStr+'$');

let emojiAutoCompleteRule = function(schema) {

    return new InputRule(scanRE, function (state, match, start, end) {

        // Match e.g. :) => smiley
        let emojiDef = util.getEmojiDefinitionByShortcut(match[0]);
        if(emojiDef.name && emojiDef.emoji && emojiDef.$dom) {
            let node = state.schema.nodes.emoji.create({
                'data-name': emojiDef.name,
                alt: emojiDef.$dom.attr('alt'),
                src: emojiDef.$dom.attr('src')
            });

            return state.tr.delete(start, end).replaceSelectionWith(node, false);
        }

        return false;
    })
};

let emojiChooser = function(schema) {
    return new InputRule(new RegExp('(:$)'), function (state, match, start, end) {

        const mark = schema.mark('emojiQuery');
        const emojiText = schema.text(':', [mark]);

        return state.tr
            .removeMark(0, state.doc.nodeSize -2, mark)
            .replaceSelectionWith(emojiText, false);
    })
};

export {emojiAutoCompleteRule, emojiChooser}