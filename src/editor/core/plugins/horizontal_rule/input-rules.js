/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 */

import {InputRule} from "prosemirror-inputrules";
import {TextSelection} from "prosemirror-state";

// : (Schema) → InputRule
// Turns a paragraph containing only `---` into a horizontal rule.
//
// The default `emDash` rule converts `--` to `—` as soon as the second hyphen is typed,
// so the third hyphen arrives after `—`. Both `---` and `—-` therefore have to be matched.
const horizontalRuleRule = (schema) => {
    return new InputRule(/^(?:---|—-)$/, (state, match, start, end) => {
        const hr = schema.nodes.horizontal_rule;
        const $start = state.doc.resolve(start);

        if (!hr || $start.parent.type !== schema.nodes.paragraph) {
            return null;
        }

        const from = $start.before();
        const to = $start.after();
        const isLastBlock = $start.index($start.depth - 1) === $start.node($start.depth - 1).childCount - 1;
        const nodes = isLastBlock ? [hr.create(), schema.nodes.paragraph.create()] : [hr.create()];
        const tr = state.tr.replaceWith(from, to, nodes);

        return tr.setSelection(TextSelection.near(tr.doc.resolve(from + hr.create().nodeSize), 1));
    });
};

export {horizontalRuleRule};
