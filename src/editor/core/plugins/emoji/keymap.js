/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2018 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {pluginKey} from './plugin';

let keymap = function () {
    const result = {};
    result['ArrowLeft'] = (state, dispatch) => {
        let emojiState = pluginKey.getState(state);

        if(emojiState.active) {
            emojiState.provider.prev();
            return true;
        }

        return false;
    };

    result['ArrowDown'] = (state, dispatch) => {
        let emojiState = pluginKey.getState(state);

        if(emojiState.active) {
            emojiState.provider.down();
            return true;
        }

        return false;
    };

    result['ArrowRight'] = (state, dispatch) => {
        let emojiState  = pluginKey.getState(state);

        if(emojiState  && emojiState.active) {
            emojiState.provider.next();
            return true;
        }

        return false;
    };

    result['Tab'] = (state, dispatch) => {
        let emojiState  = pluginKey.getState(state);

        if(emojiState  && emojiState.active) {
            emojiState.provider.getChooser().nextCategory();
            return true;
        }

        return false;
    };

    result['ArrowUp'] = (state, dispatch) => {
        let emojiState  = pluginKey.getState(state);

        if(emojiState  && emojiState.active) {
            emojiState.provider.up();
            return true;
        }

        return false;
    };

    result['Enter'] = (state, dispatch) => {
        let emojiState  = pluginKey.getState(state);

        if(emojiState  && emojiState.active) {
            emojiState.provider.select();
            return true;
        }

        return false;
    };

    result['Escape'] = (state, dispatch) => {
        let emojiState  = pluginKey.getState(state);

        if(emojiState  && emojiState.active) {
            emojiState.provider.reset();
            return true;
        }

        return false;
    };

    return result;
};

export {keymap}