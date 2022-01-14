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
                var level = countNumberOfDetailsChildrenLevel(node)

                console.log("toMarkdown:")
                console.log(node)
                console.log(maybeChild(0))
                state.write(":::" + state.repeat(":", level) + " details " +  + node.maybeChild(0).textContent + "\n\n");
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
            // parseMarkdown: {
            //     block: "details_summary"
            // },
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
            // parseMarkdown: {
            //     block: "details_content"
            // },
            // toMarkdown: (state, node) => {
            //     state.write("content")
            //     // state.renderContent(node)
            // }
        }
    }
};

function countNumberOfDetailsChildrenLevel(node){
    var inner_node_count_max = 0
    node.forEach(function(node, offset, index){
        inner_node_count_max = 0
        if(node.type.name === "container_details"){
            var inner_node_count = 1 + countNumberOfDetailsChildrenLevel(node)

            if(inner_node_count > inner_node_count_max){
                inner_node_count_max = inner_node_count
            }
        }
    })
    return inner_node_count_max
}

export {schema}