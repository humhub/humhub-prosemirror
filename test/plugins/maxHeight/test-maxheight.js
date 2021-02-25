const expect = require('chai').expect;
const {initEditor, toHtml, serialize, simulateInputRule, setSelection, clickMenuItem, type} = require('../../testEditor');

describe("Plugin:maxHeight", () => {
    it("test maxHeight trigger", (done) => {
        editor = initEditor({maxHeight:400});
        editor.on('scrollActive', () => {console.log('active')});
        editor.on('scrollInactive', () => {console.log('inactive')});
        done();
    });
});