const horizontal_rule = {
    group: "block",
    parseDOM: [{tag: "hr"}],
    toDOM: function toDOM() {
        return ["div", ["hr"]]
    }
};

export {horizontal_rule}