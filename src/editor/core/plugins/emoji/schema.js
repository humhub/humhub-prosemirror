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
    }
};

const emojiSchema = {
    nodes: {
        emoji: emoji
    }
};

export {emojiSchema};