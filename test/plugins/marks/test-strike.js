const expect = require('chai').expect;
const {initEditor, toHtml, serialize, simulateInputRule, setSelection, clickMenuItem, type} = require('../../testEditor');

describe("Plugin:strike", () => {
    it("test init striked text", (done) => {
        initEditor('~~This is striked~~');
        expect(toHtml()).to.equal('<p><s>This is striked</s></p>');
        expect(serialize()).to.equal('~~This is striked~~');
        done();
    });

    // TODO: Implment strike input rule
    /*
        it("test emphasized input rule", (done) => {
            initEditor();
            expect(simulateInputRule('*Make me emphasized!*')).to.be.true;
            expect(toHtml()).to.equal('<p><strong>Make me bold!</strong></p>');
            expect(serialize()).to.equal('*Make me emphasized!*');
            done();
        });
        */

    it("test striked menu item mark selection", (done) => {
        let editor = initEditor('Make this striked!');
        setSelection(5,10);
        clickMenuItem('markStrikethrough');
        expect(toHtml()).to.equal('<p>Make <s>this</s> striked!</p>');
        done();
    });


   it("test striked menu item mark type", (done) => {
       let editor = initEditor();
       clickMenuItem('markStrikethrough');
       type('Test', editor);
       expect(toHtml()).to.equal('<p><s>Test</s></p>');
       done();
   });

});