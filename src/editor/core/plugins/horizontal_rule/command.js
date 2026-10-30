/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 */

import {TextSelection} from "prosemirror-state";

// : (EditorState, ResolvedPos) → ?Transaction
// Replaces the paragraph around `$pos` with a horizontal rule.
// If the paragraph was the last block an empty paragraph is added after the rule,
// the cursor is placed in the block following the rule.
const replaceParagraphWithRule = (state, $pos) => {
    const {horizontal_rule: hr, paragraph} = state.schema.nodes;

    if (!hr || $pos.parent.type !== paragraph) {
        return null;
    }

    const rule = hr.create();
    const from = $pos.before();
    const to = $pos.after();
    const isLastBlock = $pos.index($pos.depth - 1) === $pos.node($pos.depth - 1).childCount - 1;
    const tr = state.tr.replaceWith(from, to, isLastBlock ? [rule, paragraph.create()] : [rule]);

    return tr.setSelection(TextSelection.near(tr.doc.resolve(from + rule.nodeSize), 1));
};

export {replaceParagraphWithRule};
