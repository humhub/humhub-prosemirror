const expect = require('chai').expect;
const {initEditor} = require('../testEditor');

describe("Editor Init", () => {
    it("test initializing the editor", (done) => {
        let editor = initEditor();
        expect(editor).to.not.be.null;
        expect(editor.$).to.not.be.null;
        expect(editor.$.attr('id')).to.equal('stage');

        expect(editor.isEmpty()).to.be.true;
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
});