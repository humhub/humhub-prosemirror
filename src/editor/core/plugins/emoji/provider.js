/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import * as util from './util';

let userFlag = undefined;
let findUserFlag = function() {
    if(userFlag) {
        return userFlag;
    }

    const directMapping = {
        'en-us': 'us',
        'en': 'us',
        'en_gb': 'uk',
        'pt_br': 'portugal',
        'fa_ir': 'iran',
        'zh_cn': 'cn',
        'zh_tw': 'cn',
        'ja': 'jp',
        'ko': 'kr',
        'ar': 'united_arab_emirates',
        'uk': 'ukraine',
        'ru' : 'ru',
        'vi': 'vietnam',
        'sv': 'sweden',
        'nb_no': 'norway',
        'it' : 'it',
        'fr': 'fr',
        'es': 'es',
        'de': 'de',
        'da': 'denmark',
        'cs': 'czech_republic',
        'ca': 'es', // sorry for that ;)
        'an': 'es'
    };

    let result = '\uD83C\uDDE9\uD83C\uDDEA';

    try {
        let language = humhub.require('user').getLocale().toLowerCase();

        if(directMapping[language]) {
            return util.getCharByName(directMapping[language]);
        }

        $.each(util.getByCategory('flags'), (flag) => {
            if(flag.keywords.indexOf(language) >= 0) {
                result = flag.char;
                return false;
            }
        });
    } catch(e) {
        console.error('Error while determining user flag in emoji chooser ');
        console.error(e);
    }

    return userFlag = result;
};

let chooser = undefined;

class EmojiChooser {
    constructor(provider) {
        this.provider = provider;
        this.categoryOrder = ['people', 'animals_and_nature', 'food_and_drink', 'activity', 'travel_and_places', 'objects', 'symbols', 'flags'];
        this.categories = {
            people: {$icon: util.getCharToDom('\uD83D\uDE00')},
            animals_and_nature: {$icon: util.getCharToDom('\uD83D\uDC3B')},
            food_and_drink: {$icon: util.getCharToDom('\uD83C\uDF82')},
            activity: {$icon: util.getCharToDom('\u26BD')},
            travel_and_places: {$icon: util.getCharToDom('\u2708\uFE0F')},
            objects: {$icon: util.getCharToDom('\uD83D\uDDA5')},
            symbols: {$icon: util.getCharToDom('\u2764\uFE0F')},
            flags: {$icon: util.getCharToDom(findUserFlag())}
        };

        this.initDom();
        this.initCategory(this.categoryOrder[0]);
    }

    update(provider) {
        this.provider = provider;
        let position = provider.$node.offset();
        this.$.css({
            top: position.top + provider.$node.outerHeight() - 5,
            left: position.left,
        }).show();
    }

    initDom() {
        let that = this;
        this.$ = $('<div class="atwho-view humhub-richtext-provider">').hide().appendTo($('body')).on('hidden', () => {

            if(that.provider) {
                that.provider.reset();
            }
        });
        this.initNav();
    }

    initNav() {
        let $nav = $('<div class="emoji-nav">').appendTo(this.$);

        this.categoryOrder.forEach((categoryName, index) => {
            let categoryDef = this.categories[categoryName];
            let $item = $('<span class="emoji-nav-item" title="'+this.translate(categoryName)+'">').attr('data-emoji-nav-item', categoryName).append(categoryDef.$icon).on('click', () => {
                this.openCategory(categoryName);
                this.provider.event.trigger('focus');
            });

            if(index === 0) {
                $item.addClass('cur');
            }

            $nav.append($item);
        });
    }

    openCategory(categoryName) {
        let categoryDef = this.categories[categoryName];
        if(!categoryDef.$) {
            this.initCategory(categoryName)
        }

        this.$.find('[data-emoji-nav-item]').removeClass('cur');
        this.$.find('[data-emoji-nav-item="'+categoryName+'"]').addClass('cur');
        this.$.find('[data-emoji-category]').hide();
        this.$.find('[data-emoji-category="'+categoryName+'"]').show();
    }

    initCategory(categoryName) {
        let that = this;
        let $category = $('<div>').attr('data-emoji-category', categoryName).on('click', '.atwho-emoji-entry', function()  {
            that.getSelectionNode().removeClass('cur');
            $(this).addClass('cur');
            that.provider.select();
        }).prependTo(this.$);

        let $list = $('<ul class="atwo-view-ul">').appendTo($category);
        let $li = undefined;
        util.getByCategory(categoryName).forEach((emojiDef) => {
            let $li = $('<li class="atwho-emoji-entry">').append(util.getCharToDom(emojiDef.char, emojiDef.name));

            if(categoryName === 'flags' && emojiDef.char === findUserFlag()) {
                $list.prepend($li);
            } else {
                $list.append($li);
            }
        });

        $list.children().first().addClass('cur');

        this.categories[categoryName].$ = $category;
    }

    reset() {
        this.provder = undefined;
        this.$.hide();
    }

    getSelection() {
        let $selection = this.getSelectionNode().find('img');
        return {
            name: $selection.data('name'),
            alt: $selection.attr('alt'),
            src: $selection.attr('src'),
        }
    }

    translate(key) {
        return this.provider.context.translate(key);
    }

    getSelectionNode() {
        return this.getActiveCategoryTab().find('.cur');
    }

    getActiveCategoryTab() {
        return this.$.find('[data-emoji-category]:visible');
    }

    prev() {
        let $cur = this.getSelectionNode();
        let $prev = $cur.prev();
        if ($prev.length) {
            $prev.addClass('cur');
            $cur.removeClass('cur');
            this.alignScroll();
        }
    }

    next() {
        let $cur = this.getSelectionNode();
        let $next = $cur.next();
        if ($next.length) {
            $next.addClass('cur');
            $cur.removeClass('cur');
            this.alignScroll();
        }
    }

    up() {
        let $cur = this.getSelectionNode();
        let curPosition = $cur.position();

        for (let $prev = $cur.prev(); $prev.length; $prev = $prev.prev()) {
            let nextPosition = $prev.position();

            if (nextPosition.top < curPosition.top && nextPosition.left === curPosition.left) {
                $prev.addClass('cur');
                $cur.removeClass('cur');
                this.alignScroll();
                return;
            }
        }
    }

    down() {
        let $cur = this.getSelectionNode();
        let curPosition = $cur.position();

        for (let $next = $cur.next(); $next.length; $next = $next.next()) {
            let nextPosition = $next.position();
            if (nextPosition.top > curPosition.top && nextPosition.left === curPosition.left) {
                $next.addClass('cur');
                $cur.removeClass('cur');
                this.alignScroll();
                return;
            }
        }

        // If we did not find a match the line below is probably the last line.
        let $last = this.getActiveCategoryTab().find('.atwho-emoji-entry:last');
        if($last.position().top !== curPosition.top) {
            $last.addClass('cur');
            $cur.removeClass('cur');
            this.alignScroll();
        }
    }

    alignScroll() {
        let $cur = this.getSelectionNode();
        let $tab = this.getActiveCategoryTab();
        let scrollTop = $tab.scrollTop();
        let scrollBottom = scrollTop + $tab.height();

        let offsetTop = $cur[0].offsetTop;
        let offsetBottom = offsetTop + $cur.height();

        if(offsetTop > scrollBottom || offsetTop < scrollTop || offsetBottom > scrollBottom || offsetBottom < scrollTop) {
            $tab[0].scrollTop = $cur[0].offsetTop;
        }
    }
}

let EmojiProvider = function (context) {
    this.event = $({});
    this.context = context;
};

EmojiProvider.prototype.query = function (state, node) {
    this.state = state;
    this.$node = $(node);
    this.update();
};

EmojiProvider.prototype.reset = function (query, node) {
    if (this.$node) {
        this.$node = undefined;
        this.getChooser().reset();
        this.event.trigger('closed');
    }
};

EmojiProvider.prototype.next = function () {
    this.getChooser().next();
};

EmojiProvider.prototype.prev = function () {
    this.getChooser().prev();
};

EmojiProvider.prototype.down = function () {
    this.getChooser().down();
};

EmojiProvider.prototype.up = function () {
    this.getChooser().up();
};

EmojiProvider.prototype.select = function () {
    this.state.addEmoji(this.getChooser().getSelection());
};

EmojiProvider.prototype.update = function () {
    this.getChooser().update(this);
};

EmojiProvider.prototype.getChooser = function () {
    if(!chooser) {
        chooser = new EmojiChooser(this);
    }

    return chooser;
};

export default EmojiProvider
