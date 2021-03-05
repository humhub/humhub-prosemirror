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
            expect(toHtml()).to.equal('<p>TEST1</p>');
            done();
        }, 500);
    });

    it("test redo", (done) => {
        initEditor({exclude: ['resizeNav']});
        insertText('TEST1');

        setTimeout(() => {
            insertText('TEST2');
            clickMenuItem('undo');
            clickMenuItem('redo');
            expect(toHtml()).to.equal('<p>TEST1TEST2</p>');
            done();
        }, 500);
    });
});