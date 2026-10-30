/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 */

import {replaceParagraphWithRule} from "./command";

// Enter in a paragraph that contains only `---`, `___` or `***` turns it into a horizontal rule.
const enterHandler = (state, dispatch) => {
    const {$from, empty} = state.selection;

    if (!empty || $from.parent.type !== state.schema.nodes.paragraph
        || $from.parentOffset !== $from.parent.content.size
        || !/^(?:---|___|\*\*\*)$/.test($from.parent.textContent)) {
        return false;
    }

    const tr = replaceParagraphWithRule(state, $from);

    if (!tr) {
        return false;
    }

    if (dispatch) {
        dispatch(tr.scrollIntoView());
    }

    return true;
};

const keymap = () => {
    return {
        Enter: enterHandler
    };
};

export {keymap};
