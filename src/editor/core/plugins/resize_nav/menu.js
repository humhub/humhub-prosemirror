/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2018 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {icons, MenuItem} from "../../menu/menu"

const SELECTOR_DEFAULT = '.helper-group, .format-group, .insert-dropdown, .ProseMirror-menu-insertTable:not(.hidden), .ProseMirror-menu-fullScreen:not(.hidden)';

function resizeNav(context) {

    return new MenuItem({
        id: 'resizeNav',
        title: "More",
        sortOrder: 400,
        run() {
            let $nodes = getNodes(context);
            if(!context.editor.$.find('.helper-group').is(':visible')) {
                $nodes.fadeIn();
                this.switchIcon(icons.angleDoubleLeft);
                $(this.dom).data('state', true);
            } else {
                $nodes.hide();
                this.switchIcon(icons.angleDoubleRight);
                $(this.dom).data('state', false);
            }
        },
        icon: icons.angleDoubleRight
    });
}

export function getNodes(context) {
    return context.editor.$.find(getSelector(context));
}

export function getSelector(context) {
    return context.getPluginOption('resizeNav', 'selector', SELECTOR_DEFAULT);
}

export function menu(context) {
    return [
        {
            id: 'resizeNav',
            group: 'resize',
            item: resizeNav(context)
        },
    ]
}