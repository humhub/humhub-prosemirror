/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */
import {schema} from './schema'
import {linkPlugin} from './plugin'
import {menu} from './menu'

const link = {
    id: 'link',
    schema: schema,
    menu: (options) => menu(options),
    plugins: (options) => {
        return [linkPlugin];
    }
};

export default link;
