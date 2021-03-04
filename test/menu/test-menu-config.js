/* jshint -W024 */
/* jshint expr:true */

const expect = require('chai').expect;
const {initEditor,clickMenuItem, expectMenuItemNotVisible, expectMenuItemVisible} = require('../testEditor');

describe("Menu:configuration", () => {

    it("test exclude menu item by global config", (done) => {
        window.humhubRichtext.globalOptions = {
            menu: {
                'exclude': ['insertTable']
            }
        }

        initEditor({exclude: ['resizeNav']});
        expectMenuItemNotVisible('insertTable');
        window.humhubRichtext.globalOptions = {};
        done();
    });

    it("test exclude dropdown item by global config", (done) => {
        window.humhubRichtext.globalOptions = {
            menu: {
                'exclude': ['makeHeading1']
            }
        }

        initEditor({exclude: ['resizeNav']});
        clickMenuItem('type ');
        expect($('.ProseMirror-menu-makeHeading1').length).to.equal(0)
        window.humhubRichtext.globalOptions = {};
        done();
    });

    it("test exclude menu-group item by global config", (done) => {
        window.humhubRichtext.globalOptions = {
            menu: {
                'exclude': ['marks-group']
            }
        }

        initEditor({exclude: ['resizeNav']});
        expectMenuItemNotVisible('marks-group');
        window.humhubRichtext.globalOptions = {};
        done();
    });

    it("test exclude menu item by preset config", (done) => {
        window.humhubRichtext.globalOptions = {
            presets : {
                markdown: {
                    menu: {
                        'exclude': ['insertTable']
                    }
                }
            }
        }

        initEditor({preset: 'markdown', exclude: ['resizeNav']});
        expectMenuItemNotVisible('insertTable');

        initEditor({preset: 'full', exclude: ['resizeNav']});
        expectMenuItemVisible('insertTable');
        window.humhubRichtext.globalOptions = {};
        done();
    });

    it("test exclude menu item by instance", (done) => {
        initEditor({
            exclude: ['resizeNav'],
            menu: {
                'exclude': ['insertTable']
            }});
        expectMenuItemNotVisible('insertTable');
        done();
    });
});