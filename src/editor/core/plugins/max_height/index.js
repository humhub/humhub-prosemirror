/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2018 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

// We don't use the official repo https://github.com/valeriangalliat/markdown-it-anchor/issues/39
import markdown_it_anchor_plugin from "markdown-it-anchor"
import {Plugin} from "prosemirror-state";

const maxHeight = {
    id: 'max-height',
    init: (context, isEdit) => {
        if(!isEdit) {
            return;
        }

        context.editor.on('afterInit', () => {
            if(context.options.maxHeight) {
                context.editor.getStage().css({'max-height': context.options.maxHeight,'overflow': 'auto'});
            }
        });
    },
    plugins: (context) => {
        let oldStageHeight = 0;
        let scrollActive = false;
        let initialized = false;
        return [new Plugin({
            view: (view) => {
                return {
                    update: (view, prevState) => {
                        let stageHeight = context.editor.getStage().innerHeight();

                        if(stageHeight === oldStageHeight) {
                            return;
                        }

                        oldStageHeight = stageHeight;

                        if(!scrollActive && context.editor.getStage()[0].scrollHeight > stageHeight) {
                            if(!initialized) {
                                context.editor.getStage().niceScroll({
                                    cursorwidth: "7",
                                    cursorborder: "",
                                    cursorcolor: "#606572",
                                    cursoropacitymax: "0.3",
                                    nativeparentscrolling: false,
                                    autohidemode: false,
                                    railpadding: {top: 2, right: 3, left: 0, bottom: 2}
                                });
                            }

                            initialized = true;
                            scrollActive = true;
                            context.editor.trigger('scrollActive');
                        } else if(scrollActive) {
                            scrollActive = false;
                            context.editor.trigger('scrollInactive');

                        }
                    },
                    destroy: () => {}
                }
            }
        })];
    }
};

export default maxHeight;
