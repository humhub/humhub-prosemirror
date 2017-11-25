/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */
import {schema} from './schema'
import {codeBlockRule} from './input-rules'

const code_block = {
    id: 'code_block',
    schema: schema,
    inputRules: (schema) => {return [codeBlockRule(schema)]}
};

export default code_block;
