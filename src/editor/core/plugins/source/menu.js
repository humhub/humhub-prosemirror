/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {icons, MenuItem} from "../../menu"
import {
    isSourceMode,
    switchToSourceMode,
    switchToRichtextMode,
    sourcePluginKey,
    EDIT_MODE_SOURCE,
} from "./plugin"

const switchMode = function (context) {
    return new MenuItem({
        id: 'source',
        title: "Swtich editor mode",
        icon: icons.markdown,
        run: (state, dispatch) => {
            if(isSourceMode(state)) {
                switchToRichtextMode(context);
                // We do not need to dispatch a transaction, since the editor will be reinitialized anyways
            } else {
                switchToSourceMode(context);
                dispatch(state.tr.setMeta(sourcePluginKey, EDIT_MODE_SOURCE));
            }
        },
        select: state => true,
        active(state) {
            return isSourceMode(state);
        }
    });
};

export function menu(context) {
    return [{type: 'group', id: 'source-group', sortOrder: 50, items: [switchMode(context)]}];
}