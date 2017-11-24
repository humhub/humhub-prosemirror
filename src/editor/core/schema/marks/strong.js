const strong = {
    parseDOM: [{tag: "b"}, {tag: "strong"},
        {
            style: "font-weight", getAttrs: function (value) {
            return /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null;
        }
        }],
    toDOM: () => {
        return ["strong"]
    }
};

export {strong}