/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */
import {schema} from './schema'
import {mentionRule} from './input-rules'
import {mentionPlugin} from './plugin'

const mention = {
    id: 'mention',
    schema: schema,
    plugins: (options = {}) => {
        if(!options.mention || !options.mention.provider) {
            return [];
        }
        return [
            mentionPlugin(options)
        ]
    },
    inputRules: (schema) => {return [mentionRule(schema)]}
};

export default mention;
