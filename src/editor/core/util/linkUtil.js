export function validateHref(href) {
    return /^https?:\/\//i.test(href) || /^mailto:/i.test(href) || /^ftps?:\/\//i.test(href);
}