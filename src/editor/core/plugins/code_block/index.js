/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */
import {schema} from './schema'
import {codeBlockRule} from './input-rules'
import {menu} from "./menu"

const code_block = {
    id: 'code_block',
    schema: schema,
    menu: (context) => menu(context),
    inputRules: (schema) => {return [codeBlockRule(schema)]}
};

export default code_block;
