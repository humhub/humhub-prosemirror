/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */
import {schema} from './schema'
import imsize_plugin from './markdownit_imsize'
import {menu} from './menu'
import {imagePlugin} from "./plugin";

const image = {
    id: 'image',
    schema: schema,
    menu: (context) => menu(context),
    plugins: (context) => {
        return [
            imagePlugin(context)
        ]
    },
    registerMarkdownIt: (markdownIt) => {
        markdownIt.use(imsize_plugin);

        let defaultRender = markdownIt.renderer.rules.image || function(tokens, idx, options, env, self) {
            return self.renderToken(tokens, idx, options);
        };

        markdownIt.renderer.rules.image = function (tokens, idx, options, env, self) {
            let srcIndex = tokens[idx].attrIndex('src');


            let srcFilter = (window.humhub) ? humhub.modules.file.filterFileUrl(tokens[idx].attrs[srcIndex][1]) : {url : tokens[idx].attrs[srcIndex][1]};
            tokens[idx].attrs[srcIndex][1] = srcFilter.url;

            if(srcFilter.guid) {
                tokens[idx].attrPush(['data-file-guid', srcFilter.guid]); // add new attribute
            }

            if(env && env.context && env.context.uuid) {
                tokens[idx].attrPush(['data-ui-gallery', env.context.uuid]);
            }

            // pass token to default renderer.
            return defaultRender(tokens, idx, options, env, self);
        };
    }
};

export default image;
