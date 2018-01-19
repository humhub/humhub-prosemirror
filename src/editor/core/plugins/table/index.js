/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */
import {schema} from './schema'
import table_plugin from './markdownit_table'
import {menu} from "./menu"

const table = {
    id: 'table',
    schema: schema,
    menu: (context) => menu(context),
    registerMarkdownIt: (markdownIt) => {
        markdownIt.block.ruler.at('table', table_plugin);
    }
};

export default table;
