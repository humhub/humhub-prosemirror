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
    let $editor = context.editor.$;
    let $wrapper = $editor.find('.ProseMirror-menubar-wrapper');
    let $menubar = $editor.find('.ProseMirror-menubar');
    let $stage = $editor.find('.ProseMirror');
    let $textarea = $editor.find('textarea');

    if ($editor.is('.fullscreen')) {
        $wrapper.css({ height: 'auto' });
    }

    if (!$textarea.length) {
        $textarea = $('<textarea class="ProseMirror-editor-source"></textarea>');
        $editor.append($textarea);
        context.$source = $textarea;
    }

    $textarea.css({
        height: $editor.is('.fullscreen') ? 'calc(100% - ' + $menubar.outerHeight() + 'px)' : $stage.outerHeight(),
        width: '100%',
    });

    $textarea.val(context.editor.serialize()).show();
    $stage.hide();
    context.editor.focus(true);

    return EDIT_MODE_SOURCE;
}

export function switchToRichtextMode(context) {
    let $editor = context.editor.$;
    let $wrapper = $editor.find('.ProseMirror-menubar-wrapper');
    let $stage = $editor.find('.ProseMirror');
    let $textarea = $editor.find('textarea');

    if ($editor.is('.fullscreen')) {
        $wrapper.css({ height: '100%' });
    }

    context.editor.init($textarea.val());
    $stage.show();
    $textarea.remove();
    context.menu.update();
    context.editor.focus(true);

    return EDIT_MODE_RICHTEXT;
}