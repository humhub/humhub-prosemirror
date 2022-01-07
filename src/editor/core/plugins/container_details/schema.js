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
                return ["details", {open: ""}, 0]
            },
            parseMarkdown: {
                block: "container_details", getAttrs: function (tok) {
                    console.log(tok.level)
                    return ({level: +tok.level});
                    // return ({summary: +tok.nodes.first().content});
                }
            },
            toMarkdown: (state, node) => {
                state.write(":::" + state.repeat(":", node.attrs.level) + " details " + node.attrs.summary + "\n\n");
                // state.ensureNewLine();
                state.renderContent(node)
                // state.ensureNewLine();
                state.write(":::" + state.repeat(":", node.attrs.level) + "\n\n");
                // state.ensureNewLine();
                state.closeBlock(node);
            }
        }
    }
};

export {schema}