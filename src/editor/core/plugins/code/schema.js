/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

const schema = {
    marks: {
        code:{
            sortOrder: 400,
            parseDOM: [{tag: "code"}],
            toDOM: () => {
                return ["code"]
            },
            parseMarkdown:  {code_inline: {mark: "code"}},
            toMarkdown: {open: "`", close: "`"}
        }
    }
};

export {schema}