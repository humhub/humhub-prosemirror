/* jshint -W024 */
/* jshint expr:true */

const expect = require('chai').expect;
const {initEditor, toHtml, serialize, simulateInputRule, pressKeyArrowDown, clickMenuItem, type, insertText} = require('../../testEditor');

describe("Plugin:blockquote", () => {
    it("test init blockquote", (done) => {
        initEditor('> This is a block quote');
        expect(toHtml()).to.equal('<blockquote><p>This is a block quote</p></blockquote>');
        expect(serialize()).to.equal('> This is a block quote');
        done();
    });

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

    it("test leave code block on arrow down", (done) => {
        let editor = initEditor();
        type('This is a block quote');
        clickMenuItem('wrapBlockQuote');
        pressKeyArrowDown();
        expect(toHtml()).to.equal('<blockquote><p>This is a block quote</p></blockquote><p><br></p>');
        done();
    });
});