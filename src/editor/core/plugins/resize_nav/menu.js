/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2018 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {icons, MenuItem} from "../../menu/menu"


const SELECTOR_DEFAULT = '.ProseMirror-menu-linkItem, .helper-group, .format-group, .insert-dropdown, .ProseMirror-menu-insertTable, .ProseMirror-menu-fullScreen';

let cache = {};

function resizeNav(context) {

    context.event.on('clear', function() {
        cache = {};
    });

    humhub.event.on('humhub:ready', function() {
        cache = {};
    });

    return new MenuItem({
        id: 'resizeNav',
        title: "More",
        sortOrder: 400,
        run: function() {
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
    if(!cache[context.id]) {
        cache[context.id] = context.editor.$.find(getSelector(context));
    }

    return cache[context.id];
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