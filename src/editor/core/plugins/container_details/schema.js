const schema = {
    nodes: {
        container_details : {
            sortOrder: 200,
            attrs: {level: {default: 0}, summary: {default: "Details"}},
            content: "block*",
            group: "block",
            selectable: true,
            draggable: true,
            defining: true,
            parseDOM: [{tag: "details"}],
            toDOM(node) {
                return ["details", {open: ""}, /*["summary", node.attrs.summary], ["div", 0]*/ 0]
            },
            parseMarkdown: {
                block: "container_details", getAttrs: function (tok) {
                    return ({level: +tok.level});
                    // return ({summary: +tok.nodes.first().content});
                }
            },
            toMarkdown: (state, node) => {
                state.write(":::" + state.repeat(":", 10 - node.attrs.level) + " details " + /*node.attrs.summary + */"\n\n");
                state.renderContent(node)
                state.write(":::" + state.repeat(":", 10 - node.attrs.level) + "\n\n");
                state.closeBlock(node);
            }
        }
    }
};

export {schema}