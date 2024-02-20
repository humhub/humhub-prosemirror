const SVG = "http://www.w3.org/2000/svg";
const XLINK = "http://www.w3.org/1999/xlink";

const prefix = "ProseMirror-icon";

const getIconSize = (name) => {
    const veryBigIcons = ['table', 'enlarge', 'shrink'];
    const biggerIcons = ['emoji'];
    const bigIcons = ['headline', 'join', 'image', 'undo', 'redo', 'markdown', 'angleDoubleRight', 'angleDoubleLeft'];
    const smallIcons = ['bulletList', 'orderedList', 'indent', 'outdent'];

    return smallIcons.includes(name)
        ? '18' : bigIcons.includes(name)
            ? '16' : biggerIcons.includes(name)
                ? '15' : veryBigIcons.includes(name) ? '14' : '17';
}

export function getIcon(icon, htmlNode) {
    htmlNode = htmlNode || 'div';
    let node = document.createElement(htmlNode);
    node.className = prefix;

    if (htmlNode === "button") {
        node.setAttribute("type", "button");
    }

    if (icon.path) {
        const name = "pm-icon-" + icon.name;
        if (!document.getElementById(name)) buildSVG(name, icon);
        const svg = node.appendChild(document.createElementNS(SVG, "svg"));
        const iconSize = getIconSize(icon.name);
        svg.setAttribute('height', iconSize /*icon.height*/);
        svg.setAttribute('width', iconSize /*icon.width*/);
        let use = svg.appendChild(document.createElementNS(SVG, "use"));
        use.setAttributeNS(XLINK, "href", /([^#]*)/.exec(document.location)[1] + "#" + name);
    } else if (icon.dom) {
        node.appendChild(icon.dom.cloneNode(true));
    } else {
        node.appendChild(document.createElement("span")).textContent = icon.text || '';
        if (icon.css) node.firstChild.style.cssText = icon.css;
    }
    return node;
}

function buildSVG(name, data) {
    let collection = document.getElementById(prefix + "-collection");
    if (!collection) {
        collection = document.createElementNS(SVG, "svg");
        collection.id = prefix + "-collection";
        collection.style.display = "none";
        document.body.insertBefore(collection, document.body.firstChild);
    }
    let sym = document.createElementNS(SVG, "symbol");
    sym.id = name;
    sym.setAttribute("viewBox", "0 0 " + data.width + " " + data.height);

    let pathData = Array.isArray(data.path) ? data.path : [data.path];

    pathData.forEach((path) => {
        let pathDom = sym.appendChild(document.createElementNS(SVG, "path"));
        pathDom.setAttribute("d", path);
        collection.appendChild(sym);
    });
}

// :: Object
// A set of basic editor-related icons. Contains the properties
// `join`, `lift`, `selectParentNode`, `undo`, `redo`, `strong`, `em`,
// `code`, `link`, `bulletList`, `orderedList`, and `blockquote`, each
// holding an object that can be used as the `icon` option to
// `MenuItem`.
export const icons = {
    headline: {
        name: 'headline',
        width: 27, height: 27,
        path: "M26.281 26c-1.375 0-2.766-0.109-4.156-0.109-1.375 0-2.75 0.109-4.125 0.109-0.531 0-0.781-0.578-0.781-1.031 0-1.391 1.563-0.797 2.375-1.328 0.516-0.328 0.516-1.641 0.516-2.188l-0.016-6.109c0-0.172 0-0.328-0.016-0.484-0.25-0.078-0.531-0.063-0.781-0.063h-10.547c-0.266 0-0.547-0.016-0.797 0.063-0.016 0.156-0.016 0.313-0.016 0.484l-0.016 5.797c0 0.594 0 2.219 0.578 2.562 0.812 0.5 2.656-0.203 2.656 1.203 0 0.469-0.219 1.094-0.766 1.094-1.453 0-2.906-0.109-4.344-0.109-1.328 0-2.656 0.109-3.984 0.109-0.516 0-0.75-0.594-0.75-1.031 0-1.359 1.437-0.797 2.203-1.328 0.5-0.344 0.516-1.687 0.516-2.234l-0.016-0.891v-12.703c0-0.75 0.109-3.156-0.594-3.578-0.781-0.484-2.453 0.266-2.453-1.141 0-0.453 0.203-1.094 0.75-1.094 1.437 0 2.891 0.109 4.328 0.109 1.313 0 2.641-0.109 3.953-0.109 0.562 0 0.781 0.625 0.781 1.094 0 1.344-1.547 0.688-2.312 1.172-0.547 0.328-0.547 1.937-0.547 2.5l0.016 5c0 0.172 0 0.328 0.016 0.5 0.203 0.047 0.406 0.047 0.609 0.047h10.922c0.187 0 0.391 0 0.594-0.047 0.016-0.172 0.016-0.328 0.016-0.5l0.016-5c0-0.578 0-2.172-0.547-2.5-0.781-0.469-2.344 0.156-2.344-1.172 0-0.469 0.219-1.094 0.781-1.094 1.375 0 2.75 0.109 4.125 0.109 1.344 0 2.688-0.109 4.031-0.109 0.562 0 0.781 0.625 0.781 1.094 0 1.359-1.609 0.672-2.391 1.156-0.531 0.344-0.547 1.953-0.547 2.516l0.016 14.734c0 0.516 0.031 1.875 0.531 2.188 0.797 0.5 2.484-0.141 2.484 1.219 0 0.453-0.203 1.094-0.75 1.094z"
    },
    plus: {
        name: 'plus',
        width: 16, height: 16,
        path: "M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
    },
    add: {
        name: 'add',
        width: 16, height: 16,
        path: [
            "M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z",
            "M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
        ]
    },
    join: {
        name: 'join',
        width: 800, height: 900,
        path: "M0 75h800v125h-800z M0 825h800v-125h-800z M250 400h100v-100h100v100h100v100h-100v100h-100v-100h-100z"
    },
    text: {
        name: 'text',
        width: 16, height: 16,
        path: 'm2.244 13.081.943-2.803H6.66l.944 2.803H8.86L5.54 3.75H4.322L1 13.081h1.244zm2.7-7.923L6.34 9.314H3.51l1.4-4.156h.034zm9.146 7.027h.035v.896h1.128V8.125c0-1.51-1.114-2.345-2.646-2.345-1.736 0-2.59.916-2.666 2.174h1.108c.068-.718.595-1.19 1.517-1.19.971 0 1.518.52 1.518 1.464v.731H12.19c-1.647.007-2.522.8-2.522 2.058 0 1.319.957 2.18 2.345 2.18 1.06 0 1.716-.43 2.078-1.011zm-1.763.035c-.752 0-1.456-.397-1.456-1.244 0-.65.424-1.115 1.408-1.115h1.805v.834c0 .896-.752 1.525-1.757 1.525z'
    },
    strong: {
        name: 'strong',
        width: 16, height: 16,
        path: "M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"
    },
    em: {
        name: 'em',
        width: 16, height: 16,
        path: "M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"
    },
    strikethrough: {
        name: 'strikethrough',
        width: 16, height: 16,
        path: "M6.333 5.686c0 .31.083.581.27.814H5.166a2.776 2.776 0 0 1-.099-.76c0-1.627 1.436-2.768 3.48-2.768 1.969 0 3.39 1.175 3.445 2.85h-1.23c-.11-1.08-.964-1.743-2.25-1.743-1.23 0-2.18.602-2.18 1.607zm2.194 7.478c-2.153 0-3.589-1.107-3.705-2.81h1.23c.144 1.06 1.129 1.703 2.544 1.703 1.34 0 2.31-.705 2.31-1.675 0-.827-.547-1.374-1.914-1.675L8.046 8.5H1v-1h14v1h-3.504c.468.437.675.994.675 1.697 0 1.826-1.436 2.967-3.644 2.967z"
    },
    code: {
        name: 'code',
        width: 16, height: 16,
        path: "M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8l3.147-3.146zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8l-3.147-3.146z"
    },
    link: {
        name: 'link',
        width: 16, height: 16,
        path: [
            "M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z",
            "M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"
        ]
    },
    bulletList: {
        name: 'bulletList',
        width: 16, height: 16,
        path: "M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
    },
    orderedList: {
        name: 'orderedList',
        width: 16, height: 16,
        path: [
            "M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z",
            "M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338v.041zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635V5z"
        ]
    },
    indent: {
        name: 'indent',
        width: 16, height: 16,
        path: "M2 3.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm.646 2.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L4.293 8 2.646 6.354a.5.5 0 0 1 0-.708zM7 6.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm-5 3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
    },
    outdent: {
        name: 'outdent',
        width: 16, height: 16,
        path: "M2 3.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm10.646 2.146a.5.5 0 0 1 .708.708L11.707 8l1.647 1.646a.5.5 0 0 1-.708.708l-2-2a.5.5 0 0 1 0-.708l2-2zM2 6.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
    },
    blockquote: {
        name: 'blockquote',
        width: 16, height: 16,
        path: "M12 12a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1h-1.388c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 9 7.558V11a1 1 0 0 0 1 1h2Zm-6 0a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1H4.612c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 3 7.558V11a1 1 0 0 0 1 1h2Z"
    },
    table: {
        name: 'table',
        width: 18, height: 18,
        path: "M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z"
    },
    emoji: {
        name: 'emoji',
        width: 18, height: 18,
        path: [
            "M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z",
            "M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z"
        ]
    },
    upload: {
        name: 'upload',
        width: 16, height: 16,
        path: [
            "M9.344 8.656h2l-3.344-3.313-3.344 3.313h2v2.688h2.688v-2.688zM12.906 6.688q1.281 0.094 2.188 1.047t0.906 2.266q0 1.375-0.984 2.359t-2.359 0.984h-8.656q-1.656 0-2.828-1.172t-1.172-2.828q0-1.469 1.047-2.641t2.516-1.328q0.656-1.219 1.844-1.969t2.594-0.75q1.688 0 3.141 1.188t1.766 2.844z"
        ]
    },
    undo: {
        name: 'undo',
        width: 16, height: 16,
        path: [
            "M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z",
            "M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"
        ]
    },
    redo: {
        name: 'redo',
        width: 16, height: 16,
        path: [
            "M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z",
            "M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"
        ]
    },
    enlarge: {
        name: 'enlarge',
        width: 16, height: 16,
        path: "M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707z"
    },
    shrink: {
        name: 'shrink',
        width: 16, height: 16,
        path: "M.172 15.828a.5.5 0 0 0 .707 0l4.096-4.096V14.5a.5.5 0 1 0 1 0v-3.975a.5.5 0 0 0-.5-.5H1.5a.5.5 0 0 0 0 1h2.768L.172 15.121a.5.5 0 0 0 0 .707zM15.828.172a.5.5 0 0 0-.707 0l-4.096 4.096V1.5a.5.5 0 1 0-1 0v3.975a.5.5 0 0 0 .5.5H14.5a.5.5 0 0 0 0-1h-2.768L15.828.879a.5.5 0 0 0 0-.707z"
    },
    angleDoubleRight: {
        name: 'angleDoubleRight',
        width: 16, height: 16,
        path: [
            "M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z",
            "M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"
        ]
    },
    angleDoubleLeft: {
        name: 'angleDoubleLeft',
        width: 16, height: 16,
        path: [
            "M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z",
            "M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
        ]
    },
    markdown: {
        name: 'markdown',
        width: 16, height: 16,
        path: [
            "M14 3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12zM2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2z",
            "M9.146 8.146a.5.5 0 0 1 .708 0L11.5 9.793l1.646-1.647a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 0-.708z",
            "M11.5 5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 1 .5-.5z",
            "M3.56 11V7.01h.056l1.428 3.239h.774l1.42-3.24h.056V11h1.073V5.001h-1.2l-1.71 3.894h-.039l-1.71-3.894H2.5V11h1.06z"
        ]
    },
    horizontalRule: {
        name: 'horizontalRule',
        width: 16, height: 16,
        path: [
            "M0 6.5v3c0 0.276 0.224 0.5 0.5 0.5h15c0.276 0 0.5-0.224 0.5-0.5v-3c0-0.276-0.224-0.5-0.5-0.5h-15c-0.276 0-0.5 0.224-0.5 0.5z"
        ]
    },
    selectParentNode: {name: 'selectParentNode',text: "\u2b1a", css: "font-weight: bold"}
};
