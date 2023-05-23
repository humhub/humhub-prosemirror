const md = require('markdown-it')();

function getDOMOutputSpecFromParsedHTML(htmlParsed) {
    const childNodes = htmlParsed.childNodes;

    if (!childNodes.length) {
        return htmlParsed.textContent;
    }

    let rDOMOutputSpec = [htmlParsed.localName]
    for (let i=0; i<childNodes.length; i++) {
        rDOMOutputSpec.push(getDOMOutputSpecFromParsedHTML(childNodes[i]));
    }

    return rDOMOutputSpec;
}

function getDOMOutputSpecFromMarkdown(markdown) {
    const htmlStr = md.render(markdown);
    const parser = new DOMParser();
    const nodeList = parser.parseFromString(htmlStr, 'text/html').body.childNodes;
    const htmlParsed = nodeList[0]; // remove trailing linebreak

    return getDOMOutputSpecFromParsedHTML(htmlParsed);
}

const schema = {
    nodes: {
        container_details : {
            sortOrder: 200,
            content: "block+",
            group: "block",
            attrs: {
                summary: { default: 'Details' },
                state: { default: 'open' },
                style: { default: 'default' }
            },
            selectable: true,
            draggable: true,
            defining: true,
            parseDOM: [{
                tag: "details"
            }],
            toDOM(node) {
                let summary = getDOMOutputSpecFromMarkdown(node.attrs.summary);
                let attributes = {open: ""};
                if (node.attrs.style !== "Default") {
                    attributes.class = node.attrs.style;
                }
                return ["details", attributes, ["summary", summary], ["div", 0]];
            },
            parseMarkdown: {
                block: "container_details", getAttrs: function(tok){
                    const m = tok.info.trim().match(/^details(\s(?<arguments>((style=\S*\s?)|(state=\S*\s?))*)+(summary=(?<summary>.*))?)?/);
                    const summary = m.groups["summary"];
                    const args = m.groups["arguments"];

                    const stateRgxMatch = args && args.match(/state=(open|closed)/);
                    const styleRgxMatch = args && args.match(/style=(default|box)/);

                    const state = stateRgxMatch ? stateRgxMatch[1] : "open";
                    const style = styleRgxMatch ? styleRgxMatch[1] : "default";

                    return({
                        summary: summary,
                        state: state,
                        style: style
                    });
                }
            },
            toMarkdown: (state, node, tok) => {
                let level = 0;
                node.descendants(function(node, pos, parent, index){
                    if(node.type.name === "container_details"){
                        level ++
                        return true
                    }
                    return false
                })
                state.write(`:::${state.repeat(":", level)} details `)
                state.write(`state=${node.attrs.state} `);
                state.write(`style=${node.attrs.style} `);
                state.write(`summary=${node.attrs.summary} `);
                state.write("\n\n");
                state.renderContent(node)
                state.write(`:::${state.repeat(":", level)}\n\n`)
                state.closeBlock(node);
            }
        },
    }
};

export {schema}