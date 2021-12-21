const schema = {
    nodes: {
        details : {
            sortOrder: 200,
            content: "paragraph+",
            group: "block",
            selectable: false,
            draggable: false,
            defining: true,
            parseDOM: [{tag: "details"}],
            toDOM(node) {
                return ["details", {open: ""}, 0]
            },
            parseMarkdown: {mark: "details"},
            toMarkdown: (state, node) => {
                state.write("<details>\n\n");
                state.ensureNewLine();
                state.renderContent(node)
                state.ensureNewLine();
                state.write("</details>");
                state.closeBlock(node);
            }
        }
    }
};

export {schema}