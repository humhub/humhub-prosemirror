export function validateHref(href, anchor) {
    return /^https?:\/\//i.test(href) //http:/https:
        || /^mailto:/i.test(href) //mailto:
        || /^ftps?:\/\//i.test(href) //ftp:/ftps:
        || (anchor && validateAnchor(href)); //anchor
}

export function validateAnchor(href) {
    return /^#((?:[!$&()*+,;=._~:@?-]|%[0-9a-fA-F]{2}|[a-zA-Z0-9])+)$/i.test(href);
}