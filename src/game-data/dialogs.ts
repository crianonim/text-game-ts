import * as Schema from '../schema';
const dialogs: Schema.Dialog[] = [
    {
        id: "init",
        intro: [
            { if: "$flags.seen", text: "You've seen it! {{$CURRENT_DIALOG()}}" },
            { text: "Welcome to TEXT-GAME.{{$CURRENT_DIALOG()}} What would you like to do?" },

        ],
        options: [
            { text: "Start a new game {{$turn}}", go: "start" },
            { text: "See it!", run: "$flags.seen=1", if: "!$flags.seen" },
            { text: "Unsee it!", run: "$flags.seen=0", if: "$flags.seen" },

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
            },
            {
                text: "Go back to INIT",
                go: "init"
            }

            // {text:"Go towards the village",if:"$flags.looked_around",go:"village"}
        ]
    }
];
export default dialogs;