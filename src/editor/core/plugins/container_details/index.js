/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */
import {schema} from './schema'
import {menu} from "./menu"
import container_plugin from "markdown-it-container"

const container_details = {
    id: 'container_details',
    schema: schema,
    menu: (context) => menu(context),
    registerMarkdownIt: (markdownIt) => {
        markdownIt.use(container_plugin, 'details', {

            validate: function(params) {
                return params.trim().match(/^details\s+(.*)$/);
            },

            render: function (tokens, idx) {
                var m = tokens[idx].info.trim().match(/^details\s+(.*)$/);
                if (tokens[idx].nesting === 1) {
                    // opening tag
                    return '<details><summary>' + markdownIt.utils.escapeHtml(m[1]) + '</summary>\n<div>';
                } else {
                    // closing tag
                    return '</div></details>\n';
                }
            }
        });
    }
};

export default container_details;
