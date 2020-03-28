import * as Schema from './schema';

export function run(text: string, ctx: Schema.Context, verbs: any) {
    text = text.replace(/\$(\w+\W?)/g, " ctx.$1");
    console.log("EVAL", text)
    return eval(text);
}

export function interpolate(s: string, ctx: Schema.Context, verbs) {
    return s.replace(/{{(.*?)}}/g, (full, scr) => {
        let result = run(scr, ctx, verbs)
        console.log("RESULT of interpolation", result)
        return result;
    })
}
