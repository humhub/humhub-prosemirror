
const mentionSchema = {
    nodes: {
        mention: {
            inline: true,
            group: 'inline',
            attrs: {
                guid: { default: '' },
                name: { default: '' },
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
                const {guid, name} = node.attrs;

                const attrs = {
                    guid: guid,
                    contentEditable: 'false'
                };

                return ['span', attrs, name];
            }
        }
    },
    marks: {
        mentionQuery: {
            parseDOM: [
                { tag: 'span[data-mention-query]' }
            ],
            toDOM(node) {
                return ['span', {
                    'data-mention-query': true,
                    'data-active': node.attrs.active,
                    style: `color: #0078D7`
                }];
            },
            attrs: {
                active: {
                    default: true
                }
            }
        }
    }
};

export {mentionSchema}