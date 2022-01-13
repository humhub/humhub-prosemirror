const schema = {
    nodes: {
        container_details : {
            sortOrder: 200,
            attrs: {level: {default: 0}},
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
                console.log("toDOM:")
                console.log(node)
                return ["details", /*{open: ""}, */0]
            },
            parseMarkdown: {
                block: "container_details", getAttrs: function (tok) {
                    console.log("parseMarkdown:")
                    console.log(tok)
                    return ({level: +tok.level});
                }
            },
            toMarkdown: (state, node) => {
                console.log("toMarkdown:")
                console.log(node)
                state.write(":::" + state.repeat(":", (10 - node.attrs.level)) + " details " + node.firstChild.textContent + "\n\n");
                state.renderContent(node.maybeChild(1))
                state.write(":::" + state.repeat(":", (10 - node.attrs.level)) + "\n\n");
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

export {schema}