/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2018 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {icons, MenuItem} from "../../menu/menu"


function fullScreen(context) {
    return new MenuItem({
        id: 'fullscreen',
        title: "Fullscreen",
        sortOrder: 300,
        run: function() {
            let $editor = context.editor.$;
            if($editor.is('.fullscreen')) {
                $('body').removeClass('modal-open');
                $editor.removeClass('fullscreen');
                this.switchIcon(icons.enlarge);
            } else {
                $('body').addClass('modal-open');
                $editor.addClass('fullscreen');
                this.switchIcon(icons.shrink);
            }
        },
        icon: icons.enlarge
    });
}

export function menu(context) {
    return [
        {
            id: 'fullScreen',
            group: 'resize',
            item: fullScreen(context)
        },
    ]
}