const em = {
    parseDOM: [{tag: "i"}, {tag: "em"},
        {
            style: "font-style", getAttrs: function (value) {
            return value == "italic" && null;
        }
        }],
    toDOM: () => {
        return ["em"]
    }
};

export {em}