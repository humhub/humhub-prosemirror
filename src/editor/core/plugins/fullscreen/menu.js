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
               minimize(context);
            } else {
                maximize(context);
            }
        },
        icon: icons.enlarge
    });
}

export function minimize(context, menuItem) {
    let $editor = context.editor.$;
    if($editor.is('.fullscreen')) {
        $('body').removeClass('modal-open');
        $editor.removeClass('fullscreen');
        context.fullScreenMenuItem.switchIcon(icons.enlarge);
    }
}

export function maximize(context, menuItem) {
    let $editor = context.editor.$;
    if(!$editor.is('.fullscreen')) {
        $('body').addClass('modal-open');
        $editor.addClass('fullscreen');
        context.fullScreenMenuItem.switchIcon(icons.shrink);
    }
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