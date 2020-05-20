import {buildLink} from "../../util/linkUtil";
import {escapeHtml} from "markdown-it/lib/common/utils";

const oembed = {
    attrs: {
        href: {},
    },
    marks: "",
    atom: true,
    draggable: true,
    inline: true,
    group: "inline",
    parseDOM: [{
        tag: "[data-oembed]", getAttrs: function getAttrs(dom) {

            return {
                href: dom.getAttribute("data-oembed")
            };
        }
    }],
    toDOM: (node) => {
        let $oembed = humhub.require('oembed').get(node.attrs.href);

        if ($oembed && $oembed.length) {
            return $oembed.show()[0];
        }

        return $(buildLink(node.attrs.href, {'class': 'not-found'}))[0];
    },
    parseMarkdown: {
        node: "oembed", getAttrs: function(tok) {
            return ({
                href: tok.attrGet("href")
            });
        }
    },
    toMarkdown: (state, node) => {
        state.write('['+node.attrs.href+'](oembed:'+node.attrs.href+')');
    }
};

const schema = {
    nodes: {
        oembed: oembed
    }
};

export {schema}