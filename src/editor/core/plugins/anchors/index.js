/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2018 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

// We don't use the official repo https://github.com/valeriangalliat/markdown-it-anchor/issues/39
import markdown_it_anchor_plugin from "markdown-it-anchor"

const anchors = {
    id: 'anchor',
    registerMarkdownIt: (markdownIt, context) => {
        let anchorOptions = context.getPluginOption('anchors');
        anchorOptions = (anchorOptions === true) ? {} : anchorOptions;
        if(anchorOptions) {
            markdownIt.use(markdown_it_anchor_plugin, anchorOptions);
        }
    }
};

export default anchors;
