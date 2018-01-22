/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2018 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import emoji_shortcuts from "markdown-it-emoji/lib/data/shortcuts"
import emoji_defs from "markdown-it-emoji/lib/data/full"
import twemoji from "../../twemoji"

function swap(json){
    var ret = {};
    for(var key in json){
        ret[json[key]] = key;
    }
    return ret;
}

let emoji_defs_by_char = swap(emoji_defs);

// Flatten shortcuts to simple object: { alias: emoji_name }
let shortcuts = Object.keys(emoji_shortcuts).reduce(function (acc, key) {
    if (Array.isArray(emoji_shortcuts[key])) {
        emoji_shortcuts[key].forEach(function (alias) {
            acc[alias] = key;
        });
        return acc;
    }

    acc[emoji_shortcuts[key]] = key;
    return acc;
}, {});

let getEmojiDefinitionByShortcut = function(shortcut) {
    let result = {
        name: getNameByShortcut(shortcut)
    };

    if(result.name) {
        result.emoji = getCharByName(result.name);
    }

    if(result.emoji) {
        result.$dom = getCharToDom(result.emoji)
    }

    return result;
};

let getNameByShortcut = function(shortcut) {
    return shortcuts[shortcut];
};

let getCharByName = function(name) {
    return emoji_defs[name];
};

let getNameByChar = function(emojiChar) {
    return emoji_defs_by_char[emojiChar];
};

let getCharToDom = function(emojiChar, name) {
    name = name || emoji_defs_by_char[emojiChar];

    let parsed = twemoji.parse(emojiChar, {attributes: (icon, variant) => {
        return {
            'data-name': name
        }
    }});

    if(parsed && parsed.length) {
        return $(parsed);
    }
};

export {
    shortcuts,
    getNameByChar,
    getEmojiDefinitionByShortcut,
    getCharToDom
}
