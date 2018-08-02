/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2018 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import { Plugin, NodeSelection } from 'prosemirror-state';

import { editNode } from './menu';

const imagePlugin = (context) => {

    context.editor.$.on('mouseleave', e => {
        if(!$(e.toElement).closest('.humhub-richtext-inline-menu').length) {
            $('.humhub-richtext-inline-menu').remove();
        }
    });

    return new Plugin({
        props: {
            nodeViews: {
                image(node) { return new ImageView(node, context) }
            }
        }
    });
};

class ImageView {
    constructor(node, context) {
        // The editor will use this as the node's DOM representation
        this.createDom(node);


        this.dom.addEventListener("mouseenter", e => {
            let $img = $(this.dom);
            let offset = $img.offset();


            let $edit = $('<div>').addClass('humhub-richtext-inline-menu')
                .html('<button class="btn btn-primary btn-xs"><i class="fa fa-pencil"></i></button>')
                .css({
                    position: 'absolute',
                    left: offset.left + $img.width() - (25),
                    top: offset.top + 5
                }).on('click', (evt) => {
                    let view = context.editor.view;
                    let doc = view.state.doc;
                    view.dispatch(view.state.tr.setSelection(NodeSelection.create(doc, view.posAtDOM(this.dom))).scrollIntoView());
                    editNode(node, context, view);
                });

            $('html').append($edit);
        });

        this.dom.addEventListener("mouseleave", e => {
            if(!$(e.toElement).closest('.humhub-richtext-inline-menu').length) {
                $('.humhub-richtext-inline-menu').remove();
            }
        })
    }

    createDom(node) {
        this.dom = $('<img>').attr({
            src: node.attrs.src,
            title: node.attrs.title || null,
            width: node.attrs.width || null,
            height:node.attrs.height || null,
            alt: node.attrs.alt || null
        })[0];
    }

    //stopEvent() { return true }
}

export {imagePlugin}