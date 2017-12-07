/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */
import {attributesPlugin} from './plugin'

const attributes = {
    id: 'attributes',
    plugins: (options = {}) => {
        return [
            attributesPlugin(options)
        ]
    },
};

export default attributes;
