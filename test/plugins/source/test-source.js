/* jshint -W024 */
/* jshint expr:true */

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

    it("test prevent redundant marking in source", (done) => {
        initEditor('Test source mode');
        clickMenuItem('source');
        selectSource(5, 11);
        clickMenuItem('markStrikethrough')
        clickMenuItem('markStrikethrough')
        expect(serialize()).to.equal('Test ~~source~~ mode')
        done();
    });

    it("test editor focus on switch mode", (done) => {
        editor = initEditor('Test source mode');
        clickMenuItem('source');
        expect(editor.hasFocus()).to.be.true;
        expect(editor.context.$source.is(':focus')).to.be.true;
        clickMenuItem('source');
        expect($(editor.view.dom).is(':focus')).to.be.true;
        expect(editor.hasFocus()).to.be.true;
        done();
    });
});