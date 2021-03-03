require("mocha/mocha")

// declare global: mocha
mocha.setup("bdd")
//mocha.checkLeaks();

require("./core/test-editor")
require("./core/test-view")

require("./menu/test-menu-accessibility")

require("./plugins/blocks/test-blockquote")
require("./plugins/blocks/test-codeblock")

require("./plugins/marks/test-strong")
require("./plugins/marks/test-em")
require("./plugins/marks/test-strike")
require("./plugins/marks/test-code")

require("./plugins/source/test-source")
require("./plugins/max_height/test-maxheight")
require("./plugins/resize_nav/test-resizenav")

mocha.run()