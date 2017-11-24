const code_block = {
    content: "text*",
    group: "block",
    code: true,
    defining: true,
    attrs: {params: {default: ""}},
    parseDOM: [{
        tag: "pre", preserveWhitespace: true, getAttrs: function (node) {
            return ({params: node.getAttribute("data-params")});
        }
    }],
    toDOM: function toDOM(node) {
        return ["pre", node.attrs.params ? {"data-params": node.attrs.params} : {}, ["code", 0]]
    }
};

export {code_block}