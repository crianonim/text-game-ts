import * as Schema from './schema';

export function run(text: string, ctx: Schema.Context, verbs: any) {
    console.log("VERBS", verbs)
    text = text.replace(/\$(\w+\W?)\(/g, " verbs.$1(ctx, ").replace(/\$(\w+\W?)/g, " ctx.$1");
    console.log("EVAL", text)
    return eval(text);
}

export function interpolate(s: string, ctx: Schema.Context, verbs: any) {
    return s.replace(/{{(.*?)}}/g, (full, scr) => {
        let result = run(scr, ctx, verbs)
        console.log("RESULT of interpolation", result)
        return result;
    })
}
