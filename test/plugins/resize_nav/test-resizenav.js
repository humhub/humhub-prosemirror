/* jshint -W024 */
/* jshint expr:true */

const {initEditor, clickMenuItem, expectMenuItemNotVisible, expectMenuItemVisible} = require('../../testEditor');

describe("Plugin:resize_nav", () => {

    function testVisibleInMinimzedNav(name, selector) {
        it(`${name} visible in minimized nav`, function() {
            initEditor();
            expectMenuItemVisible(selector);
        });
    }

    function testNotVisibleInMinimizedNav(name, selector) {
        it(`${name} not visible in minimized nav`, function() {
            initEditor();
            expectMenuItemNotVisible(selector);
        });
    }

    function testVisibleInExpandedNav(name, selector) {
        it(`${name} visible in expanded nav`, function() {
            initEditor();
            clickMenuItem('resizeNav');
            expectMenuItemVisible(selector);
        });
    }

    function testVisibleInCollapsedNav(name, selector) {
        it(`${name} visible in expanded nav`, function() {
            initEditor();
            clickMenuItem('resizeNav');
            clickMenuItem('resizeNav');
            expectMenuItemVisible(selector);
        });
    }

    function testNotVisibleInCollapsedNav(name, selector) {
        it(`${name} visible in expanded nav`, function() {
            initEditor();
            clickMenuItem('resizeNav');
            clickMenuItem('resizeNav');
            expectMenuItemNotVisible(selector);
        });
    }

    let invisibleOnInit = [
        ['helper-group', '.ProseMirror-menu-helper-group'],
        ['format-group', '.ProseMirror-menu-format-group'],
        ['fullscreen', '.ProseMirror-menu-fullScreen'],
        ['insertTable', '.ProseMirror-menu-insertTable'],
    ];

    let visibleOnInit = [
        ['emoji', '.ProseMirror-menu-insertEmoji'],
        ['intert dropdown', '.ProseMirror-menu-insert-dropdown'],
        ['marks-group', '.ProseMirror-menu-marks-group'],
        ['text types', '.ProseMirror-menu-type'],
        ['source', '.ProseMirror-menu-source-group'],
        ['resize nav ', '.ProseMirror-menu-resizeNav'],
    ]

    invisibleOnInit.forEach((item) => testNotVisibleInMinimizedNav(item[0], item[1]));
    visibleOnInit.forEach((item) => testVisibleInMinimzedNav(item[0], item[1]));
    invisibleOnInit.concat(visibleOnInit).forEach((item) => testVisibleInExpandedNav(item[0], item[1]));

    invisibleOnInit.forEach((item) => testNotVisibleInCollapsedNav(item[0], item[1]));
    visibleOnInit.forEach((item) => testVisibleInCollapsedNav(item[0], item[1]));
});