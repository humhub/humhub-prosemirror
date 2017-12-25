const SVG = "http://www.w3.org/2000/svg"
const XLINK = "http://www.w3.org/1999/xlink"

const prefix = "ProseMirror-icon"

function hashPath(path) {
    if (Array.isArray(path)) {
        let paths = path;
        path = '';
        paths.forEach((pathItem) => {
            path += pathItem;
        });
    }

    let hash = 0;
    for (let i = 0; i < path.length; i++)
        hash = (((hash << 5) - hash) + path.charCodeAt(i)) | 0
    return hash
}

export function getIcon(icon) {
    let node = document.createElement("div")
    node.className = prefix
    if (icon.path) {
        let name = "pm-icon-" + hashPath(icon.path).toString(16)
        if (!document.getElementById(name)) buildSVG(name, icon)
        let svg = node.appendChild(document.createElementNS(SVG, "svg"))
        svg.style.width = (icon.width / icon.height) + "em"
        let use = svg.appendChild(document.createElementNS(SVG, "use"))
        use.setAttributeNS(XLINK, "href", /([^#]*)/.exec(document.location)[1] + "#" + name)
    } else if (icon.dom) {
        node.appendChild(icon.dom.cloneNode(true))
    } else {
        node.appendChild(document.createElement("span")).textContent = icon.text || ''
        if (icon.css) node.firstChild.style.cssText = icon.css
    }
    return node
}

function buildSVG(name, data) {
    let collection = document.getElementById(prefix + "-collection")
    if (!collection) {
        collection = document.createElementNS(SVG, "svg")
        collection.id = prefix + "-collection"
        collection.style.display = "none"
        document.body.insertBefore(collection, document.body.firstChild)
    }
    let sym = document.createElementNS(SVG, "symbol")
    sym.id = name
    sym.setAttribute("viewBox", "0 0 " + data.width + " " + data.height)

    let pathData = Array.isArray(data.path) ? data.path : [data.path];

    pathData.forEach((path) => {
        let pathDom = sym.appendChild(document.createElementNS(SVG, "path"))
        pathDom.setAttribute("d", path)
        collection.appendChild(sym)
    });

}
