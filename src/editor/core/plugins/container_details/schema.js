const schema = {
    nodes: {
        container_details : {
            sortOrder: 200,
            content: "details_summary details_content",
            group: "block",
            selectable: true,
            draggable: true,
            defining: true,
            editable: false,
            parseDOM: [
                {tag: "details"},
            ],
            toDOM(node) {
                return ["details", /*{open: ""},*/ 0]
            },
            parseMarkdown: {
                block: "container_details"
            },
            toMarkdown: (state, node, tok) => {
                let level = 0;
                node.descendants(function(node, pos, parent, index){
                    if(node.type.name === "details_content"){
                        return true
                    }
                    if(node.type.name === "container_details"){
                        level ++
                        return true
                    }
                    return false
                })

                state.write(":::" + state.repeat(":", level) + " details ")
                state.renderContent(node.maybeChild(0))
                state.write("\n\n");
                state.renderContent(node.maybeChild(1))
                state.write(":::" + state.repeat(":", level) + "\n\n");
                state.closeBlock(node);
            }
        },
        details_summary : {
            content: "paragraph",
            group: "block",
            marks: "_",
            selectable: true,
            draggable: false,
            parseDOM: [{tag: "summary"}],
            toDOM(node) {
                return ["summary", 0]
            },
            parseMarkdown: {
                block: "details_summary"
            },
            // toMarkdown: (state, node) => {
            //     state.write("summary")
            // }
        },
        details_content : {
            content: "block+",
            group: "block",
            selectable: true,
            draggable: false,
            parseDOM: [],
            toDOM(node) {
                return ["div", 0]
            },
            parseMarkdown: {
                block: "details_content"
            },
            // toMarkdown: (state, node) => {
            //     state.write("content")
            //     // state.renderContent(node)
            // }
        }
    }
};

export {schema}