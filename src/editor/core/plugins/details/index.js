/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */
import {schema} from './schema'
import {menu} from "./menu"

const details = {
    id: 'details',
    // schema: schema,
    // menu: (context) => menu(context),
    renderOnly: true,
    registerMarkdownIt: (markdownIt) => {
        markdownIt.use(require('markdown-it-container'), 'spoiler', {

            validate: function(params) {
                return params.trim().match(/^spoiler\s+(.*)$/);
            },

            render: function (tokens, idx) {
                var m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/);

                if (tokens[idx].nesting === 1) {
                    // opening tag
                    return '<details><summary>' + markdownIt.utils.escapeHtml(m[1]) + '</summary>\n';

                } else {
                    // closing tag
                    return '</details>\n';
                }
            }
        });
    }
};

export default details;
