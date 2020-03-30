import * as Schema from './schema';
import * as Screept from './screept';
import verbs from './game-data/verbs'
export const getOptions = (dialog: Schema.Dialog) => dialog.options
export const getDialog = (data: Schema.Dialog[], dialogName: string) => data.find(el => el.id === dialogName)

const lastElement = (array: any[]) => array[array.length - 1]
const filterOptions = (options: Schema.DialogOption[], ctx: Schema.Context) => options.filter(option => option.if ? Screept.run(option.if, ctx, verbs) : true)


const interpolateOptions = (options: Schema.DialogOption[], ctx: Schema.Context) => options.map(option => Screept.interpolate(option.text, ctx, verbs))

export const presentDialog = (data: Schema.Dialog[], ctx: Schema.Context, dialogName: string = ctx.dialogName) => {
    console.log("PRESENTING DIALOG", dialogName)
    const dialog = getDialog(data, dialogName);
    const result = { intro: "", options: [] }
    result.intro = Screept.interpolate(dialog.intro
        .find(intro => intro.if ? Screept.run(intro.if, ctx, verbs) : true)
        .text, ctx, verbs)
    result.options = interpolateOptions(filterOptions(dialog.options, ctx), ctx);

    return result
}

export const chooseOption = (data: Schema.Dialog[], ctx: Schema.Context, optionNumber: number) => {
    const option = filterOptions(getDialog(data, ctx.dialogName).options, ctx)[optionNumber]
    if (option.run) {
        Screept.run(option.run, ctx, verbs)
    }
    if (option.go) {
        if (option.go === "return") {
            ctx.stack.pop()
            ctx.dialogName = lastElement(ctx.stack)
        } else {
            if (option.go !== ctx.dialogName) {
                ctx.stack.push(option.go)
            }
            ctx.dialogName = option.go
        }
    } else {
        //stay in the same dialog, just run code
    }
    console.log("OPTION", option);
    console.log("CHANGE TO", ctx.dialogName)
    console.log("STACK", ctx.stack);
}