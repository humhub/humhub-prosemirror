/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

export class MentionState {
    constructor(state, options) {
        this.state = state;
        this.provider = options.mention.provider;
    }

    init(config, instance) {
        console.log('init');
    }

    apply(tr, value, oldState, newState) {
        console.log('apply')
    }

    update(state, view) {
        const { mentionQuery } = state.schema.marks;
        const { doc, selection } = state;
        const { $from, from, to } = selection;
        if (!doc.rangeHasMark(from - 1, to, mentionQuery)) {
            return this.provider.dismiss();
        }

        let query = selection.$from.nodeBefore.text.substr(1);
        this.provider.query(query, $('[data-mention-query]')[0]);
    }


}