/* jshint -W024 */
/* jshint expr:true */

const expect = require('chai').expect;
const {initEditor, toHtml, serialize, simulateInputRule, type, insertText} = require('../../testEditor');

const HR = '<div contenteditable="false"><hr></div>';

// Emulates typing a single character through the registered input rules (like a real keypress)
const typeChar = (editor, char) => {
    const pos = editor.view.state.selection.from;
    return editor.view.someProp('handleTextInput', (f) => f(editor.view, pos, pos, char));
};

describe("Plugin:horizontal rule", () => {
    it("test init horizontal rule", (done) => {
        initEditor('Before\n\n---\n\nAfter');
        expect(toHtml()).to.equal('<p>Before</p>' + HR + '<p>After</p>');
        expect(serialize()).to.equal('Before\n\n---\n\nAfter');
        done();
    });

    it("test horizontal rule input rule after em dash replacement", (done) => {
        initEditor();
        // The emDash rule has already replaced `--` with `—` when the third hyphen is typed
        expect(simulateInputRule('—-')).to.be.true;
        insertText('After');
        expect(toHtml()).to.equal(HR + '<p>After</p>');
        expect(serialize()).to.equal('---\n\nAfter');
        done();
    });

    it("test typing three hyphens creates a horizontal rule", (done) => {
        const editor = initEditor();
        expect(typeChar(editor, '-')).to.not.be.true; // first hyphen is inserted as is
        type('-');
        expect(typeChar(editor, '-')).to.be.true; // `--` -> em dash
        expect(typeChar(editor, '-')).to.be.true; // `—-` -> horizontal rule
        expect(toHtml()).to.equal(HR + '<p><br class="ProseMirror-trailingBreak"></p>');
        expect(serialize()).to.equal('---');
        done();
    });

    it("test horizontal rule input rule ignores text in paragraph", (done) => {
        initEditor();
        type('Text ');
        expect(simulateInputRule('—-')).to.not.be.true;
        done();
    });
});
