/* jshint -W024 */
/* jshint expr:true */

const expect = require('chai').expect;
const {initEditor, expectMenuItemVisible, expectMenuItemNotVisible, clickMenuItem, toHtml} = require('../testEditor');

describe("Core:presets", () => {

    function expectContextContainsPlugin(view, id) {
        expect(view.context.getPlugin(id)).not.to.be.undefined;
    }

    function expectContextNotContainsPlugin(view, id) {
        expect(view.context.getPlugin(id)).to.be.undefined;
    }

    function testEditorPresetDoesIncludePlugin(preset, id) {
        it(`${preset} editor preset includes ${id}`, function(done) {
            let editor = initEditor({preset:preset});
            expectContextContainsPlugin(editor, id);
            done();
        });
    }

    function testEditorPresetDoesNotIncludePlugin(preset, id) {
        it(`${preset} editor preset does not include ${id}`, function(done) {
            let editor = initEditor({preset:preset});
            expectContextNotContainsPlugin(editor, id);
            done();
        });
    }

    function testViewPresetDoesNotIncludePlugin(preset, id) {
        it(`${preset} view preset does not include ${id}`, function(done) {
            let editor = initEditor({preset:preset});
            expectContextNotContainsPlugin(editor.transformToView(), id);
            done();
        });
    }

    function testViewPresetDoesIncludePlugin(preset, id) {
        it(`${preset} view preset includes ${id}`, function(done) {
            let editor = initEditor({preset:preset});
            expectContextContainsPlugin(editor.transformToView(), id);
            done();
        });
    }



    ['emoji', 'oembed', 'anchor', 'mention'].forEach(id => testEditorPresetDoesNotIncludePlugin('markdown', id));

    testEditorPresetDoesNotIncludePlugin('normal', 'anchor');
    testEditorPresetDoesNotIncludePlugin('full', 'anchor');

    // Note anchor is a render only plugin
    testEditorPresetDoesNotIncludePlugin('document', 'anchor');
    testViewPresetDoesIncludePlugin('document', 'anchor');

    ['emoji', 'oembed', 'mention'].forEach(id => testEditorPresetDoesIncludePlugin('normal', id));
    ['emoji', 'oembed', 'mention'].forEach(id => testEditorPresetDoesIncludePlugin('full', id));
    ['emoji', 'oembed', 'mention'].forEach(id => testEditorPresetDoesIncludePlugin('document', id));


    it("test exclude plugin from editor instance", (done) => {
        let editor = initEditor({exclude: ['emoji']});
        expectContextNotContainsPlugin(editor, 'emoji');
        expectMenuItemNotVisible('insertEmoji');
        done();
    });

    it("test include plugin in editor instance", (done) => {
        debugger;
        let editor = initEditor({preset: 'markdown', include: 'emoji'});
        expectContextContainsPlugin(editor, 'emoji');
        expectMenuItemVisible('insertEmoji');
        done();
    });

    it("test only plugin filter in editor instance", (done) => {
        initEditor({only: ['doc', 'text', 'paragraph', 'strong']});
        expectMenuItemVisible('markStrong');
        expectMenuItemNotVisible('markEm');

        /**
         *
         * The following would fail due to markdown-it requiring base markdown plugins
         */
        //let view = editor.transformToView();
        //expect(viewToHtml(view)).equal('<p><strong>Bold Text</strong> _ignored em text_</p>');

        done();
    });

    it("test extending a preset", (done) => {
        window.humhub.richtext.plugin.registerPlugin({
            id: 'test',
            menu: (context) => [
                {
                    id: 'testItem',
                    group: 'format',
                    item: new window.humhub.richtext.menu.MenuItem({
                        run: (state, dispatch) => dispatch(state.tr.insertText("test!")),
                        label: 'test'
                    })
                }
            ]
        }, 'markdown');

        let editor = initEditor({preset:'markdown'});
        expectContextContainsPlugin(editor, 'test');
        expectMenuItemVisible('testItem');
        clickMenuItem('testItem');
        expect(toHtml()).to.equal('<p>test!</p>');
        done();
    });
});