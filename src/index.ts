import * as Schema from './schema';
import * as Screept from './schema';
import * as Verbs from './verbs';

export const init = (data: Schema.Dialog[]) => {
    const ctx: Schema.Context = {
        dialogName: 'init',
        stack: [],
        turn: 2,
        options: true,
    }
    console.log("1", ctx)
    console.log("2", dialogChoice(data, ctx, 0))

}

export const dialogChoice = (data: Schema.Dialog[], ctx: Schema.Context, choice: number) => {
    return ctx;
}