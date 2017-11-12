/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {MarkdownSerializer} from "prosemirror-markdown"

// :: MarkdownSerializer
// A serializer for the [basic schema](#schema).
let markdownSerializer = new MarkdownSerializer({
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
        let start = node.attrs.order || 1;
        let maxW = String(start + node.childCount - 1).length;
        let space = state.repeat(" ", maxW + 2);
        state.renderList(node, space, function (i) {
            let nStr = String(start + i);
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
        for (let i = index + 1; i < parent.childCount; i++)
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

export {markdownSerializer}