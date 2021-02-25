/* jshint -W024 */
/* jshint expr:true */

const expect = require('chai').expect;
const {initView, viewToHtml, setViewText, serialize} = require('../testEditor');

describe("MarkdownView:render", () => {

    before(() => {
        $('#result').html('');
    })

    it("test initializing the view by parameter", (done) => {
        let view = initView('**This is my view**');
        expect(viewToHtml()).to.equal('<p><strong>This is my view</strong></p>');
        done();
    });

    it("test initializing the view by text", (done) => {
        setViewText('**This is my view**');
        initView();
        expect(viewToHtml()).to.equal('<p><strong>This is my view</strong></p>');
        done();
    });

    it("test initializing the view by encoded text", (done) => {
        setViewText('This is my view with <b>Html</b>');
        initView();
        expect(viewToHtml()).to.equal('<p>This is my view with &lt;b&gt;Html&lt;/b&gt;</p>');
        done();
    });

    it("test initializing the view with new line", (done) => {
        setViewText('This is my view with <br>new line');
        initView();
        expect(viewToHtml()).to.equal('<p>This is my view with <br>new line</p>');
        done();
    });

    it("test initialize view with simple xss", (done) => {
        setViewText('This is my view with <script>alert()</script>');
        initView();
        expect(viewToHtml()).to.equal('<p>This is my view with &lt;script&gt;alert()&lt;/script&gt;</p>');
        done();
    });

    it("test transformToEditor and back", (done) => {
        let view = initView('**This is my view**');
        let editor = view.transformToEditor();
        expect(serialize(editor)).to.equal('**This is my view**');
        view = editor.transformToView();
        expect(viewToHtml(view)).to.equal('<p><strong>This is my view</strong></p>');
        done();
    });

});