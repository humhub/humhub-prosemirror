import { Plugin } from 'prosemirror-state'
import { Slice, Fragment } from "prosemirror-model"

let linkPlugin = (context) => {
    return new Plugin({
        props: {
            transformPasted: (slice) => {
                return new Slice(linkify(slice.content, context), slice.openStart, slice.openEnd);
            }
        }
    });
};

const HTTP_LINK_REGEX = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,})/ig
let linkify = function(fragment, context) {
    let linkified = [];
    let urls = [];
    fragment.forEach(function(child){
        if (child.isText) {
            const text = child.text;
            let pos = 0, match;

            while (match = HTTP_LINK_REGEX.exec(text)) {
                let start = match.index;
                let end = start + match[0].length;
                let link = child.type.schema.marks['link'];

                // simply copy across the text from before the match
                if (start > 0) {
                    linkified.push(child.cut(pos, start))
                }

                const urlText = text.slice(start, end);
                urls.push(urlText);
                linkified.push(
                    child.cut(start, end).mark(link.create({href: urlText}).addToSet(child.marks))
                );
                pos = end
            }

            // copy over whatever is left
            if (pos < text.length) {
                linkified.push(child.cut(pos))
            }
        } else {
            linkified.push(child.copy(linkify(child.content, context)))
        }
    });

    if(urls.length) {
        context.event.trigger('linkified', [urls, linkified]);
    }
    return Fragment.fromArray(linkified)
};

export {linkPlugin}