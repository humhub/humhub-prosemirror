/* jshint -W024 */
/* jshint expr:true */

const expect = require('chai').expect;
const {initEditor} = require('../testEditor');

describe("Core:translate", () => {

    it("test translate without option", (done) => {
        let editor = initEditor();
        expect(editor.context.translate('Test me!')).to.equal('Test me!');
        done();
    });

    it("test translate with instance option and map", (done) => {
        let editor = initEditor({
            translate: {
                'Test me!': 'Teste mich!'
            }
        });
        expect(editor.context.translate('Test me!')).to.equal('Teste mich!');
        expect(editor.context.translate('Not translated...')).to.equal('Not translated...');
        done();
    });

    it("test translate with global option and callback", (done) => {
        window.humhub.richtext.globalOptions = { translate: (key) => { return { 'Test me!': 'Teste mich!'}[key]}};
        let editor = initEditor();
        expect(editor.context.translate('Test me!')).to.equal('Teste mich!');
        expect(editor.context.translate('Not translated...')).to.equal('Not translated...');
        done();
    });
});