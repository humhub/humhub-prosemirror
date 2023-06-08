/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 */

import {schema} from './schema';
import {menu} from "./menu";

const strikethrough = {
    id: 'strikethrough',
    schema: schema,
    menu: (context) => menu(context)
};

export default strikethrough;
