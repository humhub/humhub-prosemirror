require("mocha/mocha")

// declare global: mocha
mocha.setup("bdd")
//mocha.checkLeaks();

require("./core/test-editor")
require("./core/test-view")
require("./core/test-presets")
require("./core/test-translate")

require("./menu/test-menu-accessibility")
require("./menu/test-menu-config")

require("./plugins/blocks/test-blockquote")
require("./plugins/blocks/test-codeblock")

require("./plugins/marks/test-strong")
require("./plugins/marks/test-em")
require("./plugins/marks/test-strike")
require("./plugins/marks/test-code")

require("./plugins/history/test-history")

require("./plugins/source/test-source")
require("./plugins/max_height/test-maxheight")
require("./plugins/resize_nav/test-resizenav")
require("./plugins/tab_behavior/test-tab-behavior")

mocha.run()
