import * as Schema from './schema';
import * as Screept from './schema';

export const getOptions = (dialog: Schema.Dialog) => dialog.options
export const getDialog = (data: Schema.Dialog[], dialogName: string) => data.find(el => el.id === dialogName) 