import * as Schema from '../../schema';

export const DEBUG = (ctx: Schema.Context, mesage: string) => { console.log("DEBUG:", mesage); return '' }
export const CURRENT_DIALOG = (ctx: Schema.Context) => ctx.dialogName;