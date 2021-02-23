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