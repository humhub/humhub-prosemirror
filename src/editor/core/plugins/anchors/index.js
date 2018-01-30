/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2018 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import markdown_it_anchor_plugin from "markdown-it-anchor"

const anchors = {
    id: 'anchor',
    registerMarkdownIt: (markdownIt, context) => {
        debugger;
        let anchorOptions = context.getPluginOption('anchors');
        anchorOptions = (anchorOptions === true) ? {} : anchorOptions;
        if(anchorOptions) {
            markdownIt.use(markdown_it_anchor_plugin, anchorOptions);
        }
    }
};

export default anchors;
