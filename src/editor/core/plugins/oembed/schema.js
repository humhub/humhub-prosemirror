let HTML_ESCAPE_TEST_RE = /[&<>"]/;
let HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
let HTML_REPLACEMENTS = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
};

function replaceUnsafeChar(ch) {
    return HTML_REPLACEMENTS[ch];
}

function escapeHtml(str) {
    if (HTML_ESCAPE_TEST_RE.test(str)) {
        return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
    }
    return str;
}

const oembed = {
    attrs: {
        href: {},
    },
    marks: "",
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
    toDOM: (node) => {
        let $oembed = humhub.require('oembed').get(node.attrs.href);

        if ($oembed && $oembed.length) {
            return $oembed.clone().show()[0];
        } else {
            return $('<a href="' + escapeHtml(node.attrs.href) + '" class="not-found" style="color:#FF7F00" target="_blank" rel="noopener">' + escapeHtml(node.attrs.href) + '</a>')[0];
        }
    },
    parseMarkdown: {
        node: "oembed", getAttrs: function(tok) {
            return ({
                href: tok.attrGet("href")
            })
        }
    },
    toMarkdown: (state, node) => {
        state.write('['+node.attrs.href+'](oembed:'+node.attrs.href+')');
    }
};

const schema = {
    nodes: {
        oembed: oembed
    }
};

export {schema}