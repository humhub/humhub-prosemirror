/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import * as util from './util';

let EmojiProvider = function () {
    this.emojis = [
        "☺️","😋","😌","😍","🆒","😏","😚","😛","😜","😝","😞","☹",
        "😰","😫","😁","😭","😮","😲","😆","😂","😁","😆","😇","😉",
        "😐","😑","😞","😕","😟","😗","😘","😠","😡","😠","😢","😮",
        "😨","😕","😩","😱","😲","😳","😴","😶","😷","😟","😄","💪",
        "👊","👍","👎","🍻","🍸","🍔","🍗","🍻","🍰","🌞","🔥","❤",
    ];
};

EmojiProvider.prototype.query = function (state, node) {
    this.state = state;
    this.$node = $(node);
    this.updateResult(this.find(this.state.query, node));
};

EmojiProvider.prototype.find = function (query, node) {
    return this.emojis;
};

EmojiProvider.prototype.updateResult = function (result) {
    this.result = result;
    this.update();
};

EmojiProvider.prototype.reset = function (query, node) {
    if (this.$container) {
        this.$container.remove();
    }
};

EmojiProvider.prototype.prev = function () {
    let $cur = this.$container.find('.cur');
    let $prev = $cur.prev();
    if ($prev.length) {
        $prev.addClass('cur');
        $cur.removeClass('cur');
    }
};

EmojiProvider.prototype.down = function () {
    let $cur = this.$container.find('.cur');
    let curPosition = $cur.position();

    for(let $next = $cur.next(); $next.length; $next = $next.next()) {
        let nextPosition = $next.position();
        if (nextPosition.top > curPosition.top && nextPosition.left === curPosition.left) {
            $next.addClass('cur');
            $cur.removeClass('cur');
            return;
        }
    }

    // If we did not find a match the line below is probably the last line.
    this.$container.find('.atwho-emoji-entry:last').addClass('cur');
    $cur.removeClass('cur');
};

EmojiProvider.prototype.up = function () {
    let $cur = this.$container.find('.cur');
    let curPosition = $cur.position();

    for(let $prev = $cur.prev(); $prev.length; $prev = $prev.prev()) {
        let nextPosition = $prev.position();

        if (nextPosition.top < curPosition.top && nextPosition.left === curPosition.left) {
            $prev.addClass('cur');
            $cur.removeClass('cur');
            return;
        }
    }
};

EmojiProvider.prototype.next = function () {
    let $cur = this.$container.find('.cur');
    let $next = $cur.next();
    if ($next.length) {
        $next.addClass('cur');
        $cur.removeClass('cur');
    }
};

EmojiProvider.prototype.select = function () {
    let $cur = this.$container.find('.cur').find('img');

    this.state.addEmoji({
        name: $cur.data('name'),
        alt: $cur.attr('alt'),
        src: $cur.attr('src'),
    });

    this.reset();
};

EmojiProvider.prototype.update = function (loading) {
    if (!this.$container) {
        this.$container = $('<div class="atwho-view humhub-richtext-provider">').css({'margin-top': '5px', 'max-width': '243px'});
    } else {
        this.$container.empty();
    }

    let position = this.$node[0].getBoundingClientRect();
    this.$container.css({
        top: position.top + this.$node.outerHeight() + 2,
        left: position.left,
    });

    if (this.result && this.result.length) {
        let $list = $('<ul class="atwo-view-ul">');

        var that = this;
        this.result.forEach(function (emojiChar, i) {
            try {
                let $dom = util.getCharToDom(emojiChar);
                if($dom && $dom.length) {
                    let $li = $('<li class="atwho-emoji-entry ' + ((i === 0) ? 'cur' : '') + '">').append($dom);
                    $li.on('click', () => {
                        that.$container.find('.cur').removeClass('cur');
                        $li.addClass('cur');
                        that.select();
                    });
                    $list.append($li);
                } else {
                    console.error('Could not translate emoji '+emojiChar);
                }
            } catch(e) {
                console.error('Could not translate emoji '+emojiChar);
                console.error(e);
            }
        });

        this.$container.append($list);
    }

    $('body').append(this.$container.show());
};

export default EmojiProvider
