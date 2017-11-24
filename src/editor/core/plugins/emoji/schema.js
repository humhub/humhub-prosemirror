import twemoji from "twemoji"

let emoji = {
    attrs: {
        class: {default: 'emoji'},
        draggable: {default: 'false'},
        width: {default: '18'},
        height: {default: '18'},
        'data-name': {default: null},
        alt: {default: null},
        src: {default: null},
    },
    inline: true,
    group: "inline",
    parseDOM: [{
        tag: "img.emoji", getAttrs: function getAttrs(dom) {
            return {
                src: dom.getAttribute("src"),
                alt: dom.getAttribute("alt"),
                'data-name': dom.getAttribute('data-name')
            }
        }
    }],
    toDOM: function toDOM(node) {
        return ['img', node.attrs]
    },
    parseMarkdown:  {
        node: "emoji", getAttrs: function (tok) {
            let $dom = $(twemoji.parse(tok.content));
            return ({
                'data-name': tok.markup,
                alt: $dom.attr('alt'),
                src: $dom.attr('src')
            })
        }
    },
    toMarkdown: (state, node) => {
        state.write(':'+state.esc(node.attrs['data-name'])+':')
    }
};

const schema = {
    nodes: {
        emoji: emoji
    }
};

export {schema};