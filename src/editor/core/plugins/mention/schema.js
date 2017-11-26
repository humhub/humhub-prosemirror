
const schema = {
    nodes: {
        mention: {
            inline: true,
            group: 'inline',
            selectable: false,
            attrs: {
                name: { default: '' },
                guid: { default: '' },
                href: { default: '' },
            },
            parseDOM: [{
                tag: 'span[data-mention]',
                getAttrs: (dom) => {
                    return {
                        guid: dom.getAttribute('data-mention'),
                        name: dom.textContent,
                    };
                },
            }],
            toDOM(node) {
                const attrs = {
                    'data-mention': node.attrs.guid,
                    contentEditable: 'false'
                };

                return ['span', attrs, '@'+node.attrs.name];
            },
            parseMarkdown: {
                node: "mention", getAttrs: function(tok) {
                    return ({
                        name: tok.attrGet("name"),
                        guid: tok.attrGet("guid"),
                        href: tok.attrGet("href")
                    })
                }
            },
            toMarkdown: (state, node) => {
                let {guid, name, href} = node.attrs;
                state.write("["+state.esc(name)+"](mention:" + state.esc(guid) +" "+ state.quote(href)+ ")");
            },
        }
    },
    marks: {
       mentionMark: {
            excludes: "_",
            inclusive: true,
            parseDOM: [
                { tag: 'span[data-mention-mark]' }
            ],
           toDOM(node) {
               return ['span', {
                   'data-mention-mark': true,
                   'contentEditable': false
               }];
           }
        },
        mentionQuery: {
            excludes: "_",
            inclusive: true,
            parseDOM: [
                { tag: 'span[data-mention-query]' }
            ],
            toDOM(node) {
                return ['span', {
                    'data-mention-query': true,
                    style: `color: #0078D7`
                }];
            }
        }
    }
};

export {schema}