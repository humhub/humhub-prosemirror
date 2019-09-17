/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2018 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import { Plugin, PluginKey } from 'prosemirror-state';
import { EmojiState } from './state';
import EmojiProvider from "./provider";
import twemoji from "twemoji";
import * as util from "./util";

const pluginKey = new PluginKey('emoji');

const emojiPlugin = (context) => {
    return new Plugin({
        props: {
            transformPastedHTML: (html) => {
                let $html = $(html);
                let $dom = $('<body>').append($html);

                let cfg = context.getPluginOption('emoji', 'twemoji');
                cfg.attributes = (icon, variant) => {
                    return {'data-name': util.getNameByChar(icon), 'style': 'width:16px'};
                };

                return $('<html>').append(twemoji.parse($dom[0],cfg)).html();
            },
            transformPastedText: (text) => {
                text = twemoji.parse(text, context.getPluginOption('emoji', 'twemoji'));

                return text.replace(/\<img class="emoji"[^\\\>]* alt=\"([^\"]*)\"[^\\\>]*\/>/g, function(match, char) {
                    return ':'+util.getNameByChar(char)+':';
                });
            },
        },
        state: {
            init(config, state) {
                return new EmojiState(state, {
                    provider: (context.options.emoji && context.options.emoji.provider)
                        ?  context.options.emoji.provider : new EmojiProvider(context)
                });
            },
            apply(tr, prevPluginState, oldState, newState) {
                return prevPluginState;
            }
        },
        key: pluginKey,
        view: (view) => {
            const emojiState = pluginKey.getState(view.state);

            return {
                update(view, prevState) {
                    emojiState.update(view.state, view);
                },
                destroy() {}
            };
        },
    });
};

export {emojiPlugin, pluginKey}