/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2018 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 */

import emoji_shortcuts from "markdown-it-emoji/lib/data/shortcuts";
import emojiNameMap from "emoji-name-map";
import emojilib from "emojilib";
import twemoji from "twemoji";
import {getEmojiConfig} from "../../humhub-bridge";

let emoji_markdown_it_defs = {};

let emoji_defs_by_char = (() => {
    let result = {};
    $.each(emojilib.lib, (name, def) => {
        result[def['char']] = name;
        emoji_markdown_it_defs[name] = def['char'];
    });

    return result;
})();

// Flatten shortcuts to simple object: { alias: emoji_name }
let shortcuts = Object.keys(emoji_shortcuts).reduce((acc, key) => {
    if (Array.isArray(emoji_shortcuts[key])) {
        emoji_shortcuts[key].forEach((alias) => {
            acc[alias] = key;
        });
        return acc;
    }

    acc[emoji_shortcuts[key]] = key;
    return acc;
}, {});

let getEmojiDefinitionByShortcut = (shortcut) => {
    let result = {
        name: getNameByShortcut(shortcut)
    };

    if (result.name) {
        result.emoji = getCharByName(result.name);
    }

    if (result.emoji) {
        result.$dom = getCharToDom(result.emoji)
    }

    return result;
};

let getNameByShortcut = (shortcut) => {
    return String(shortcuts[shortcut]);
};

let getCharByName = (name) => {
    return emojiNameMap.get(name);
};

let getNameByChar = (emojiChar) => {
    return String(emoji_defs_by_char[emojiChar]);
};

let getCharToDom = (emojiChar, name) => {
    name = (typeof name !== 'undefined') ? name : emoji_defs_by_char[emojiChar];
    name = String(name);

    let config = getEmojiConfig();
    let twemojiConfig = config.twemoji || {};
    twemojiConfig.attributes = (icon, variant) => {
        return {
            'data-name': name,
            'style': 'width:16px'
        };
    };

    let parsed = twemoji.parse(emojiChar, twemojiConfig);

    if (parsed && parsed.length) {
        try {
            return $(parsed);
        } catch (e) {
            console.error(e);
        }
        return '';
    }
};


let byCategory = undefined;

let getByCategory = (category) => {
    if (!byCategory) {
        byCategory = {};
        emojilib.ordered.forEach((name) => {
            let emojiDef = emojilib.lib[name];
            emojiDef.name = String(name);
            byCategory[emojiDef.category] = byCategory[emojiDef.category] || [];
            byCategory[emojiDef.category].push(emojiDef);
        });
    }

    return byCategory[category];
};

let getMarkdownItOpts = () => {
    return {defs: emoji_markdown_it_defs};
};

export {
    shortcuts,
    getNameByChar,
    getCharByName,
    emojilib,
    twemoji,
    getEmojiDefinitionByShortcut,
    getCharToDom,
    getMarkdownItOpts,
    getByCategory
};
