/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */
import {schema} from './schema'
import {menu} from './menu'
import {horizontalRuleRule} from './input-rules'
import {keymap} from './keymap'

const horizontal_rule = {
    id: 'horizontal_rule',
    schema: schema,
    inputRules: () => [horizontalRuleRule()],
    keymap: () => keymap(),
    // menu: (context) => menu(context)
};

export default horizontal_rule;
