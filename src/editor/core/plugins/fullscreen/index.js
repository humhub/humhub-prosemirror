/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2018 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {menu} from "./menu"

const fullscreen = {
    id: 'fullscreen',
    init(context) {
        if(context.getPluginOption('fullscreen', 'preventAutoFullScreen') !== false) {
            context.editor.$.on('click', '.ProseMirror', function(e) {
                if(humhub.require('ui.view').isSmall() && !context.editor.$.is('.fullscreen')) {
                    context.editor.$.find('.ProseMirror-menu-fullscreen').trigger('mousedown');
                }
            });
        }
    },
    menu: (context) => menu(context)
};

export default fullscreen;
