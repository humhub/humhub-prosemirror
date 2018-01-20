/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {Plugin} from "prosemirror-state"
import {Decoration, DecorationSet} from "prosemirror-view"


const loaderPlugin = new Plugin({
    state: {
        init() {
            return DecorationSet.empty
        },
        apply(tr, set) {
            debugger;
            // Adjust decoration positions to changes made by the transaction
            set = set.map(tr.mapping, tr.doc);
            // See if the transaction adds or removes any placeholders
            let action = tr.getMeta(this);
            if (action && action.add) {
                let widget = humhub.require('ui.loader').set($('<span class="ProseMirror-placeholder">'), {
                    span: true,
                    size: '8px',
                    css: {
                        padding: '0px',
                        width: '60px'
                    }
                })[0];
                let deco = Decoration.widget(action.add.pos, widget, {id: action.add.id, content: true});
                set = set.add(tr.doc, [deco])
            } else if (action && action.remove) {
                set = set.remove(set.find(null, null,
                    spec => spec.id == action.remove.id))
            }
            return set
        }
    },
    props: {
        decorations(state) { return this.getState(state) }
    }
});


function findPlaceholder(state, id) {
    let decos = loaderPlugin.getState(state);
    let found = decos.find(null, null, spec => spec.id == id)
    return found.length ? found[0].from : null
}

function loaderStart(view, id, dispatch) {
    let tr = view.state.tr;

    if (!tr.selection.empty) {
        tr.deleteSelection();
    }

    tr.setMeta(loaderPlugin, {add: {id, pos: tr.selection.from}});

    if(dispatch) {
        view.dispatch(tr);
    }

    return tr;
}

function replaceLoader(view, id, content, dispatch) {
    let pos = findPlaceholder(view.state, id);

    // If the content around the placeholder has been deleted, drop the image
    if (pos == null) {
        return;
    }

    let tr = view.state.tr.replaceWith(pos, pos, content).setMeta(loaderPlugin, {remove: {id}});

    if(dispatch) {
        view.dispatch(tr);
    }

    return tr;
}

function removeLoader(view, id, dispatch) {
    let pos = findPlaceholder(view.state, id);

    // If the content around the placeholder has been deleted, drop the image
    if (pos == null) {
        return;
    }

    let tr = view.state.tr.setMeta(loaderPlugin, {remove: {id}});

    if(dispatch) {
        view.dispatch(tr);
    }

    return tr;
}

export {loaderPlugin, findPlaceholder, loaderStart, replaceLoader, removeLoader}