const expect = require('chai').expect;
const {
    initEditor,
    selectSource,
    toHtml,
    serialize,
    simulateInputRule,
    setSelection,
    clickMenuItem,
    type
} = require('../../testEditor');

describe("Plugin:source", () => {
    it("test strong mark in source mode", (done) => {
        initEditor('Test source mode');
        clickMenuItem('source');
        selectSource(5, 11);
        clickMenuItem('markStrong')
        expect(serialize()).to.equal('Test **source** mode')
        clickMenuItem('source');
        expect(toHtml()).to.equal('<p>Test <strong>source</strong> mode</p>')
        done();
    });

    it("test em mark in source mode", (done) => {
        initEditor('Test source mode');
        clickMenuItem('source');
        selectSource(5, 11);
        clickMenuItem('markEm')
        expect(serialize()).to.equal('Test _source_ mode')
        clickMenuItem('source');
        expect(toHtml()).to.equal('<p>Test <em>source</em> mode</p>')
        done();
    });

    it("test striketrhough mark in source mode", (done) => {
        initEditor('Test source mode');
        clickMenuItem('source');
        selectSource(5, 11);
        clickMenuItem('markStrikethrough')
        expect(serialize()).to.equal('Test ~~source~~ mode')
        clickMenuItem('source');
        expect(toHtml()).to.equal('<p>Test <s>source</s> mode</p>')
        done();
    });
});