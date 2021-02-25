/* jshint -W024 */
/* jshint expr:true */

const expect = require('chai').expect;
const {initEditor, serialize, toHtml, viewToHtml} = require('../testEditor');

describe("MarkdownEditor:init", () => {
    it("test initializing the editor", (done) => {
        let editor = initEditor();
        expect(editor).to.not.be.null;
        expect(editor.$).to.not.be.null;
        expect(editor.$.attr('id')).to.equal('stage');
        expect(editor.isEmpty()).to.be.true;
        expect(editor.$.data('richtextInstance')).to.equal(editor);
        done();
    });

    it("test initializing the editor with text", (done) => {
        let editor = initEditor('Hello');
        expect(editor).to.not.be.null;
        expect(editor.$).to.not.be.null;
        expect(editor.$.attr('id')).to.equal('stage');
        expect(editor.isEmpty()).to.be.false;
        expect(editor.serialize()).to.equal('Hello');
        done();
    });

    it("test overwriting the editor instance", (done) => {
        let editor = initEditor('Editor1');
        let editor1Context = editor.context;
        let editor2 = initEditor('Editor2');
        let editor2Context = editor2.context;
        expect(editor1Context).not.to.equal(editor2Context);
        expect(serialize()).to.equal('Editor2');
        expect(editor.$.data('richtextInstance')).to.equal(editor2);
        done();
    });

    it("test editor destroy removes the editor view", (done) => {
        let editor = initEditor('Initial content');
        editor.destroy();
        expect(editor.$.html()).to.be.empty
        done();
    });

    it("test editor clear resets the editor view", (done) => {
        let editor = initEditor('Initial content');
        editor.clear();
        expect(serialize()).to.be.empty
        done();
    });

    it("test editor transformToView and back", (done) => {
        let editor = initEditor('## Initial content');
        let view = editor.transformToView();
        expect(viewToHtml(view)).equal('<h2>Initial content</h2>');
        editor = view.transformToEditor();
        expect(toHtml(editor)).to.equal('<h2>Initial content</h2>');
        done();
    });
});