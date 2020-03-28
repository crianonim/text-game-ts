import * as Schema from './schema';
const dialogs: Schema.Dialog[] = [
    {
        id: "init",
        intro: [{ text: "Welcome to TEXT-GAME. What would you like to do?" }],
        options: [
            { text: "Start a new game", go: "start" },
            //     { text: "Load game", run: "$LOAD()", if: "$IS_SAVED()", go: "return" },
            { text: "About this game", go: "about" }
        ]
    },
    {
        id: "about",
        intro: [
            {
                text: `Welcome to the fist scenario written using 'Text-Game' - a dialog based game engine
                      You will try to survive in an unknown place, after having forgotten everything, even who you are.
                  `
            }
        ],
        options: [{ text: "Ok", go: "return" }]
    },

    {
        id: "start",
        intro: [
            {
                text: `You wake up on the side of a road. Your head hurts and you don\'t remember anything. 
                  {{$flags.looked_around ? "The road seems to lead to some settlement. You have a strong feeling that the other way is trouble." : "" }}`
            }
        ],
        options: [
            // {text:"Look around.",if:" !$flags.looked_around ",run:"$flags.looked_around++"},
            {
                text: "Look around.",
                if: " !$flags.looked_around ",
                run: "$flags.looked_around++ ; $TURN(1)"
            },
            {
                text: "Go towards the village",
                if: "$flags.looked_around",
                go: "village",
                run: "$TURN(2)"
            }

            // {text:"Go towards the village",if:"$flags.looked_around",go:"village"}
        ]
    }
];
export default dialogs;