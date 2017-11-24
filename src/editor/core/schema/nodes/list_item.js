const list_item = {
    content: "paragraph block*",
    defining: true,
    parseDOM: [{tag: "li"}],
    toDOM: function toDOM() {
        return ["li", 0]
    }
};

export {list_item}