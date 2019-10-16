Changelog
=========

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
