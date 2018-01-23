/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */
import {schema} from './schema'
import {oembed_plugin} from './markdownit_oembed'

const oembed = {
    id: 'oembed',
    schema: schema,
    init: (context) => {
        context.event.on('linkified', (evt, urls) => {
            //TODO:
            console.log(urls);
        });
    },
    registerMarkdownIt: (markdownIt) => {
        markdownIt.inline.ruler.before('link','oembed', oembed_plugin);

        markdownIt.renderer.rules.oembed = function(token, idx) {
            let oembed = token[idx];
            let href = markdownIt.utils.escapeHtml(oembed.attrGet('href'));
            let $oembed = $('[data-oembed="'+href+'"]');

            if(!$oembed.length) {
                return '<a href="'+href+'" target="_blank" rel="noopener">'+href+'</a>';
            }

            $oembed = $oembed.clone();
            return $oembed.html();
        };
    }
};

export default oembed;
