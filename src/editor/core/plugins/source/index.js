/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */
import {menu} from "./menu"
import {sourcePlugin, isSourceMode} from "./plugin"

const enabledItems = [
    'source',
    'resizeNav',
    'fullScreen'
]

const source = {
    id: 'source',
    menu: (context) => menu(context),
    menuWrapper: (context) => {
      return {
          run: function(menuItem, state) {
              if(menuItem.options.id === 'source' || !isSourceMode(state)) {
                  return false;
              }

              if(menuItem.runSource) {
                  menuItem.runSource();
                  return true;
              }

              return false;
          },
          enable: function(menuItem, state, enabled) {
              let sourceMode = isSourceMode(state);

              if(enabledItems.includes(menuItem.options.id) || (sourceMode &&  menuItem.runSource)) {
                  return true;
              }

              return sourceMode ? false : enabled;
          },
          active: function(menuItem, state, active) {
              if(menuItem.options.id === 'source') {
                  return active;
              }

              return (isSourceMode(state)) ? false : active;
          }
      }
    },
    plugins: (context) => {
        return [
            sourcePlugin(context)
        ];
    },
};

export default source;
