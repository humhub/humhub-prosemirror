import {InputRule} from "prosemirror-inputrules"
import emoji_shortcuts from "markdown-it-emoji/lib/data/shortcuts"
import emoji_defs from "markdown-it-emoji/lib/data/full"
import twemoji from "../../twemoji"

// https://github.com/ProseMirror/prosemirror/issues/262
const objectReplacementCharacter = '\ufffc';

function quoteRE(str) {
    return str.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
}

// Flatten shortcuts to simple object: { alias: emoji_name }
let shortcutsFlat = Object.keys(emoji_shortcuts).reduce(function (acc, key) {
    if (Array.isArray(emoji_shortcuts[key])) {
        emoji_shortcuts[key].forEach(function (alias) {
            acc[alias] = key;
        });
        return acc;
    }

    acc[emoji_shortcuts[key]] = key;
    return acc;
}, {});

var names = Object.keys(shortcutsFlat)
    .sort()
    .reverse()
    .map(function (name) { return quoteRE(name); })
    .join('|');

var scanRE = RegExp('(^|[\\s\(' + objectReplacementCharacter + '])'+names+'$');

let emojiAutoCompleteRule = function(schema) {

    return new InputRule(scanRE, function (state, match, start, end) {

        // Match e.g. :) => smiley
        let emoji = shortcutsFlat[match[0]];
        let unicode = emoji_defs[emoji];

        if(unicode) {
            //let dom = $(twemoji.parse(':'+emoji+':'));
            let dom = twemoji.parse(unicode);
            let $dom = $(dom);

            let node = state.schema.nodes.emoji.create({
                'data-name': emoji,
                alt: $dom.attr('alt'),
                src: $dom.attr('src')
            });

            return state.tr.delete(start, end).replaceSelectionWith(node, false);
        }

        return false;
    })
};

export {emojiAutoCompleteRule}