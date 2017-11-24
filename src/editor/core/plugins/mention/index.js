/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */
import {schema} from './schema'
import {mentionRule} from './input-rules'
import {plugin} from './plugin'

const mention = {
    id: 'mention',
    schema: schema,
    plugins: [plugin],
    inputRule: (schema) => {
        mentionRule(schema)
    }
};

export default mention;
