/* jshint -W024 */
/* jshint expr:true */

const expect = require('chai').expect;
const {initEditor,clickMenuItem, expectMenuItemNotVisible, expectMenuItemVisible} = require('../testEditor');

describe("Menu:configuration", () => {

    it("test exclude menu item by global config", (done) => {
        window.prosemirror.globalOptions = {
            menu: {
                'exclude': ['insertTable']
            }
        }

        initEditor({exclude: ['resizeNav']});
        expectMenuItemNotVisible('insertTable');
        window.prosemirror.globalOptions = {};
        done();
    });

    it("test exclude dropdown item by global config", (done) => {
        window.prosemirror.globalOptions = {
            menu: {
                'exclude': ['makeHeading1']
            }
        }

        initEditor({exclude: ['resizeNav']});
        clickMenuItem('type ');
        expect($('.ProseMirror-menu-makeHeading1').length).to.equal(0)
        window.prosemirror.globalOptions = {};
        done();
    });

    it("test exclude menu-group item by global config", (done) => {
        window.prosemirror.globalOptions = {
            menu: {
                'exclude': ['marks-group']
            }
        }

        initEditor({exclude: ['resizeNav']});
        expectMenuItemNotVisible('marks-group');
        window.prosemirror.globalOptions = {};
        done();
    });

    it("test exclude menu item by preset config", (done) => {
        window.prosemirror.globalOptions = {
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
        window.prosemirror.globalOptions = {};
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