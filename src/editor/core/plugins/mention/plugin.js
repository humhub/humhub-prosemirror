import { Plugin, PluginKey } from 'prosemirror-state';
import { MentionState } from './state';

const pluginKey = new PluginKey('mention');

const plugin = new Plugin({
    state: {
        init(config, state) {
            return new MentionState(state);
        },
        apply(tr, prevPluginState, oldState, newState) {
            prevPluginState.apply(tr, newState);
            return prevPluginState;
        }
    },
    key: pluginKey,
    view: (view) => {
        const pluginState = pluginKey.getState(view.state);
        debugger;

        return {
            update(view, prevState) {
                debugger;
                pluginState.update(view.state);
            },
            destroy() {}
        };
    }
});

export {plugin, pluginKey}