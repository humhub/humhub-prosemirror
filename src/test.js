/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

$(document).ready(function() {
    var inherits = function(Sub, Parent) {
        for(var i in Parent) {
            Sub[i] = Parent[i];
        }

        Sub.prototype = Object.create(Parent.prototype);
        Sub._super = Parent.prototype;
        Sub._superConst = Parent;
    }


    var TestMentionProvider = function() {
        prosemirror.MentionProvider.call(this, {});
        this.user = [
            {
                guid: 'a',
                type: 'u',
                name: 'Lucas Bartholemy',
                image: '<img height="20" widht="20" src="img/default_user.jpg" />',
                link: '#'
            },
            {
                guid: 'b',
                type: 'u',
                name: 'Julian Harrer',
                image: '<img height="20" widht="20" src="img/default_user.jpg" />',
                link: '#'
            },
            {
                guid: 'c',
                type: 'u',
                name: 'Semir Salihovic',
                image: '<img height="20" widht="20" src="img/default_user.jpg" />',
                link: '#'
            },
            {
                guid: 'd',
                type: 'u',
                name: 'Peter Schmohl',
                image: '<img height="20" widht="20" src="img/default_user.jpg" />',
                link: '#'
            },
            {
                guid: 'e',
                type: 'u',
                name: 'Evy Müller',
                image: '<img height="20" widht="20" src="img/default_user.jpg" />',
                link: '#'
            },
        ];
    };

    inherits(TestMentionProvider, prosemirror.MentionProvider);

    TestMentionProvider.prototype.find = function(query, node) {
        return this.user.filter(function(user) {
            return user.name.indexOf(query) >= 0;
        });
    };

    var editor;
    var markdown;

    var render = function(md) {
        if(!md) {
            md = $('#markdown').val().trim();
        }

        if(!editor) {
            editor = new prosemirror.MarkdownEditor('#editor', {
                placeholder: {
                    text: 'Test Placeholderr',
                    'class' : 'placeholder atwho-placeholder'
                },
                mention: {
                    provider: new TestMentionProvider()
                },
                attributes:  {
                    'class': 'atwho-input form-control humhub-ui-richtext',
                    'data-ui-markdown': true
                },

            });
            editor.on('init', serialize);
        }

        document.execCommand("enableObjectResizing", false, false);
        document.execCommand("enableInlineTableEditing", false, false);

        editor.init(md);

        ProseMirrorDevTools.applyDevTools(editor.editor, { EditorState: prosemirror.EditorState });

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

    $('#submitQuery').on('click', function() {
        let view = editor.editor;
        let state = view.state;
        let doc = state.doc;
        let schema = state.schema;
        let result = eval($('#query').val());
        console.log(result);
    });

    render();
});