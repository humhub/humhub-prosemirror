/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

const schema = {
    nodes: {
        image: {
            sortOrder: 1000,
            inline: true,
            attrs: {
                src: {},
                alt: {default: null},
                title: {default: null},
                width: {default: null},
                height: {default: null}
            },
            group: "inline",
            draggable: true,
            parseDOM: [{
                tag: "img[src]", getAttrs: function getAttrs(dom) {
                    return {
                        src: dom.getAttribute("src"),
                        title: dom.getAttribute("title"),
                        alt: dom.getAttribute("alt"),
                        width: dom.getAttribute("width"),
                        height: dom.getAttribute("height")
                    }
                }
            }],
            toDOM: (node) => {
                return ["img", node.attrs]
            },
            parseMarkdown: {
                node: "image", getAttrs: function (tok) {
                    return ({
                        src: tok.attrGet("src"),
                        title: tok.attrGet("title") || null,
                        width: tok.attrGet("width") || null,
                        height: tok.attrGet("height") || null,
                        alt: tok.children[0] && tok.children[0].content || null
                    });
                }
            },
            toMarkdown: (state, node) => {
                let resizeAddition = "";

                if(node.attrs.width || node.attrs.height) {
                    resizeAddition += " =";
                    resizeAddition += (node.attrs.width) ? node.attrs.width : '';
                    resizeAddition += 'x';
                    resizeAddition += (node.attrs.height) ? node.attrs.height : '';
                }

                state.write("![" + state.esc(node.attrs.alt || "") + "](" + state.esc(node.attrs.src) +
                    (node.attrs.title ? " " + state.quote(node.attrs.title) : "") + resizeAddition + ")");
            }
        }
    }
};

export {schema}