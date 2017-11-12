// Used as input to Rollup to generate the prosemirror js file

import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {Schema, DOMParser} from "prosemirror-model"
import {addListNodes} from "prosemirror-schema-list"
import {exampleSetup} from "./markdown/"
import {MarkdownParser, MarkdownSerializer, schema, defaultMarkdownParser, defaultMarkdownSerializer} from "prosemirror-markdown"
import markdownit from "markdown-it"
import imsize_plugin from "./markdown/markdownit.imsize.js"
import emoji_plugin from "markdown-it-emoji"


var nodes = schema.spec.nodes.remove('image');
nodes = nodes.addToEnd('image', {
    inline: true,
    attrs: {
        src: {},
        alt: {default: null},
        title: {default: null},
        width: {default: null},
        height: {default: null}
    },
    group: "inline",
    draggable: true,
    parseDOM: [{tag: "img[src]", getAttrs: function getAttrs(dom) {
        return {
            src: dom.getAttribute("src"),
            title: dom.getAttribute("title"),
            alt: dom.getAttribute("alt"),
            width: dom.getAttribute("width"),
            height: dom.getAttribute("height")
        }
    }}],
    toDOM: function toDOM(node) {return ["img", node.attrs]}
}).addToEnd('emoji', {
    attrs: {
        text: {},
        markup: {},
    },
    inline: true,
    group: "inline",
    toDOM: function toDOM(node) { return ['span', node.attrs.text ]}
});

// TODO: link => blank

var extendedMarkdownSchema = new Schema({
    nodes: nodes,
    marks: schema.spec.marks
});

var markdown = markdownit("commonmark", {html: false, breaks: true}).use(imsize_plugin).use(emoji_plugin);

var extendedMarkdownParser = new MarkdownParser(extendedMarkdownSchema, markdown, {
    blockquote: {block: "blockquote"},
    paragraph: {block: "paragraph"},
    list_item: {block: "list_item"},
    bullet_list: {block: "bullet_list"},
    ordered_list: {block: "ordered_list", getAttrs: function (tok) { return ({order: +tok.attrGet("order") || 1}); }},
    heading: {block: "heading", getAttrs: function (tok) { return ({level: +tok.tag.slice(1)}); }},
    code_block: {block: "code_block"},
    fence: {block: "code_block", getAttrs: function (tok) { return ({params: tok.info || ""}); }},
    hr: {node: "horizontal_rule"},
    emoji: {node: "emoji", getAttrs: function (tok) { return ({
        text: tok.content,
        markup: tok.markup
    }) }},
    image: {node: "image", getAttrs: function (tok) { return ({
        src: tok.attrGet("src"),
        title: tok.attrGet("title") || null,
        width: tok.attrGet("width") || null,
        height: tok.attrGet("height") || null,
        alt: tok.children[0] && tok.children[0].content || null
    }); }},
    hardbreak: {node: "hard_break"},

    em: {mark: "em"},
    strong: {mark: "strong"},
    link: {mark: "link", getAttrs: function (tok) { return ({
        href: tok.attrGet("href"),
        title: tok.attrGet("title") || null
    }); }},
    code_inline: {mark: "code"}
});

// :: MarkdownSerializer
// A serializer for the [basic schema](#schema).
var extendedMarkdownSerializer = new MarkdownSerializer({
    blockquote: function blockquote(state, node) {
        state.wrapBlock("> ", null, node, function () { return state.renderContent(node); });
    },
    code_block: function code_block(state, node) {
        if (!node.attrs.params) {
            state.wrapBlock("    ", null, node, function () { return state.text(node.textContent, false); });
        } else {
            state.write("```" + node.attrs.params + "\n");
            state.text(node.textContent, false);
            state.ensureNewLine();
            state.write("```");
            state.closeBlock(node);
        }
    },
    heading: function heading(state, node) {
        state.write(state.repeat("#", node.attrs.level) + " ");
        state.renderInline(node);
        state.closeBlock(node);
    },
    horizontal_rule: function horizontal_rule(state, node) {
        state.write(node.attrs.markup || "---");
        state.closeBlock(node);
    },
    bullet_list: function bullet_list(state, node) {
        state.renderList(node, "  ", function () { return (node.attrs.bullet || "*") + " "; });
    },
    ordered_list: function ordered_list(state, node) {
        var start = node.attrs.order || 1;
        var maxW = String(start + node.childCount - 1).length;
        var space = state.repeat(" ", maxW + 2);
        state.renderList(node, space, function (i) {
            var nStr = String(start + i);
            return state.repeat(" ", maxW - nStr.length) + nStr + ". "
        });
    },
    list_item: function list_item(state, node) {
        state.renderContent(node);
    },
    paragraph: function paragraph(state, node) {
        state.renderInline(node);
        state.closeBlock(node);
    },

    image: function image(state, node) {
        state.write("![" + state.esc(node.attrs.alt || "") + "](" + state.esc(node.attrs.src) +
            (node.attrs.title ? " " + state.quote(node.attrs.title) : "") +
            (node.attrs.width ? " ="+ state.esc(node.attrs.width)+'x'+state.esc(node.attrs.height) : "") + ")");
    },
    emoji: function heading(state, node) {
        state.write(':'+state.esc(node.attrs.markup)+':')
    },
    hard_break: function hard_break(state, node, parent, index) {
        for (var i = index + 1; i < parent.childCount; i++)
        { if (parent.child(i).type != node.type) {
            state.write("\\\n");
            return
        } }
    },
    text: function text(state, node) {
        state.text(node.text);
    }
}, {
    em: {open: "*", close: "*", mixable: true, expelEnclosingWhitespace: true},
    strong: {open: "**", close: "**", mixable: true, expelEnclosingWhitespace: true},
    link: {
        open: "[",
        close: function close(state, mark) {
            return "](" + state.esc(mark.attrs.href) + (mark.attrs.title ? " " + state.quote(mark.attrs.title) : "") + ")"
        }
    },
    code: {open: "`", close: "`"}
});


window.pm = {
    Schema: Schema,
    extendedMarkdownParser: extendedMarkdownParser,
    extendedMarkdownSerializer: extendedMarkdownSerializer,
    extendedMarkdownSchema: extendedMarkdownSchema,
    markdown: markdown,
    schema: schema,
    EditorView: EditorView,
    EditorState: EditorState,
    defaultMarkdownParser: defaultMarkdownParser,
    defaultMarkdownSerializer: defaultMarkdownSerializer,
    exampleSetup: exampleSetup
};