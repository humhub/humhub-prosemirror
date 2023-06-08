/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 */

const schema = {
    marks: {
        em: {
            parseDOM: [{tag: "i"}, {tag: "em"},
                {
                    style: "font-style", getAttrs: function (value) {
                        return value === "italic" && null;
                    }
                }],
            toDOM: () => {
                return ["em"]
            },
            parseMarkdown: {mark: "em"},
            toMarkdown: {open: "_", close: "_", mixable: true, expelEnclosingWhitespace: true}
        }
    }
};

export {schema};
