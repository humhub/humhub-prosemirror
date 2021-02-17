/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */
import {schema} from './schema'
import {getClassForFloat} from './imageFloat'
import imsize_plugin from './markdownit_imsize'
import {menu} from './menu'
import {imagePlugin} from "./plugin";
import {validateHref} from "../../util/linkUtil";

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

            let imageToken = tokens[idx];
            let srcIndex = imageToken.attrIndex('src');


            let srcFilter = (window.humhub) ? humhub.modules.file.filterFileUrl(imageToken.attrs[srcIndex][1]) : {url : imageToken.attrs[srcIndex][1]};
            imageToken.attrs[srcIndex][1] = validateHref(srcFilter.url) ? srcFilter.url : '#';

            if(srcFilter.guid) {
                imageToken.attrPush(['data-file-guid', srcFilter.guid]); // add new attribute
            }

            if(env && env.context && env.context.uuid) {
                imageToken.attrPush(['data-ui-gallery', env.context.uuid]);
            }

            let float = imageToken.attrs[ imageToken.attrIndex('float')][1];

            if(float) {
                imageToken.attrPush(['class', getClassForFloat(float)]);
                imageToken.attrs.splice(imageToken.attrIndex('float'), 1);
            }

            // pass token to default renderer.
            return defaultRender(tokens, idx, options, env, self);
        };
    }
};

export default image;
