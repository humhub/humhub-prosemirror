const strikethrough = {
    parseDOM: [{tag: "s"}],
    toDOM: () => {
        return ["s"]
    }
};

export {strikethrough}
