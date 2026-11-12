/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {menu} from './menu'
import {fileSyncPlugin} from './plugin'

const upload = {
    id: 'upload',
    plugins: (context) => [fileSyncPlugin(context)],
    menu:  (context) => menu(context)
};

export default upload;
