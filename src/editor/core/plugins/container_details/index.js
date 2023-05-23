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
    registerMarkdownIt: (md) => {
        md.use(container_plugin, 'details', {

            validate: function(params) {
                return params.trim().match(/^details(\s(?<arguments>((style=\S*\s?)|(state=\S*\s?))*)+(summary=(?<summary>.*))?)?/);
            },

            render: function (tokens, idx) {
                if (tokens[idx].nesting === 1) {
                    // opening tag
                    let m = tokens[idx].info.trim().match(/^details(\s(?<arguments>((style=\S*\s?)|(state=\S*\s?))*)+(summary=(?<summary>.*))?)?/);
                    const summary = m.groups["summary"];
                    const args = m.groups["arguments"];

                    const stateRgxMatch = args && args.match(/state=(open|closed)/);
                    const styleRgxMatch = args && args.match(/style=(default|box)/);

                    const state = stateRgxMatch ? stateRgxMatch[1] : "open";
                    const style = styleRgxMatch ? styleRgxMatch[1] : "default";

                    const summaryHtml = summary
                        ? md.render(md.utils.escapeHtml(summary))
                        : "Details";

                    const stateHtml = state === "open"
                        ? " open"
                        : "";

                    const styleHtml = style !== "default"
                        ? ` class="${style}"`
                        : "";

                    return `<details${styleHtml}${stateHtml}><summary>${summaryHtml}</summary><div>`;
                } else {
                    // closing tag
                    return '</div></details>';
                }
            }
        });
    }
};

export default container_details;
