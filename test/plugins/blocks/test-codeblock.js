/* jshint -W024 */
/* jshint expr:true */

const expect = require('chai').expect;
const {initEditor, toHtml, serialize, simulateInputRule,
    clickDropdownMenuItem, type, insertText,
    menuItemDisabled, pressKeyArrowDown} = require('../../testEditor');

describe("Plugin:code block", () => {
    it("test init code block", (done) => {
        window.debugblock = true;
        initEditor('```\nThis is a code block\n```');
        expect(toHtml()).to.equal('<pre><code>This is a code block</code></pre>');
        expect(serialize()).to.equal('```\nThis is a code block\n```');
        done();
    });

    it("test code block input rule", (done) => {
        let editor = initEditor();
        expect(simulateInputRule('```')).to.be.true;
        insertText('This is a code block');
        expect(toHtml()).to.equal('<pre><code>This is a code block</code></pre>');
        expect(serialize()).to.equal('```\nThis is a code block\n```');
        done();
    });

    it("test code block menu item wrap line", (done) => {
        let editor = initEditor();
        type('This is a code block');
        clickDropdownMenuItem('type','makeCodeBlock');
        expect(toHtml()).to.equal('<pre><code>This is a code block</code></pre>');
        expect(serialize()).to.equal('```\nThis is a code block\n```');
        done();
    });

    it("test code block marks disabled", (done) => {
        let editor = initEditor();
        type('This is a code block');
        clickDropdownMenuItem('type','makeCodeBlock');
        expect(menuItemDisabled('markStrong')).to.be.true;
        expect(menuItemDisabled('markEm')).to.be.true;
        expect(menuItemDisabled('markStrikethrough ')).to.be.true;
        expect(menuItemDisabled('insertEmoji ')).to.be.true;
        done();
    });

    it("test leave code block on arrow down", (done) => {
        let editor = initEditor();
        type('This is a code block');
        clickDropdownMenuItem('type','makeCodeBlock');
        pressKeyArrowDown();
        expect(toHtml()).to.equal('<pre><code>This is a code block</code></pre><p><br></p>');
        done();
    });
});