/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2018 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 */

import anchor_plugin from "markdown-it-anchor";

const position = {
    false: 'push',
    true: 'unshift'
};

const anchors = {
    id: 'anchor',
    renderOnly: true,
    init: (context, isEdit) => {
        if (!isEdit) {
            context.editor.$.on('mouseenter', ':header', function () {
                $(this).find('.header-anchor').show();
            }).on('mouseleave', ':header', function () {
                $(this).find('.header-anchor').hide();
            });
        }
    },
    registerMarkdownIt: (markdownIt) => {
        const anchorOptions = {
            permalink: anchor_plugin.permalink.linkInsideHeader({
                symbol: '¶',
                placement: 'after',
                ariaHidden: true,
                renderAttrs: (slug, state) => {
                    return {'style': 'display:none'};
                }
            })
        };

        markdownIt.use(anchor_plugin, anchorOptions);
    }
};

export default anchors;
