/* jshint -W024 */
/* jshint expr:true */

const { schema } = require("prosemirror-schema-basic");
const { DOMParser } = require("prosemirror-model");
const expect = require('chai').expect;
const {initEditor, type, toHtml, serialize, pressKeyEnter} = require("../../testEditor");

describe("Plugin:mention", () => {
    const selectAllText = (editor) => {
        const range = document.createRange();
        range.selectNodeContents(editor.view.dom);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    };

    const copySelection = () => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const clonedRange = range.cloneRange();
        const tempContainer = document.createElement('div');
        tempContainer.appendChild(clonedRange.cloneContents());
        const copiedText = tempContainer.textContent;
        // console.log(clonedRange, clonedRange.cloneContents(), copiedText);

        navigator.clipboard.writeText(copiedText);
        // window.clipboardData.setData('text/html', copiedText);
    };

    function insertHTML(view, value) {
        const { state } = view;
        const element = document.createElement('p');
        element.innerHTML = value.trim();

        const parser = DOMParser.fromSchema(state.schema);
        const slice = parser.parseSlice(element);
        // console.log(element, state.selection.anchor, slice.content);
        const tr = state.tr.insert(state.selection.anchor, slice.content);

        view.dispatch(tr);
    }

    it("test copy/paste text with mention", (done) => {
        // const htmlContent = "<p>Mention <span data-mention-query=\"true\" style=\"color: #0078D7\">@John Doe</span></p>";
        const editor = initEditor();
        // insertHTML(editor.view, htmlContent);

        const view = editor.view;
        type('Mention @John Doe');
        pressKeyEnter();

        selectAllText(editor);
        copySelection();

        navigator.clipboard.readText().then(text => {
            console.log(text);
            if (text) {
                // Insert the text into the editor
                const {tr} = view.state;
                const {from, to} = view.state.selection;
                tr.insertText(text, from, to);
                view.dispatch(tr);
            }

            expect(toHtml()).to.equal('<p>Mention @John Doe</p>');
            expect(serialize()).to.equal('Mention @John Doe');

            done();
        });
    });
});
