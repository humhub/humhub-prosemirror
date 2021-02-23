let editorInstance;

module.exports.initEditor = function(options, init) {
    if(typeof options === 'string') {
        init = options;
        options = {};
    }

    options = options || {edit : true};

    editorInstance = new window.prosemirror.MarkdownEditor("#stage", options);

    editorInstance.init(init);

    return editorInstance;
};

module.exports.toHtml = function() {
    return $("#stage .ProseMirror").html();
};

module.exports.serialize = function() {
    return getEditor().serialize();
};

let getEditor = function(editor) {
    if(editor) {
        return editor;
    }

    if(editorInstance) {
        return editorInstance;
    }

    return module.exports.initEditor();
};

module.exports.getEditor = getEditor;

module.exports.type = function(word, editor, startPos) {
    // https://discuss.prosemirror.net/t/simulated-typing-for-integration-tests/807
    editor = getEditor(editor);

    let chars = word.split("");
    let transactions = [];
    let nextPos = startPos ? startPos : editor.view.state.doc.content.child(0).content.size + 1;

    if(editor.view.state.selection.from != nextPos) {
        setSelection(nextPos, null, editor);
    }

    for(let i = 0; i < word.length; i++) {
        let newTr = editor.view.state.tr.insertText(chars[i], nextPos);
        transactions.push(newTr);
        editor.view.dispatch(transactions[i]);

        nextPos = editor.view.state.doc.content.child(0).content.size + 1;
    }

    setSelection(nextPos, null, editor);

};

let insertText = function(text, from, to, editor)
{
    editor = getEditor(editor);
    editor.view.dispatch(editor.view.state.tr.insertText(text, from, to));
};

module.exports.insertText = insertText;

let setSelection = function(start, end, editor) {
    editor = getEditor(editor);

    if(!end) {
        end = start;
    }

    let selection = new prosemirror.state.TextSelection(editor.view.state.doc.resolve(start), editor.view.state.doc.resolve(end));
    editor.view.dispatch(editor.view.state.tr.setSelection(selection));
};

module.exports.setSelection = setSelection;

let clickMenuItem = function(id) {
    $('.ProseMirror-menu-'+id)[0].dispatchEvent(new Event('mousedown', {bubbles: true}));
};

let clickDropdownMenuItem = function(id, subId, subId2) {
    clickMenuItem(id);
    clickMenuItem(subId);
    if(subId2) {
        clickMenuItem(subId2);
    }
    // Manually close
    clickMenuItem(id);
};

let menuItemDisabled = function(id) {
    return $('.ProseMirror-menu-'+id).is('.ProseMirror-menu-disabled');
};

let pressKey = function(key, code) {
    $('.ProseMirror')[0].dispatchEvent(new KeyboardEvent('keydown', { key: key, code: code }));
}

let pressKeyArrowDown = function() {
    pressKey('ArrowDown', 40);
}

module.exports.pressKey = pressKey;
module.exports.pressKeyArrowDown = pressKeyArrowDown;
module.exports.clickDropdownMenuItem = clickDropdownMenuItem;
module.exports.clickMenuItem = clickMenuItem;
module.exports.menuItemDisabled = menuItemDisabled;

module.exports.simulateInputRule = function(word, editor) {
    editor = getEditor(editor);
    let trigger = word.slice(-1);
    let input = word.substr(0, word.length - 1);

    module.exports.type(input, editor);

    return editor.view.someProp("handleTextInput", function (f) {
        return f(editor.view, word.length, word.length, trigger);
    });
};

module.exports.selectSource = function(start, end, direction, editor) {
    editor = getEditor(editor);
    editor.context.$source[0].setSelectionRange(start, end, direction);
}