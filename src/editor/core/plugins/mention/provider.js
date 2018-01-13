/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

let MentionProvider = function() {
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

MentionProvider.prototype.query = function(state, node) {
    this.state = state;
    this.$node = $(node);

    this.loading();
    let queryResult = this.find(this.state.query, node);

    if(queryResult.then) {
        queryResult.then((result) => {
            this.updateResult(result);
        });
    } else {
        this.updateResult(queryResult);
    }
};

MentionProvider.prototype.loading = function() {
    this.result = {text: 'Loading...'};
    this.update();
};

MentionProvider.prototype.updateResult = function(result) {
    this.result = result;
    this.update();
};

MentionProvider.prototype.find = function(query, node) {
    // Abstract method has to be implemented by subclasses
};

MentionProvider.prototype.reset = function(query, node) {
    if(this.$container) {
        this.$container.remove();
    }
};

MentionProvider.prototype.prev = function() {
    let $cur = this.$container.find('.cur');
    let $prev = $cur.prev();
    if($prev.length) {
        $prev.addClass('cur');
        $cur.removeClass('cur');
    }
};

MentionProvider.prototype.next = function() {
    let $cur = this.$container.find('.cur');
    let $next = $cur.next();
    if($next.length) {
        $next.addClass('cur');
        $cur.removeClass('cur');
    }
};

MentionProvider.prototype.select = function() {
    let $cur = this.$container.find('.cur');
    this.state.addMention($cur.data('item'));
    this.reset();
};

MentionProvider.prototype.update = function(loading) {
    if(!this.$container) {
        this.$container = $('<div class="atwho-view">').css({'margin-top': '5px'});
    } else {
        this.$container.empty();
    }

    let position = this.$node[0].getBoundingClientRect();
    this.$container.css({
        top: position.top + this.$node.outerHeight() + 2,
        left: position.left,
    });

    if(this.result && this.result.length) {
        let $list = $('<ul style="list-style-type: none;padding:0px;margin:0px;">');

        this.result.forEach(function (item) {
            if (item.image) {
                $list.append($('<li>' + item.image + ' ' + item.name + '</li>').data('item', item));
            } else {
                $list.append($('<li>' + item.name + '</li>').data('item', item));
            }

        });

        $list.find('li').first().addClass('cur');

        this.$container.append($list);
    } else if(this.result.text) {
        this.$container.append($('<span>'+this.result.text+'</span>'));
    } else {
        this.$container.append($('<span>No Result</span>'));
    }

    $('body').append(this.$container.show());
};

export default MentionProvider
