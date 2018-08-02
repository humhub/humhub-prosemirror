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
    plugins: (context) => {
        if(!context.options.mention || !context.options.mention.provider) {
            return [];
        }
        return [
            mentionPlugin(context)
        ]
    },
    inputRules: (schema) => {return [mentionRule(schema)]},
    keymap: (context) => { return keymap()},
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

            if(href === '#') {
                return '<a href="#" class="not-found">@'+name+'</a>';
            }

            return '<a href="'+href+'" data-contentcontainer-guid="'+guid+'" target="_blank" rel="noopener">@'+name+'</a>';
        };


    }
};

export default mention;
