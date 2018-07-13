/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2018 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import { Plugin } from 'prosemirror-state';
import { editNode } from './menu';

const imagePlugin = (context) => {
    return new Plugin({
        props: {
            handleClickOn: (view, pos, node, nodePos, event, direct) => {
                if(direct && node.type === context.schema.nodes.image) {
                    debugger;
                    editNode(node, context, view);
                }
            }
        }
    });
};

export {imagePlugin}