const paragraph =  {
    content: "inline*",
    group: "block",
    parseDOM: [{tag: "p"}],
    toDOM: function toDOM() {
        return ["p", 0]
    }
};

export {paragraph}