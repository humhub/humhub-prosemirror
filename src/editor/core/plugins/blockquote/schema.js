const schema = {
    nodes: {
        blockquote : {
            sortOrder: 200,
            content: "block+",
            group: "block",
            marks: "",
            parseDOM: [{tag: "blockquote"}],
            toDOM: function toDOM() {
                return ["blockquote", 0]
            },
            parseMarkdown: {block: "blockquote"},
            toMarkdown: (state, node) =>  {
                if(state.table) return state.renderContent(node);
                state.wrapBlock("> ", null, node, function () { return state.renderContent(node); });
            }
        }
    }
};

export {schema}