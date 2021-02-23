/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {icons, MenuItem} from "../../menu"
import {isSourceMode, sourcePluginKey, EDIT_MODE_SOURCE} from "./plugin"

const switchMode = function (context) {
    return new MenuItem({
        id: 'source',
        title: "Swtich editor mode",
        icon: icons.markdown,
        run: (state, dispatch) => {
            return context.editor.$.find('.ProseMirror').is(':hidden')
                ? switchToRichTextMode(state, dispatch, context)
                : switchToSourceMode(state, dispatch, context);
        },
        select: state => true,
        active(state) {
            return isSourceMode(state);
        }
    });
};

const switchToSourceMode = function (state, dispatch, context) {
    let $stage = context.editor.$.find('.ProseMirror');
    let $textarea = context.editor.$.find('textarea');

    if (!$textarea.length) {
        $textarea = $('<textarea></textarea>');
        context.editor.$.append($textarea);
        context.$source = $textarea;
    }

    $textarea.css({
        height: $stage.height(),
        width: $stage.width(),
    });

    $textarea.val(context.editor.serialize()).show();
    $stage.hide();

    let tr = state.tr;
    tr.setMeta(sourcePluginKey, EDIT_MODE_SOURCE);
    dispatch(tr);
}

const switchToRichTextMode = function (state, dispatch, context) {
    let $stage = context.editor.$.find('.ProseMirror');
    let $textarea = context.editor.$.find('textarea');
    context.editor.init($textarea.val());
    $stage.show();
    $textarea.remove();
    //context.mode = EDIT_MODE_RICHTEXT;
    context.menu.update();
}

export function menu(context) {
   return [{type: 'group', id: 'source-group', sortOrder: 50, items: [switchMode(context)]}];
}