import {InputRule} from "prosemirror-inputrules"
import {canJoin} from "prosemirror-transform";
import {$node} from "../../util/node";
import {TextNode} from "prosemirror-model/src/node";

// : (NodeType) → InputRule
// Given a blockquote node type, returns an input rule that turns `"> "`
// at the start of a textblock into a blockquote.
const strongRule = (schema) => {
     return new InputRule(/\*\*.*\*\*/, (state, match, start, end) => {
         let tr = state.tr.delete(start, end);

         //let nodeBefore = $start.nodeBefore;
         //let text = $end.nodeBefore;

         let strong = schema.marks.strong.create();

         //let marks = strong.addToSet(text.marks);

        // let copy = text.mark(mark.addToSet(marks));
         //$node(text, start).replaceWith(copy, s));


         debugger;

         //tr.insert(start, copy);

         state.doc.nodesBetween(start, end, function(node, nodeStart, parent, index) {
             if(node.isText) {
                 node.marks = strong.addToSet(node.marks);
                 tr.insert(start, node);
             }

             //node.marks = node.mark(strong.addToSet(node.marks));

         });


         /*//tr.addMark($start.pos, $end.pos - 1, schema.marks.strong);
         let before = tr.doc.resolve(start - 1).nodeBefore;
         if (before && canJoin(tr.doc, start - 1) &&
             (!joinPredicate || joinPredicate(match, before)))
             tr.join(start - 1);*/
         return tr
     });
};

export {strongRule};