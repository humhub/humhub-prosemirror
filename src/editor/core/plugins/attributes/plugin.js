/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import { Plugin } from 'prosemirror-state';
import { Node, Slice } from 'prosemirror-model'
import twemoji from "../../twemoji"
import {getParser} from "../../../markdown/parser"

const attributesPlugin = (options) => {

    return new Plugin({
        props: {
            attributes: options.attributes
        }
    });
};

export {attributesPlugin}