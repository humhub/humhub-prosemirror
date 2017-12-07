/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import { Plugin } from 'prosemirror-state';
import { DecorationSet, Decoration } from 'prosemirror-view'

const isEmpty = doc => (
    doc.childCount === 1 &&
    doc.firstChild.isTextblock &&
    doc.firstChild.content.size === 0
);

const placeholderPlugin = (options) => {
    return new Plugin({
        props: {
            decorations: state => {
                debugger;
                if (!isEmpty(state.doc)) {
                    return null;
                }

                const node = document.createElement('div');
                node.textContent = options.placeholder.text;
                node.className = options.placeholder.className || 'placeholder';

                return DecorationSet.create(state.doc, [
                    Decoration.widget(1, node)
                ])
            }
        }
    })
};

export {placeholderPlugin}