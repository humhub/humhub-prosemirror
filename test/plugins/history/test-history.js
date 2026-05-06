/* jshint -W024 */
/* jshint expr:true */

const expect = require('chai').expect;
const {initEditor, insertText, toHtml, clickMenuItem, expectMenuItemVisible, expectMenuItemNotVisible} = require('../../testEditor');

describe("Plugin:history", () => {

    it("test init with history", (done) => {
        initEditor({exclude: ['resizeNav']});
        expectMenuItemVisible('undo');
        expectMenuItemVisible('redo');
        done();
    });

    it("test disable history", (done) => {
        initEditor({exclude: ['resizeNav', 'history']});
        expectMenuItemNotVisible('undo');
        expectMenuItemNotVisible('redo');
        done();
    });

    it("test undo", (done) => {
        initEditor({exclude: ['resizeNav']});
        insertText('TEST1');

        setTimeout(() => {
            insertText('TEST2');
            clickMenuItem('undo');
            setTimeout(() => {
                const html = toHtml();
                expect(html).to.not.equal('<p>TEST1TEST2</p>');
                expect(['<p>TEST1</p>', '<p><br class="ProseMirror-trailingBreak"></p>']).to.include(html);
                done();
            }, 0);
        }, 500);
    });

    it("test redo", (done) => {
        initEditor({exclude: ['resizeNav']});
        insertText('TEST1');

        setTimeout(() => {
            insertText('TEST2');
            clickMenuItem('undo');
            clickMenuItem('redo');
            setTimeout(() => {
                expect(toHtml()).to.equal('<p>TEST1TEST2</p>');
                done();
            }, 0);
        }, 500);
    });
});
