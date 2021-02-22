require("mocha/mocha")

// declare global: mocha
mocha.setup("bdd")
//mocha.checkLeaks();

require("./core/test-init")

require("./plugins/blocks/test-blockquote")
require("./plugins/blocks/test-codeblock")

require("./plugins/marks/test-strong")
require("./plugins/marks/test-em")
require("./plugins/marks/test-strike")
require("./plugins/marks/test-code")

mocha.run()