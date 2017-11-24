const hard_break = {
    inline: true,
    group: "inline",
    selectable: false,
    parseDOM: [{tag: "br"}],
    toDOM: function toDOM() {
        return ["br"]
    }
};

export {hard_break}