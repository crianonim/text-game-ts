import * as Schema from './schema';
import * as Screept from './screept';
import verbs from './game-data/verbs'
export const getOptions = (dialog: Schema.Dialog) => dialog.options
export const getDialog = (data: Schema.Dialog[], dialogName: string) => data.find(el => el.id === dialogName)

export const presentDialog = (data: Schema.Dialog[], ctx: Schema.Context, dialogName: string = ctx.dialogName) => {
    const dialog = getDialog(data, dialogName);
    const result = { intro: "", options: [] }
    result.intro = Screept.interpolate(dialog.intro
        .find(intro => intro.if ? Screept.run(intro.if, ctx, verbs) : true)
        .text, ctx, verbs)
    result.options = dialog.options
        .filter(option => option.if ? Screept.run(option.if, ctx, verbs) : true)
        .map(option => Screept.interpolate(option.text, ctx, verbs))
    return result
}