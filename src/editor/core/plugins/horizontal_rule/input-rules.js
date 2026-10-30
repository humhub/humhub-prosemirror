/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 */

import {InputRule} from "prosemirror-inputrules";
import {replaceParagraphWithRule} from "./command";

// : () → InputRule
// Turns a paragraph containing only a Markdown horizontal rule marker into a horizontal rule:
// `---` right after the third hyphen, `___` and `***` after a confirming space.
// The space avoids a collision with bold italic text like `***text***`; without the space
// the marker is converted by pressing Enter (see keymap.js).
//
// The default `emDash` rule converts `--` to `—` as soon as the second hyphen is typed,
// so the third hyphen arrives after `—`. Both `---` and `—-` therefore have to be matched.
const horizontalRuleRule = () => {
    return new InputRule(/^(?:---|—-|___\s|\*\*\*\s)$/, (state, match, start) => {
        return replaceParagraphWithRule(state, state.doc.resolve(start));
    });
};

export {horizontalRuleRule};
