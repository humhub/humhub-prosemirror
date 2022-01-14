const schema = {
    nodes: {
        container_details : {
            sortOrder: 200,
            content: "block*",
            group: "block",
            selectable: true,
            draggable: true,
            defining: true,
            parseDOM: [{
                tag: "details"
            }],
            toDOM(node) {
                return ["details", {open: ""}, 0]
            },
            parseMarkdown: {
                block: "container_details"
            },
            toMarkdown: (state, node, tok) => {
                var level = countNumberOfDetailsChildrenLevel(node)

                state.write(":::" + state.repeat(":", level) + " details \n\n");
                state.renderContent(node)
                state.write(":::" + state.repeat(":", level) + "\n\n");
                state.closeBlock(node);
            }
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