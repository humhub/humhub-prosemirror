import { Plugin, PluginKey } from 'prosemirror-state';
import { MentionState } from './state';

const pluginKey = new PluginKey('mention');

const mentionPlugin = (options) => {
    return new Plugin({
        state: {
            init(config, state) {
                return new MentionState(state, options);
            },
            apply(tr, prevPluginState, oldState, newState) {
                prevPluginState.apply(tr, newState);
                return prevPluginState;
            }
        },
        key: pluginKey,
        view: (view) => {
            const pluginState = pluginKey.getState(view.state);

            return {
                update(view, prevState) {
                    pluginState.update(view.state, view);
                },
                destroy() {
                }
            };
        }
    });
}

export {mentionPlugin, pluginKey}