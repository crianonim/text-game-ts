import * as Schema from './schema';
interface Verb {
    (ctx: Schema.Dialog, ...arg: any): any
}
export const DEBUG = (ctx: Schema.Context, mesage: string) => { console.log("DEBUG:", mesage); return '' }
export const CURRENT_DIALOG = (ctx: Schema.Context) => ctx.dialogName;