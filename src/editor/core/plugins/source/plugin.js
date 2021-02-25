import {Plugin, PluginKey} from "prosemirror-state";

export const sourcePluginKey = new PluginKey('source');

export const EDIT_MODE_SOURCE = 'source';
export const EDIT_MODE_RICHTEXT = 'richtext';

export function isSourceMode(state) {
    return sourcePluginKey.getState(state) === EDIT_MODE_SOURCE;
}

export function sourcePlugin(context) {
    return new Plugin({
        key: sourcePluginKey,
        state: {
            init(config, state) {
                return EDIT_MODE_RICHTEXT;
            },
            apply(tr, prevPluginState, oldState, newState) {
                return tr.getMeta(sourcePluginKey) || prevPluginState;
            }
        },
    })
}

export function switchToSourceMode(context) {
    let $stage = context.editor.$.find('.ProseMirror');
    let $textarea = context.editor.$.find('textarea');

    if (!$textarea.length) {
        $textarea = $('<textarea class="ProseMirror-editor-source"></textarea>');
        context.editor.$.append($textarea);
        context.$source = $textarea;
    }

    $textarea.css({
        height: $stage.outerHeight(),
        width: '100%',
    });

    $textarea.val(context.editor.serialize()).show();
    $stage.hide();

    context.editor.focus(true);

    return EDIT_MODE_SOURCE;
}

export function switchToRichtextMode(context) {
    let $stage = context.editor.$.find('.ProseMirror');
    let $textarea = context.editor.$.find('textarea');
    context.editor.init($textarea.val());
    $stage.show();
    $textarea.remove();
    context.menu.update();
    context.editor.focus(true);
    return EDIT_MODE_RICHTEXT;
}