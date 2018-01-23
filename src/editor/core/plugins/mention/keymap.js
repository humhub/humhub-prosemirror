import {pluginKey} from './plugin';

let keymap = function () {
    const result = {};
    result['ArrowUp'] = (state, dispatch) => {
        let mentionState = pluginKey.getState(state);

        if(mentionState.active) {
            mentionState.provider.prev();
            return true;
        }

        return false;
    };

    result['ArrowDown'] = (state, dispatch) => {
        let mentionState = pluginKey.getState(state);

        if(mentionState && mentionState.active) {
            mentionState.provider.next();
            return true;
        }

        return false;
    };

    result['Enter'] = (state, dispatch) => {
        let mentionState = pluginKey.getState(state);

        if(mentionState && mentionState.active) {
            mentionState.provider.select();
            return true;
        }

        return false;
    };

    result['Escape'] = (state, dispatch) => {
        let mentionState  = pluginKey.getState(state);

        if(mentionState  && mentionState.active) {
            mentionState.provider.reset();
            return true;
        }

        return false;
    };

    return result;
};

export {keymap}