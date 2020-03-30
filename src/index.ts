import * as Schema from './schema';
import * as Screept from './screept';
import verbs from './game-data/verbs';
import { ctx } from './game-data/context';
import data from './game-data/dialogs';
import * as Dialog from './dialog';

export const init = () => {

    // const r = Screept.run("false  ? $ADD(10,5) + $ADD(200,3): 55", ctx, verbs)
    // console.log("R", r);
    // Screept.run("$DEBUG($CURRENT_DIALOG())", ctx, verbs)
    // console.log(Screept.interpolate("Jestem dzisiaj jest {{$CURRENT_DIALOG()}} nie ma co! A {{$ADD(10,5) + $ADD(200,3)}} {{$flags.seen=0}}", ctx, verbs))
    // console.log("1", ctx)
    // console.log("2", dialogChoice(data, ctx, 0))
    // console.log(Dialog.presentDialog(data, ctx))
    // console.log(Dialog.chooseOption(data, ctx, 0))
    // console.log(Dialog.chooseOption(data, ctx, 1))
    ctx.stack = [ctx.dialogName]
    return { presentDialog: () => Dialog.presentDialog(data, ctx), chooseOption: (optionNumber) => Dialog.chooseOption(data, ctx, optionNumber) }

}

export const dialogChoice = (data: Schema.Dialog[], ctx: Schema.Context, choice: number) => {
    return ctx;
}