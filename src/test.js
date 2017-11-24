/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

$(document).ready(function() {
    var editor;
    var markdown;

    var render = function(md) {
        if(!md) {
            md = $('#markdown').val().trim();
        }

        if(!editor) {
            editor = new pm.MarkdownEditor('#editor');
            editor.on('init', serialize);
        }

        document.execCommand("enableObjectResizing", false, false);
        document.execCommand("enableInlineTableEditing", false, false);

        editor.init(md);

        ProseMirrorDevTools.applyDevTools(editor.editor, { EditorState: pm.EditorState });

    };

    var serialize = function() {
        markdown = editor.serialize();
        $('#result').html($(editor.renderer.render(markdown)));
        $('#markdown').val(markdown);
    };

    var parse = function() {
        render($('#markdown').val());
    };

    $('#serialize').on('click', function() {
        serialize();
    });

    $('#test').on('click', function() {
        var md = $('#markdown').val().trim();
        var html = editor.renderer.render(md);
        console.log(html);
        $('#testContent').html($(html));
    });

    $('#parse').on('click', function() {
        parse();
    });

    $('#render').on('click', function() {
        render();
        serialize();
    });

    render();
});