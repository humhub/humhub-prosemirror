/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */
import {schema} from './schema'
import {linkPlugin} from './plugin'
import {menu} from './menu'

const link = {
    id: 'link',
    schema: schema,
    menu: (context) => menu(context),
    registerMarkdownIt: (md) => {

        var defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
            return self.renderToken(tokens, idx, options);
        };

        md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
            var hrefIndex = tokens[idx].attrIndex('href');

            let hrefFilter = (window.humhub) ? humhub.modules.file.filterFileUrl(tokens[idx].attrs[hrefIndex][1]) : {url: tokens[idx].attrs[hrefIndex][1] };
            tokens[idx].attrs[hrefIndex][1] = hrefFilter.url;

            if(hrefFilter.guid) {
                tokens[idx].attrPush(['data-file-guid', hrefFilter.guid]); // add new attribute
                tokens[idx].attrPush(['data-file-download', '']); // add new attribute
                tokens[idx].attrPush(['data-file-url', hrefFilter.url]); // add new attribute
            }

            if (!/^https?:\/\//i.test(hrefFilter.url) && !/^mailto:/i.test(hrefFilter.url) && !/^ftps?:\/\//i.test(hrefFilter.url))  {
                tokens[idx].attrs[hrefIndex][1] = '#';
            }

            // If you are sure other plugins can't add `target` - drop check below
            var aIndex = tokens[idx].attrIndex('target');

            if (aIndex < 0) {
                tokens[idx].attrPush(['target', '_blank']); // add new attribute
            } else if(!tokens[idx].attrs[aIndex][1]) {
                tokens[idx].attrs[aIndex][1] = '_blank';    // replace value of existing attr
            }

            tokens[idx].attrPush(['rel', 'noopener']);

            // pass token to default renderer.
            return defaultRender(tokens, idx, options, env, self);
        };
    },
    plugins: (context) => {
        return [linkPlugin(context)];
    }
};

export default link;
