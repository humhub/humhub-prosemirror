/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */
import {schema} from './schema'
import {orderedListRule} from './input-rules'

const ordered_list = {
    id: 'ordered_list',
    schema: schema,
    inputRules: (schema) => {
        orderedListRule(schema)
    }
};

export default ordered_list;
