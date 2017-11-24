const link = {
    attrs: {
        href: {},
        title: {default: null}
    },
    inclusive: false,
    parseDOM:
        [{
            tag: "a[href]", getAttrs: function getAttrs(dom) {
                return {href: dom.getAttribute("href"), title: dom.getAttribute("title")}
            }
        }],
    toDOM: () => {
        return ["a", node.attrs]
    }
};

export {link}