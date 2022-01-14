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
                let level = 0;
                node.descendants(function(node, pos, parent, index){
                    if(node.type.name === "container_details"){
                        level ++
                        return true
                    }
                    return false
                })
                state.write(":::" + state.repeat(":", level) + " details \n\n");
                state.renderContent(node)
                state.write(":::" + state.repeat(":", level) + "\n\n");
                state.closeBlock(node);
            }
        }
    }
};

export {schema}