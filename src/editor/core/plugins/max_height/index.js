/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2018 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

// We don't use the official repo https://github.com/valeriangalliat/markdown-it-anchor/issues/39
import markdown_it_anchor_plugin from "markdown-it-anchor"

const maxHeight = {
    id: 'max-height',
    init: (context) => {
        context.editor.on('afterInit', () => {
            if(context.options.maxHeight) {
                context.editor.$.find('.humhub-ui-richtext').css({'max-height': context.options.maxHeight,'overflow': 'auto'});
            }
        });
    }
};

export default maxHeight;
