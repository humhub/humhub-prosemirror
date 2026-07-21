const expect = require('chai').expect;
const {initEditor, toHtml, serialize, setSelection, clickMenuItem, type} = require('../../testEditor');

describe("Plugin:em", () => {
    it("test init emphasized text", (done) => {
        initEditor('_This is emphasized_');
        expect(toHtml()).to.equal('<p><em>This is emphasized</em></p>');
        expect(serialize()).to.equal('*This is emphasized*');
        done();
    });

    it("test init emphasized text with asterisk", (done) => {
        initEditor('*This is emphasized*');
        expect(toHtml()).to.equal('<p><em>This is emphasized</em></p>');
        expect(serialize()).to.equal('*This is emphasized*');
        done();
    });

    it("test init emphasized text inside a word", (done) => {
        initEditor('This is em_phas_ized');
        expect(toHtml()).to.equal('<p>This is em_phas_ized</p>');
        expect(serialize()).to.equal('This is em_phas_ized');
        done();
    });

    it("test init emphasized text with asterisk inside a word", (done) => {
        initEditor('This is em*phas*ized');
        expect(toHtml()).to.equal('<p>This is em<em>phas</em>ized</p>');
        expect(serialize()).to.equal('This is em*phas*ized');
        done();
    });

    // TODO: Implement em input rule
    /*
        it("test emphasized input rule", (done) => {
            initEditor();
            expect(simulateInputRule('*Make me emphasized!*')).to.be.true;
            expect(toHtml()).to.equal('<p><strong>Make me bold!</strong></p>');
            expect(serialize()).to.equal('*Make me emphasized!*');
            done();
        });
    */

    it("test emphasized menu item mark selection", (done) => {
        let editor = initEditor('Make this emphasized!');
        setSelection(5,10);
        clickMenuItem('markEm');
        expect(toHtml()).to.equal('<p>Make <em>this</em> emphasized!</p>');
        done();
    });

   it("test emphasized menu item mark type", (done) => {
       let editor = initEditor();
       clickMenuItem('markEm');
       type('Test', editor);
       expect(toHtml()).to.equal('<p><em>Test</em></p>');
       done();
   });
});
