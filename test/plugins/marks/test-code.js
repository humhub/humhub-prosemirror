const expect = require('chai').expect;
const {initEditor, toHtml, serialize, simulateInputRule, setSelection, clickMenuItem, type} = require('../../testEditor');

describe("Plugin:code", () => {
    it("test init code text", (done) => {
        initEditor('`This is code`');
        expect(toHtml()).to.equal('<p><code>This is code</code></p>');
        expect(serialize()).to.equal('`This is code`');
        done();
    });

    it("test code input rule", (done) => {
        initEditor();
        expect(simulateInputRule('`Make me code!`')).to.be.true;
        expect(toHtml()).to.equal('<p><code>Make me code!</code></p>');
        expect(serialize()).to.equal('`Make me code!`');
        done();
    });

    it("test code menu item mark selection", (done) => {
        let editor = initEditor('Make this code!');
        setSelection(5,10);
        clickMenuItem('markCode');
        expect(toHtml()).to.equal('<p>Make <code>this</code> code!</p>');
        done();
    });

    it("test code menu item mark type", (done) => {
        let editor = initEditor();
        clickMenuItem('markCode');
        type('Test', editor);
        expect(toHtml()).to.equal('<p><code>Test</code></p>');
        done();
    });
});