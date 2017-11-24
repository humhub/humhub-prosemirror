const bullet_list = {
    content: "list_item+",
    group: "block",
    attrs: {tight: {default: false}},
    parseDOM: [{
        tag: "ul", getAttrs: function (dom) {
            return ({tight: dom.hasAttribute("data-tight")});
        }
    }],
    toDOM: function toDOM(node) {
        return ["ul", {"data-tight": node.attrs.tight ? "true" : null}, 0]
    }
};

export {bullet_list}