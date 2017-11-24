const ordered_list = {
    content: "list_item+",
        group: "block",
        attrs: {order: {default: 1}, tight: {default: false}},
    parseDOM: [{
        tag: "ol", getAttrs: function getAttrs(dom) {
            return {
                order: dom.hasAttribute("start") ? +dom.getAttribute("start") : 1,
                tight: dom.hasAttribute("data-tight")
            }
        }
    }],
        toDOM: function toDOM(node) {
        return ["ol", {
            start: node.attrs.order == 1 ? null : node.attrs.order,
            "data-tight": node.attrs.tight ? "true" : null
        }, 0]
    }
};

export {ordered_list}