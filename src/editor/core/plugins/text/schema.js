/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */
const schema = {
    nodes: {
        text: {
            sortOrder: 900,
            group: "inline",
            toDOM: function toDOM(node) {
                return node.text
            },
            toMarkdown: (state, node) => {
                state.text(node.text);
            }
        }
    }
};

export {schema}
