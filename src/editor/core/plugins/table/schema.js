import {tableNodes} from 'prosemirror-tables'

let nodes = tableNodes({
    tableGroup: "block",
    cellContent: "paragraph+",
    cellAttributes: {
        style: {
            default: null,
            getFromDOM(dom) {
                return dom.style;
            },
            setDOMAttr(value, attrs) {
                if (value) {
                    attrs.style = value
                }
            }
        }
    }
});

nodes = Object.assign(nodes, {
    table: {
        content: "(table_row+ | table_head | table_body | table_foot)",
        tableRole: "table",
        isolating: false,
        group: "block",
        parseDOM: [{tag: "table"}],
        toDOM: function toDOM() {
            return ["table", ["tbody", 0]]
        }
    },
    table_head: {
        content: "table_row*",
        tableRole: "head",
        parseDOM: [{tag: "thead"}],
        toDOM: function toDOM() {
            return ["thead", 0]
        }
    },
    table_body: {
        content: "table_row*",
        tableRole: "body",
        parseDOM: [{tag: "tbody"}],
        toDOM: function toDOM() {
            return ["tbody", 0]
        }
    },
    table_foot: {
        content: "table_row*",
        tableRole: "foot",
        parseDOM: [{tag: "tfoot"}],
        toDOM: function toDOM() {
            return ["tfoot", 0]
        }
    }
});

const tableSchema = {
    nodes: nodes
};

export {tableSchema}