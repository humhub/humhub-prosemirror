/* jshint -W024 */
/* jshint expr:true */

const expect = require('chai').expect;
const {initEditor, serialize} = require('../testEditor');

describe("Editor Init", () => {
    it("test initializing the editor", (done) => {
        let editor = initEditor();
        expect(editor).to.not.be.null;
        expect(editor.$).to.not.be.null;
        expect(editor.$.attr('id')).to.equal('stage');
        expect(editor.isEmpty()).to.be.true;
        expect(editor.$.data('editorInstance')).to.equal(editor);
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
        expect(editor.$.data('editorInstance')).to.equal(editor2);
        done();
    });
});