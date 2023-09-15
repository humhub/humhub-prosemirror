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
        expect(toHtml('#stage .ProseMirror .cm-editor .cm-content')).to.equal('<div class="cm-line">This is a code block</div>');
        expect(serialize()).to.equal('```\nThis is a code block\n```');
        done();
    });

    it("test code block input rule", (done) => {
        let editor = initEditor();
        expect(simulateInputRule('```')).to.be.true;
        insertText('This is a code block');
        expect(toHtml('#stage .ProseMirror .cm-editor .cm-content')).to.equal('<div class="cm-line">This is a code block</div>');
        expect(serialize()).to.equal('```\nThis is a code block\n```');
        done();
    });

    it("test code block menu item wrap line", (done) => {
        let editor = initEditor();
        type('This is a code block');
        clickDropdownMenuItem('type','makeCodeBlock');
        expect(toHtml()).to.equal('<div class="cm-editor ͼ1 ͼ2 ͼ4" contenteditable="false"><div aria-live="polite" style="position: fixed; top: -10000px;"></div><div tabindex="-1" class="cm-scroller"><div class="cm-gutters" aria-hidden="true" style="min-height: 14px; position: sticky;"><div class="cm-gutter cm-lineNumbers"><div class="cm-gutterElement" style="height: 0px; visibility: hidden; pointer-events: none;">9</div><div class="cm-gutterElement" style="height: 14px;">1</div></div></div><div spellcheck="false" autocorrect="off" autocapitalize="off" translate="no" contenteditable="true" class="cm-content" style="tab-size: 4" role="textbox" aria-multiline="true" data-language="javascript"><div class="cm-line">This is a code block</div></div><div class="cm-layer cm-layer-above cm-cursorLayer" aria-hidden="true" style="z-index: 150; animation-duration: 1200ms;"></div><div class="cm-layer cm-selectionLayer" aria-hidden="true" style="z-index: -2;"></div></div></div>');
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
        expect(toHtml('#stage .ProseMirror .cm-editor .cm-content')).to.equal('<div class="cm-line">This is a code block</div>');
        done();
    });
});
