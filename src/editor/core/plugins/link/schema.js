/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

const schema = {
    marks: {
        sortOrder: 300,
        link: {
            attrs: {
                href: {},
                title: {default: null},
                target: {default: '_blank'},
                rel: {default: 'noopener'}
            },
            inclusive: false,
            parseDOM:
                [{
                    tag: "a[href]", getAttrs: function getAttrs(dom) {
                        return {
                            href: dom.getAttribute("href"),
                            title: dom.getAttribute("title")
                        }
                    }
                }],
            toDOM: (node) => {
                return ["a", node.attrs]
            },
            parseMarkdown: {
                mark: "link", getAttrs: function (tok) {
                    return ({
                        href: tok.attrGet("href"),
                        title: tok.attrGet("title") || null
                    });
                }
            },
            toMarkdown: {
                open: "[",
                close: function close(state, mark) {
                    return "](" + state.esc(mark.attrs.href) + (mark.attrs.title ? " " + state.quote(mark.attrs.title) : "") + ")"
                }
            }
        }
    }
};

export {schema}