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
                fileGuid: { default: null},
                rel: {default: 'noopener'}
            },
            inclusive: false,
            parseDOM:
                [{
                    tag: "a[href]", getAttrs: function getAttrs(dom) {
                        let href = dom.getAttribute("href");
                        if (!/^https?:\/\//i.test(href) && !/^mailto:/i.test(href) && !/^ftps?:\/\//i.test(href))  {
                            href = '#';
                        }

                        return {
                            href: href,
                            title: dom.getAttribute("title"),
                            target: dom.getAttribute("target"),
                            fileGuid: dom.getAttribute("data-file-guid")
                        }
                    }
                }],
            toDOM: (node) => {
                let href = (window.humhub && node.attrs.fileGuid) ? humhub.modules.file.getFileUrl(node.attrs.fileGuid)  : node.attrs.href;

                if (!/^https?:\/\//i.test(href) && !/^mailto:/i.test(href) && !/^ftps?:\/\//i.test(href))  {
                    href = '#';
                }

                return ["a", {
                    href: href,
                    title: node.attrs.title || null,
                    target: node.attrs.target || '_blank',
                    rel: 'noopener',
                    'data-file-guid': node.attrs.fileGuid || null
                }]
            },
            parseMarkdown: {
                mark: "link", getAttrs: function (tok) {
                    let href = (window.humhub) ? humhub.modules.file.filterFileUrl(tok.attrGet("href")).url : tok.attrGet("href");
                    let fileGuid = (window.humhub) ? humhub.modules.file.filterFileUrl(tok.attrGet("href")).guid : null;

                    if (!/^https?:\/\//i.test(href) && !/^mailto:/i.test(href) && !/^ftps?:\/\//i.test(href))  {
                        href = '#';
                    }

                    return ({
                        href: href,
                        title: tok.attrGet("title") || null,
                        fileGuid: fileGuid
                    });
                }
            },
            toMarkdown: {
                open: "[",
                close: function close(state, mark) {
                    let href = (mark.attrs.fileGuid) ? 'file-guid:'+mark.attrs.fileGuid  : mark.attrs.href;
                    return "](" + state.esc(href) + (mark.attrs.title ? " " + state.quote(mark.attrs.title) : "") + ")"
                }
            }
        }
    }
};

export {schema}