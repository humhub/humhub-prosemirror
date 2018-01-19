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
    doc.firstChild.type.name === 'paragraph' &&
    doc.firstChild.content.size === 0
);

const placeholderPlugin = (options) => {
    return new Plugin({
        props: {
            decorations: state => {
                // TODO: Currently if we leafe the node with an empty e.g heading there is no placeholder
                // We should check when focusout, if the node is empty and change the first child to a paragraph

                if (!isEmpty(state.doc)) {
                    return null;
                }

                const node = document.createElement('div');
                node.textContent = options.text;
                node.className = options['class'] || 'placeholder';

                return DecorationSet.create(state.doc, [
                    Decoration.widget(1, node)
                ])
            }
        }
    })
};

export {placeholderPlugin}