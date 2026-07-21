/* jshint -W024 */
/* jshint expr:true */

const expect = require('chai').expect;
const {initEditor, serialize, toHtml, clickMenuItem} = require('../../testEditor');

describe("Plugin:audio", () => {
    it("test parse and serialize audio media flags", (done) => {
        initEditor('![My audio](file-guid:abcd-1234 {audio controls autoplay muted loop})');

        expect(serialize()).to.equal('![My audio](file-guid:abcd-1234 audio controls autoplay muted loop)');
        done();
    });

    it("test render audio HTML from markdown media flags", (done) => {
        initEditor('![My audio><](https://example.com/audio.mp3 {audio controls muted})');

        const html = toHtml();
        expect(html).to.contain('<audio');
        expect(html).to.contain('src="https://example.com/audio.mp3"');
        expect(html).to.contain('title="My audio"');
        expect(html).to.contain('controls');
        expect(html).to.contain('muted');
        expect(html).to.not.contain('float=');
        done();
    });

    it("test parse audio media flags without braces", (done) => {
        initEditor('![My audio](file-guid:abcd-1234 audio controls muted loop)');

        expect(serialize()).to.equal('![My audio](file-guid:abcd-1234 audio controls muted loop)');
        done();
    });

    it("test keep audio media flags on source mode switch", (done) => {
        initEditor('![My audio><](file-guid:abcd-1234 audio controls autoplay muted loop)');

        clickMenuItem('source');
        clickMenuItem('source');

        expect(serialize()).to.equal('![My audio><](file-guid:abcd-1234 audio controls autoplay muted loop)');
        done();
    });
});
