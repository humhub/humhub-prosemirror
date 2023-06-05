/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 */

// import {schema} from "prosemirror-schema-basic";
// import {Schema} from "prosemirror-model";

const code_block =  {
    sortOrder: 500,
    content: "text*",
    group: "block",
    code: true,
    defining: true,
    marks: "",
    attrs: {params: {default: ""}},
    parseDOM: [{
        tag: "pre",
        preserveWhitespace: true, getAttrs: function (node) {
            return ({params: node.getAttribute("data-params") || ""});
        }
    }],
    toDOM: (node) => {
        return ["pre", node.attrs.params ? {"data-params": node.attrs.params} : {}, ["code", 0]];
    },
    parseMarkdown: {block: "code_block"},
    toMarkdown: (state, node) => {
        if (state.table) {
            state.wrapBlock("`", "`", node, function () { return state.text(node.textContent, false); });
        } else if (!node.attrs.params) {
            state.write("```\n");
            state.text(node.textContent, false);
            state.ensureNewLine();
            state.write("```");
            state.closeBlock(node);
        } else {
            state.write("```" + node.attrs.params + "\n");
            state.text(node.textContent, false);
            state.ensureNewLine();
            state.write("```");
            state.closeBlock(node);
        }
    }
};

const fence = {
    parseMarkdown:  {
        block: "code_block",
        getAttrs: (tok) => ({params: tok.info || ""})
    }
};

// const codeBlockSpec = schema.spec.nodes.get("code_block");

// export default new Schema({
//     nodes: schema.spec.nodes.update("code_block", {
//         ...(codeBlockSpec || {}),
//         attrs: { ...(codeBlockSpec.attrs || null), lang: { default: null } },
//     }),
//     marks: schema.spec.marks,
// });

const schema = {
    nodes: {
        code_block: code_block,
        fence: fence
    }
};

export {schema}
