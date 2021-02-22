const expect = require('chai').expect;
const {initEditor, toHtml, serialize, simulateInputRule, setSelection, clickMenuItem, type} = require('../../testEditor');

describe("Plugin:strong", () => {
    it("test init strong text", (done) => {
        initEditor('**This is bold**');
        expect(toHtml()).to.equal('<p><strong>This is bold</strong></p>');
        expect(serialize()).to.equal('**This is bold**');
        done();
    });

    it("test strong input rule", (done) => {
        initEditor();
        expect(simulateInputRule('**Make me bold!**')).to.be.true;
        expect(toHtml()).to.equal('<p><strong>Make me bold!</strong></p>');
        expect(serialize()).to.equal('**Make me bold!**');
        done();
    });

    it("test strong menu item mark selection", (done) => {
        let editor = initEditor('Make this bold!');
        setSelection(5,10);
        clickMenuItem('markStrong');
        expect(toHtml()).to.equal('<p>Make <strong>this</strong> bold!</p>');
        done();
    });

    it("test strong menu item mark type", (done) => {
        let editor = initEditor();
        clickMenuItem('markStrong');
        type('Test', editor);
        expect(toHtml()).to.equal('<p><strong>Test</strong></p>');
        done();

    });
});