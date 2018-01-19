import { Plugin } from 'prosemirror-state';
import { Node, Slice } from 'prosemirror-model'
import twemoji from "../../twemoji"
import {getParser} from "../../../markdown/parser"

const emojiPlugin = (context) => {
    let parser = getParser(context);
    return new Plugin({
        props: {
            /*transformPastedHTML: (html) => {
                let $html = $(html);
                let $dom = $('<body>').append($html);
                let test = $('<html>').append(twemoji.parse($dom[0])).html();

                return test
            },
            transformPastedText: (text) => {

                return twemoji.parse(text, {output: 'markdown'});
            },*/
            clipboardTextParser: $.proxy(parser.parse, parser),
            transformPasted: (slice) => {
                if(slice && slice instanceof Node && slice.type == context.schema.nodes.doc) {
                    return new Slice(slice.content, 0, 0)
                }

                return slice;
            }
        }
    });
}

export {emojiPlugin}