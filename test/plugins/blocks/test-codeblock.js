const expect = require('chai').expect;
const {initEditor, toHtml, serialize, simulateInputRule, setSelection, clickMenuItem, type, insertText} = require('../../testEditor');

describe("Plugin:codeblock", () => {
    it("test init blockquote", (done) => {
        window.debugblock = true;
        initEditor('```\nThis is a code block\n```');
        expect(toHtml()).to.equal('<pre><code>This is a code block</code></pre>');
        expect(serialize()).to.equal('```\nThis is a code block\n```');
        done();
    });
/*
    it("test strong input rule", (done) => {
        let editor = initEditor();
        expect(simulateInputRule('> ')).to.be.true;
        insertText('This is a block quote');
        expect(toHtml()).to.equal('<blockquote><p>This is a block quote</p></blockquote>');
        expect(serialize()).to.equal('> This is a block quote');
        done();
    });

    it("test blockquote menu item wrap line", (done) => {
        let editor = initEditor();
        type('This is a block quote');
        clickMenuItem('wrapBlockQuote');
        expect(toHtml()).to.equal('<blockquote><p>This is a block quote</p></blockquote>');
        done();
    });

    it("test double blockquote menu item wrap line", (done) => {
        let editor = initEditor();
        type('This is a block quote');
        clickMenuItem('wrapBlockQuote');
        clickMenuItem('wrapBlockQuote');
        expect(toHtml()).to.equal('<blockquote><blockquote><p>This is a block quote</p></blockquote></blockquote>');
        done();
    });
    */
});