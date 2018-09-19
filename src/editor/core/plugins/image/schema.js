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
                height: {default: null},
                fileGuid: { default: null},
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
                        height: dom.getAttribute("height"),
                        fileGuid: dom.getAttribute("data-file-guid")
                    }
                }
            }],
            toDOM: (node) => {
                let src = (window.humhub && node.attrs.fileGuid) ? humhub.modules.file.getFileUrl(node.attrs.fileGuid)  : node.attrs.src;

                return ["img", {
                    src: src,
                    title: node.attrs.title || null,
                    width: node.attrs.width || null,
                    height: node.attrs.height || null,
                    alt: node.attrs.alt || null,
                    'data-file-guid': node.attrs.fileGuid || null
                }]
            },
            parseMarkdown: {
                node: "image", getAttrs: function (tok) {
                    let src =  (window.humhub) ? humhub.modules.file.filterFileUrl(tok.attrGet("src")).url : tok.attrGet("src");
                    let fileGuid = (window.humhub) ?  humhub.modules.file.filterFileUrl(tok.attrGet("src")).guid : null;

                    return ({
                        src: src,
                        title: tok.attrGet("title") || null,
                        width: tok.attrGet("width") || null,
                        height: tok.attrGet("height") || null,
                        alt: tok.children[0] && tok.children[0].content || null,
                        fileGuid: fileGuid
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

                let src = (node.attrs.fileGuid) ? 'file-guid:'+node.attrs.fileGuid  : node.attrs.src;

                state.write("![" + state.esc(node.attrs.alt || "") + "](" + state.esc(src) +
                    (node.attrs.title ? " " + state.quote(node.attrs.title) : "") + resizeAddition + ")");
            }
        }
    }
};

export {schema}