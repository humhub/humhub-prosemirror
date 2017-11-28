/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

$(document).ready(function() {
    var TestMentionProvider = function() {
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

    TestMentionProvider.prototype.query = function(state, node) {
        this.state = state;
        this.$node = $(node);
        var query = this.state.query;
        this.result = this.user.filter(function(user) {
            return user.name.indexOf(query) >= 0;
        });

        this.update();
    };

    TestMentionProvider.prototype.reset = function(query, node) {
        if(this.$container) {
            this.$container.remove();
        }
    };

    TestMentionProvider.prototype.prev = function() {
        let $cur = this.$container.find('.cur');
        let $prev = $cur.prev();
        if($prev.length) {
            $prev.addClass('cur');
            $cur.removeClass('cur');
        }
    };

    TestMentionProvider.prototype.next = function() {
        let $cur = this.$container.find('.cur');
        let $next = $cur.next();
        if($next.length) {
            $next.addClass('cur');
            $cur.removeClass('cur');
        }
    };

    TestMentionProvider.prototype.select = function() {
        let $cur = this.$container.find('.cur');
        this.state.addMention($cur.data('item'));
    };

    TestMentionProvider.prototype.update = function() {
        if(!this.$container) {
            this.$container = $('<div class="atwho-view">').css({
                position: 'absolute',
                'background-color': 'white',
                'border': '1px solid black',
                'padding':'5px'
            });
        } else {
            this.$container.empty();
        }

        if(this.result && this.result.length) {
            var position = this.$node[0].getBoundingClientRect();


            this.$container.css({
                top: position.top + this.$node.outerHeight() + 2,
                left: position.left,
            });

            $list = $('<ul style="list-style-type: none;padding:0px;margin:0px;">');

            this.result.forEach(function(item) {
                $list.append($('<li>'+item.image+' '+item.name+'</li>').data('item', item));
            });

            $list.find('li').first().addClass('cur');

            this.$container.append($list);
        } else {
            this.$container.append($('<span>No Result</span>'));
        }

        $('body').append(this.$container);
    };

    var editor;
    var markdown;

    var render = function(md) {
        if(!md) {
            md = $('#markdown').val().trim();
        }

        if(!editor) {
            editor = new pm.MarkdownEditor('#editor', {
                mention: {
                    provider: new TestMentionProvider()
                }
            });
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

    $('#submitQuery').on('click', function() {
        let view = editor.editor;
        let state = view.state;
        let doc = state.doc;
        let schema = state.schema;
        let result = eval($('#query').val());
        console.log(result);
    })

    render();
});