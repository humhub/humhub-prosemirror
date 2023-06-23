/* jshint -W024 */
/* jshint expr:true */

const expect = require('chai').expect;
const {initEditor, pressKey, toHtml} = require('../testEditor');

describe("Menu:accessibility", () => {
    const DIR_RIGHT = 39;
    const DIR_LEFT = 37;

    const DIR_DOWN = 40;
    const DIR_UP = 38;

    const navigate = function (dir, expectFocusId) {
        const e = jQuery.Event("keydown");
        e.which = dir;

        $(':focus').trigger(e);
        //$('.ProseMirror-menubar').trigger(e);

        if (expectFocusId) {
            expectFocus(expectFocusId);
        }
    };

    /* const navigateDropDown = function (id, dir, expectFocusId) {
         var e = jQuery.Event("keydown");
         e.which = dir;
         $('.ProseMirror-menu-' + id).parent('.ProseMirror-menu-dropdown-wrap').trigger(e);
     };*/

    const pressEnter = function () {
        const e = jQuery.Event("keydown");
        e.which = 13;
        $(':focus').trigger(e);
    };

    const pressEscape = function () {
        const e = jQuery.Event("keydown");
        e.which = 27;
        $(':focus').trigger(e);
    };

    const expectFocus = function (id) {
        expect($('.ProseMirror-menu-' + id + ':focus').length).to.equal(1);
    };

    const focusMenuItem = function (id) {
        id = id || 'type'; // first element
        $('.ProseMirror-menu-' + id).trigger('focus');
    };

    it("test keyboard right arrow navigation", (done) => {
        initEditor();
        focusMenuItem();
        expectFocus('type');
        navigate(DIR_RIGHT, 'markStrong');
        navigate(DIR_RIGHT, 'markEm');
        navigate(DIR_RIGHT, 'markStrikethrough');
        navigate(DIR_RIGHT, 'markCode');
        navigate(DIR_RIGHT, 'linkItem');
        navigate(DIR_RIGHT, 'insertEmoji');
        navigate(DIR_RIGHT, 'insert-dropdown');
        navigate(DIR_RIGHT, 'resizeNav');
        done();
    });

    it("test keyboard left navigation", (done) => {
        initEditor();
        focusMenuItem('resizeNav');
        expectFocus('resizeNav');
        navigate(DIR_LEFT, 'insert-dropdown');
        navigate(DIR_LEFT, 'insertEmoji');
        navigate(DIR_LEFT, 'linkItem');
        navigate(DIR_LEFT, 'markCode');
        navigate(DIR_LEFT, 'markStrikethrough');
        navigate(DIR_LEFT, 'markEm');
        navigate(DIR_LEFT, 'markStrong');
        navigate(DIR_LEFT, 'type');
        done();
    });

    it("test open dropdown on ArrowDown", (done) => {
        initEditor();
        expect($('.ProseMirror-menu-dropdown-menu').is(':visible')).to.be.false;
        focusMenuItem();
        expectFocus('type');
        navigate(DIR_DOWN);
        expect($('.ProseMirror-menu-dropdown-menu').is(':visible')).to.be.true;
        done();
    });

    it("test close dropdown on escape", (done) => {
        initEditor();
        expect($('.ProseMirror-menu-dropdown-menu').is(':visible')).to.be.false;
        focusMenuItem();
        expectFocus('type');
        navigate(DIR_DOWN);
        pressEscape();
        expect($('.ProseMirror-menu-dropdown-menu').is(':visible')).to.be.false;
        done();
    });

    it("test open dropdown on enter", (done) => {
        initEditor();
        expect($('.ProseMirror-menu-dropdown-menu').is(':visible')).to.be.false;
        focusMenuItem();
        expectFocus('type');
        pressEnter();
        expect($('.ProseMirror-menu-dropdown-menu').is(':visible')).to.be.true;
        done();
    });

    it("test close dropdown on enter", (done) => {
        initEditor();
        expect($('.ProseMirror-menu-dropdown-menu').is(':visible')).to.be.false;
        focusMenuItem();
        expectFocus('type');
        pressEnter();
        pressEnter();
        expect($('.ProseMirror-menu-dropdown-menu').is(':visible')).to.be.false;
        done();
    });

    it("test navigate dropdown on ArrowDown", (done) => {
        initEditor();
        expect($('.ProseMirror-menu-dropdown-menu').is(':visible')).to.be.false;
        focusMenuItem();
        expectFocus('type');
        pressEnter();
        navigate(DIR_DOWN, 'makeParagraph');
        navigate(DIR_DOWN, 'makeHeading1');
        navigate(DIR_DOWN, 'makeHeading2');
        navigate(DIR_DOWN, 'makeHeading3');
        navigate(DIR_DOWN, 'makeHeading4');
        // navigate(DIR_DOWN, 'makeHeading5');
        // navigate(DIR_DOWN, 'makeHeading6');
        navigate(DIR_DOWN, 'makeCodeBlock');
        navigate(DIR_DOWN, 'makeParagraph');
        done();
    });

    it("test navigate dropdown on ArrowUp", (done) => {
        initEditor();
        expect($('.ProseMirror-menu-dropdown-menu').is(':visible')).to.be.false;
        focusMenuItem();
        expectFocus('type');
        pressEnter();
        navigate(DIR_DOWN, 'makeParagraph');
        navigate(DIR_UP, 'makeCodeBlock');
        // navigate(DIR_UP, 'makeHeading6');
        // navigate(DIR_UP, 'makeHeading5');
        navigate(DIR_UP, 'makeHeading4');
        navigate(DIR_UP, 'makeHeading3');
        navigate(DIR_UP, 'makeHeading2');
        navigate(DIR_UP, 'makeHeading1');
        navigate(DIR_UP, 'makeParagraph');
        done();
    });

    it("test enter sub menu on Enter", (done) => {
        initEditor();
        expect($('.ProseMirror-menu-dropdown-menu').is(':visible')).to.be.false;
        focusMenuItem();
        expectFocus('type');
        pressEnter();
        navigate(DIR_DOWN, 'makeParagraph');
        navigate(DIR_DOWN, 'makeHeading1');
        navigate(DIR_DOWN, 'makeHeading2');
        navigate(DIR_DOWN, 'makeHeading3');
        navigate(DIR_DOWN, 'makeHeading4');
        // navigate(DIR_DOWN, 'makeHeading5');
        // navigate(DIR_DOWN, 'makeHeading6');
        navigate(DIR_DOWN, 'makeCodeBlock');
        pressEnter();
        expect(toHtml()).to.equal('<pre><code><br class="ProseMirror-trailingBreak"></code></pre>');
        done();
    });

    // No more sub menu
    /*it("test enter sub menu on ArrowRight", (done) => {
        initEditor();
        expect($('.ProseMirror-menu-dropdown-menu').is(':visible')).to.be.false;
        focusMenuItem();
        expectFocus('type');
        pressEnter();
        navigate(DIR_DOWN, 'makeParagraph');
        navigate(DIR_DOWN, 'makeCodeBlock');
        navigate(DIR_DOWN, 'makeHeading');
        navigate(DIR_RIGHT, 'makeHeading1');
        done();
    });

    it("test navigate sub menu on ArrowDown", (done) => {
        initEditor();
        expect($('.ProseMirror-menu-dropdown-menu').is(':visible')).to.be.false;
        focusMenuItem();
        expectFocus('type');
        pressEnter();
        navigate(DIR_DOWN, 'makeParagraph');
        navigate(DIR_DOWN, 'makeCodeBlock');
        navigate(DIR_DOWN, 'makeHeading');
        navigate(DIR_RIGHT, 'makeHeading1');
        navigate(DIR_DOWN, 'makeHeading2');
        navigate(DIR_DOWN, 'makeHeading3');
        navigate(DIR_DOWN, 'makeHeading4');
        navigate(DIR_DOWN, 'makeHeading5');
        navigate(DIR_DOWN, 'makeHeading6');
        navigate(DIR_DOWN, 'makeHeading1');
        done();
    });

    it("test navigate sub menu on ArrowUp", (done) => {
        initEditor();
        expect($('.ProseMirror-menu-dropdown-menu').is(':visible')).to.be.false;
        focusMenuItem();
        expectFocus('type');
        pressEnter();
        navigate(DIR_DOWN, 'makeParagraph');
        navigate(DIR_DOWN, 'makeCodeBlock');
        navigate(DIR_DOWN, 'makeHeading');
        navigate(DIR_RIGHT, 'makeHeading1');
        navigate(DIR_UP, 'makeHeading6');
        navigate(DIR_UP, 'makeHeading5');
        navigate(DIR_UP, 'makeHeading4');
        navigate(DIR_UP, 'makeHeading3');
        navigate(DIR_UP, 'makeHeading2');
        navigate(DIR_UP, 'makeHeading1');
        done();
    });

    it("test leave sub menu on ArrowLeft", (done) => {
        initEditor();
        expect($('.ProseMirror-menu-dropdown-menu').is(':visible')).to.be.false;
        focusMenuItem();
        expectFocus('type');
        pressEnter();
        navigate(DIR_DOWN, 'makeParagraph');
        navigate(DIR_DOWN, 'makeCodeBlock');
        navigate(DIR_DOWN, 'makeHeading');
        navigate(DIR_RIGHT, 'makeHeading1');
        navigate(DIR_LEFT, 'makeHeading');
        done();
    });

    it("test leave sub menu on Escape", (done) => {
        initEditor();
        expect($('.ProseMirror-menu-dropdown-menu').is(':visible')).to.be.false;
        focusMenuItem();
        expectFocus('type');
        pressEnter();
        navigate(DIR_DOWN, 'makeParagraph');
        navigate(DIR_DOWN, 'makeCodeBlock');
        navigate(DIR_DOWN, 'makeHeading');
        navigate(DIR_RIGHT, 'makeHeading1');
        pressEscape();
        expectFocus('makeHeading');
        done();
    });*/
});
