export interface Context {
    dialogName: string;
    stack: string[];
    options: boolean;
    // message: "";
    // messages: string[];
    // messageId: number;
    turn: number;
    [key: string]: any;

}

export interface DialogIntro {
    text: string;
    if?: string;
    run?: string;
}
export interface DialogOption {
    text: string;
    each?: string;
    if?: string;
    run?: string;
    go?: string;

}

export interface Dialog {
    id: string;
    intro: DialogIntro[];
    options: DialogOption[];
    run?: string;
}

interface Verb {
    (ctx: Context, ...arg: any): any
}