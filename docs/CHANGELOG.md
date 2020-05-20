Changelog
=========

1.0.26 (May 20, 2020)
-----------------------------------------
- Fix: Disable emoji menu items in inline code
- Fix https://github.com/humhub/humhub/issues/4049 faulty line break within headline formatting
- Enh: Unified link creation and validation in `core/util/linkUtil.js`
- Fix: Oembed not wrapped in `oembed_snippet` container when cached
- Fix #11: Table cell paragraph always renders two line breaks

1.0.25 (May 13, 2020)
-----------------------------------------
- Fix: Fix linkExtensionTokenizer prevent inline text parsing issue
- Fix: Initial cursor not visible on firefox due to placeholder decoration
- Enh: Added new focus plugin for triggering plugin updates on focus/blur
- Fix #17: Links in inline code not parsed
- Fix: `exitCodeAtLast` broken due to usage of removed `defaultContentType`
- Fix: Focus menu closes when clicking outside of a menu button 
- Enh: Added `canInsertLink` menu utility
- Fix: Anchor plugin broken due to restricted url validation
- Fix: Disable link/image/file menu items in code blocks

1.0.24 (April 18, 2020)
-----------------------------------------
- Fix: Removed debugger statement

1.0.23 (April 17, 2020)
-----------------------------------------
- Fix: Add additional link href protocol check

1.0.22 (April 06, 2020)
-----------------------------------------
- Chg: Updated rollup dependency to 2.2.0
- Chg: Updated prosemirror dependencies
- Chg: Removed emoji input rule on small devices

1.0.21 (March 23, 2020)
-----------------------------------------
- Fix: https://github.com/humhub/humhub/issues/3906 prevent emoji chooser focus when triggered by input rule
- Enh: Added Tab navigation in emoji chooser
- Fix: Richtext list menu item disappears https://github.com/humhub/humhub/issues/3890 

1.0.20 (February 27, 2020)
-----------------------------------------
- Fix: Emoji chooser won't work after pjax page switch https://github.com/humhub/humhub/issues/3866 
- Enh: Added Emoji menu item
- Enh: Added search bar to emoji chooser


1.0.19 (February 2, 2020)
-----------------------------------------
- Fix: https://github.com/humhub/humhub/issues/3793 pipe character not escaped in tables
- Fix: https://github.com/humhub/humhub/issues/3827 emoji/mention input rule add duplicate character on IME
- Fix: util.hasMark not working when MarkType is given

1.0.18 (December 11, 2019)
-----------------------------------------
- Enh: Keep text marks when pasting text
- Fix: Copy/Paste of bold text not working
- Enh: Added `NodePos.isPlain()` and `NodePos.addMarks()`
- Enh: Added input rule for bold mark
- Enh: Added input rule for code mark
- Fix  #6: Newline and paragraphs not working inside of tables
- Enh: Leave mark when pressing right at the end of line
- Enh: Added support of `<br>`
- Fixes ios fullscreen issue https://github.com/humhub/humhub/issues/3711
- Enh: Added `data-ui-gallery` to images
- Enh: Added `context.uuid`
- Enh: Added editor instance as `env` within `registerMarkdownIt`
- Fix: Image edit button not visible because of z-index
- Fix: Image edit menu not removed after cancel edit

1.0.17 (October, 16, 2019)
-----------------------------------------
- Fix: removed non devDependencies

1.0.16 (October, 16, 2019)
-----------------------------------------
- Enh: Update Twemoji to v12.1.3


1.0.15 
-----------------------------------------
- Fix: emoji path configuration ignored
- Enh: Added submit shortcut (default Ctrl+S)
- Fix https://github.com/humhub/humhub/issues/3441 Richtext code block after list item not working


1.0.14 (October 23, 2018)
-----------------------------------------
- Fix: Downgraded to prosemirror-dropcursor v 1.0.1


1.0.13 (October 23, 2018)
-----------------------------------------
- Fix: Removed redundant `afterInit` call
- Fix: max_height plugin triggers `scrollActive` for empty/invisible editor states
- Enh: Added `MarkdownEditor.isEmpty()`

1.0.12 (October 11, 2018)
-----------------------------------------
- Fix: state.storedMarks are cleaned by mention plugin.
- Fix: `MarkdownEditor.clear()` does not cleanup $stage cached node


1.0.11 (October 10, 2018)
-----------------------------------------
- Fix: mobile view wrong min-height calculation
- Fix: Mentioning mark not removed when deleting @ https://github.com/humhub/humhub/issues/3328
- Fix: Emoji thumbs down not working
- Enh: Added `scrollActive` and `scrollInactive` events to `max_height` plugin
- Enh: Added `MarkdownEditor.getStage()` for recieving stage jquery object

1.0.10 (September 20, 2018)
-----------------------------------------
- Fix https://github.com/humhub/humhub/issues/3287 inline code block encoding
- Enh: Added `preventMarks` on MarkSpec (currently only supported by the link menu item)


1.0.9 (August 30, 2018)
-----------------------------------------
- Enh: Use of file-guid for uploaded images and files
- Enh: Paste images from clipboard
- Fix: Image edit button not removed correctly
- Fix: Missing addition check for plugin existance in `addPluginToPreset`
- Enh: Added `link.options.validate` function to intercept link input validation
- Fix: Split editor and render presets and added `Plugin.renderOnly` and `Plugin.editorOnly` in order to exclude plugins
- Enh: Added `MarkdownEditor.isEdit()` for checking if the richtext is in edit or render mode
- Enh: Readded `anchor` plugin
- Enh: Added prosemirror core to exports


1.0.8 (July 24, 2018)
-----------------------------------------
- Chng: Use of relative upload url


1.0.6 (July 30, 2018)
-----------------------------------------
- Fix: `context.getPluginOption()` default always overwrites actual option
- Chng: Added `code` mark to default visible elements


1.0.5 (July 18, 2018)
-----------------------------------------
- Fix: File upload errors not handled


1.0.4 (July 17, 2018)
-----------------------------------------
- Fix: table options padding issue
- Fix: dropdown menu position not aligned
- Enh: updated prosemirror dependencies
- Enh: added image edit by inline edit on hover
- Enh: added link edit by click
- Fix: emoji autocompplete and emoji input rule fired without leading space
- Chng: render `data-contentcontainer-guid` instead of `data-guid` for mentionings
- Enh: allow `mailto:` and `ftp:` url
- Enh: added email paste regex to linkify util
- Enh: added maxHeigt richtext plugin
- Enh: added promt form labels
