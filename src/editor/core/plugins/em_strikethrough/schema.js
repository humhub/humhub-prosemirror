/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 */

const schema = {
    marks: {
        em_strikethrough: {
            parseDOM: [{tag: "s[data-emphasis]"}],
            toDOM: () => {
                return ["s", {"data-emphasis": true, style: "font-style: italic"}];
            },
            parseMarkdown: {mark: "em_strikethrough"},
            toMarkdown: {open: "_~~", close: "~~_", mixable: true, expelEnclosingWhitespace: true}
        }
    }
};

export {schema};
