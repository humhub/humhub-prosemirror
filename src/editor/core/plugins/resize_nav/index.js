/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2018 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {menu, getNodes} from "./menu"

const resizeNav = {
    id: 'resizeNav',
    init(context) {
        context.event.on('afterMenuBarInit', (evt, instance) => {
            getNodes(context).hide();
        }).on('afterMenuBarUpdate', (evt, instance) => {
            if(!$(instance.menu).find('.ProseMirror-menu-resizeNav').data('state')) {
                getNodes(context).hide();
            }
        });
    },
    menu: (context) => menu(context)
};

export default resizeNav;
