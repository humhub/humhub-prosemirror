import { Plugin } from 'prosemirror-state';
import { editNode } from "./menu";
const md = require('markdown-it')();

let containerDetailsPlugin = (context) => {

    return new Plugin({
        props: {
            handleClickOn(view, pos, node, nodePos, event, direct) {
                if (!direct) return false;

                if (event.ctrlKey || event.metaKey) return false;

                const isSummaryNode = event.target.localName === "summary";
                const isChildOfSummaryNode = event.target.parentNode.localName === "summary"
                    || event.target.parentNode.parentNode.localName === "summary";

                // prevent editing when clicking outside summary tag
                if (!isSummaryNode && !isChildOfSummaryNode) return false;

                editNode(node, nodePos, context);
            }
        }
    });
};

export {containerDetailsPlugin}