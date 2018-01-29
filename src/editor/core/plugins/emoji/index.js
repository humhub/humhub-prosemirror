/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {schema} from './schema'
import {getMarkdownItOpts} from './util'
import emoji_plugin from "markdown-it-emoji"
import twemoji from "twemoji"
import {emojiPlugin} from "./plugin"
import {emojiAutoCompleteRule, emojiChooser} from "./input-rules"
import {keymap} from "./keymap"

const emoji = {
    id: 'emoji',
    schema: schema,
    init: (context) => {
        if(context.options.emoji && context.options.emoji.twemoji) {
            $.extend(twemoji, context.options.emoji.twemoji);
        }
    },
    inputRules: (schema) => {
        return [
            emojiAutoCompleteRule(schema),
            emojiChooser(schema)
        ]
    },
    keymap: (context) => { return keymap()},
    plugins: (context) => {
        return [
            emojiPlugin(context)
        ]
    },
    registerMarkdownIt: (markdownIt, context) => {
        markdownIt.use(emoji_plugin, getMarkdownItOpts());
        markdownIt.renderer.rules.emoji = function(token, idx) {
            let emojiToken = token[idx];
            return twemoji.parse(emojiToken.content, {
                attributes: (icon, variant) => {
                    return {
                        'data-name': emojiToken.markup
                    }
                }
            });
        };
    }
};

export default emoji;