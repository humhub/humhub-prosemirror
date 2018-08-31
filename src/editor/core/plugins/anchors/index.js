/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2018 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

// We don't use the official repo https://github.com/valeriangalliat/markdown-it-anchor/issues/39
import markdown_it_anchor_plugin from "markdown-it-anchor"

const position = {
    false: 'push',
    true: 'unshift'
};

const anchors = {
    id: 'anchor',
    renderOnly: true,
    init: (context, isEdit) => {
        if(!isEdit) {
            context.editor.$.on('mouseenter', ':header', function() {
                $(this).find('.header-anchor').show();
            }).on('mouseleave', ':header', function() {
                $(this).find('.header-anchor').hide();
            });
        }
    },
    registerMarkdownIt: (markdownIt) => {
        let anchorOptions =  {permalink: true};
        anchorOptions.renderPermalink =  (slug, opts, state, idx) => {
            const space = () => Object.assign(new state.Token('text', '', 0), { content: ' ' });

            const linkTokens = [
                Object.assign(new state.Token('link_open', 'a', 1), {
                    attrs: [
                        ['class', opts.permalinkClass],
                        ['href', opts.permalinkHref(slug, state)],
                        ['style', 'display:none'],
                        ['target', '_self'],
                        ['aria-hidden', 'true']
                    ]
                }),
                Object.assign(new state.Token('text', '', 0), { content: opts.permalinkSymbol }),
                new state.Token('link_close', 'a', -1)
            ];

            // `push` or `unshift` according to position option.
            // Space is at the opposite side.
            let tokens = linkTokens[position[!opts.permalinkBefore]](space());
            state.tokens[idx + 1].children[position[opts.permalinkBefore]](...linkTokens)
        };

        if(anchorOptions) {
            markdownIt.use(markdown_it_anchor_plugin, anchorOptions);
        }
    }
};

export default anchors;
