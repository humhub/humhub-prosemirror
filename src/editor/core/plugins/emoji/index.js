/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {schema} from './schema'
import emoji_plugin from "markdown-it-emoji"
import twemoji from "twemoji"

const emoji = {
    id: 'emoji',
    schema: schema,
    registerMarkdownIt: (markdownIt) => {
        markdownIt.use(emoji_plugin);
        markdownIt.renderer.rules.emoji = function(token, idx) {
            return twemoji.parse(token[idx].content);
        };
    }
};

export default emoji;
