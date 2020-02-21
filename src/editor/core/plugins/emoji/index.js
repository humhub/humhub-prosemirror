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
import {menu} from "./menu"

const emoji = {
    id: 'emoji',
    schema: schema,
    menu: (context) => menu(context),
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
    registerMarkdownIt: (markdownIt) => {
        markdownIt.use(emoji_plugin, getMarkdownItOpts());
        markdownIt.renderer.rules.emoji = function(token, idx) {
            let emojiToken = token[idx];

            // Not that clean but unfortunately we don't have access to the editor context here...
            let config = humhub.config.get('ui.richtext.prosemirror', 'emoji');
            let twemojiConfig = config.twemoji || {};
            twemojiConfig.attributes = (icon, variant) => {
                return {
                    'data-name': emojiToken.markup
                }
            };
            return twemoji.parse(emojiToken.content, twemojiConfig);
        };
    }
};

export default emoji;