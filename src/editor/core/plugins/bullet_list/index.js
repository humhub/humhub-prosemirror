/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */
import {schema} from './schema'
import {bulletListRule} from './input-rules'

const bullet_list = {
    id: 'bullet_list',
    schema: schema,
    inputRules: (schema) => {return [bulletListRule(schema)]}
};

export default bullet_list;
