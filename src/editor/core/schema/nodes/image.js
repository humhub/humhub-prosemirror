const image = {
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
    toDOM: function toDOM(node) {
        return ["img", node.attrs]
    }
};

export {image}