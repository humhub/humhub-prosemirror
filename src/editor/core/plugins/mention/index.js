/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */
import {schema} from './schema'
import {mentionRule} from './input-rules'
import {mentionPlugin} from './plugin'
import {keymap} from './keymap'
import {createLinkExtension} from "../../../markdown/linkExtensionTokenizer"

const mention = {
    id: 'mention',
    schema: schema,
    plugins: (options = {}) => {
        if(!options.mention || !options.mention.provider) {
            return [];
        }
        return [
            mentionPlugin(options)
        ]
    },
    inputRules: (schema) => {return [mentionRule(schema)]},
    keymap: (options) => { return keymap(options)},
    registerMarkdownIt: (markdownIt) => {
        // [name](mention:guid "href")
        markdownIt.inline.ruler.before('link','mention', createLinkExtension('mention', {
            labelAttr: 'name',
            hrefAttr : 'guid',
            titleAttr: 'href'
        }));

        markdownIt.renderer.rules.mention = function(token, idx) {
            let oembed = token[idx];
            let href = markdownIt.utils.escapeHtml(oembed.attrGet('href'));
            let guid = markdownIt.utils.escapeHtml(oembed.attrGet('guid'));
            let name = markdownIt.utils.escapeHtml(oembed.attrGet('name'));

            return '<a href="'+href+'" data-guid="'+guid+'" target="_blank" rel="noopener">@'+name+'</a>';
        };


    }
};

export default mention;
