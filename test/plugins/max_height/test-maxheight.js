/* jshint -W024 */
/* jshint expr:true */

const expect = require('chai').expect;
const {initEditor, pressKeyEnter, pressKeyBackspace} = require('../../testEditor');

describe("Plugin:max_height", () => {
    it("test maxHeight trigger", (done) => {
        let scroll = {active: false};
        initEditor({
            maxHeight: 200,
            onScrollActive: () => scroll.active = true,
            onScrollInactive: () => scroll.active = false,
        });

        pressKeyEnter();
        expect(scroll.active).to.be.false;
        pressKeyEnter();
        expect(scroll.active).to.be.false;
        pressKeyEnter();
        expect(scroll.active).to.be.false;
        pressKeyEnter();
        expect(scroll.active).to.be.false;
        pressKeyEnter();
        expect(scroll.active).to.be.true;
        pressKeyBackspace();
        expect(scroll.active).to.be.false;
        done();
    });

    it("test init with maxHeight overflow", (done) => {
        let scroll = {active: false};
        initEditor({
            maxHeight:100,
            onScrollActive: () => scroll.active = true,
            onScrollInactive: () => scroll.active = false,
        }, 'Test\n\nTest\n\nTest\n\nTest\n\n');

        expect(scroll.active).to.be.true;
        done();
    });
});
