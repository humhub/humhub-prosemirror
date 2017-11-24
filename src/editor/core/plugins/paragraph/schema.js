const schema = {
    nodes: {
        paragraph:  {
            sortOrder: 100,
            content: "inline*",
            group: "block",
            parseDOM: [{tag: "p"}],
            toDOM: function toDOM() {
                return ["p", 0]
            },
            parseMarkdown: {block: "paragraph"},
            toMarkdown: (state, node) => {
                state.renderInline(node);
                if(!state.table) state.closeBlock(node);
            }
        }
    }
};

export {schema}