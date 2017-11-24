const oembed = {
    attrs: {
        href: {},
        dom: {default: null},
        txt: {default: 'test'}
    },
    atom: true,
    draggable: true,
    inline: true,
    group: "inline",
    parseDOM: [{
        tag: "[data-oembed]", getAttrs: function getAttrs(dom) {

            return {
                href: dom.getAttribute("data-oembed")
            };
        }
    }],
    toDOM: function toDOM(node) {
        console.log('asdf');
        //todo: call humhub.oembed.get(url)
        let $oembed = $('[data-oembed="' + node.attrs.href + '"]');

        if ($oembed.length) {
            return $oembed.clone().show()[0];
        } else {
            return $('<a href="' + escapeHtml(node.attrs.href) + '" target="_blank" rel="noopener">' + escapeHtml(node.attrs.href) + '</a>')[0];
        }
    }
};

const oembedSchema = {
    nodes: {
        oembed: oembed
    },
    marks: {}
};

export {oembedSchema}