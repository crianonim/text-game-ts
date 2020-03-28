import * as Schema from './schema';
const dialogs: Schema.Dialog[] = [
    {
        id: "init",
        intro: [{ text: "Welcome to TEXT-GAME. What would you like to do?" }],
        options: [
            { text: "Start a new game", go: "start" },
            { text: "Load game", run: "$LOAD()", if: "$IS_SAVED()", go: "return" },
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
        id: "options",
        intro: [{ text: "Options. You have {{$INVENTORY()}}" }],
        options: [
            // {text:"msg",run:"$MSG('test 1');$MSG('test 2');$MSG('test 3');$MSG('test 4');$MSG('test 5');$MSG('test 6');$MSG('test 7');$MSG('test 8');$MSG('test 9');$MSG('test 10');$MSG('test 11');"},
            { text: "Craft", go: "craft" },
            { text: "Cook", run: "$crafting_station='kitchen'", go: "craft" },
            // {text:"Fight",run:"$opponent=$npc.find($FINDER('name','goblin'));$COMBAT_PREPARE()",go:"combat"},
            { text: "Look at yourself.", go: "look-at-self" },
            { text: "Eat", go: "eat" },
            // {text:"Eat a meal {{$INV('widget')}}",if:"$INV('meal') > 0 & $stats.energy < 100; ",run:"$INV('meal',-1); $INV('widget',2)"},
            {
                text: "Rest an hour",
                if: "$stats.energy < 100",
                run: "$TURN(4); $STAT('energy',10)"
            },
            // {text:"Wait an hour",run:"$TURN(4)"},
            {
                text: "Sleep until morning",
                run:
                    "$flags.sleeping=1;$WAIT_UNTIL_MORNING();$flags.sleeping=0;$stats.energy=$stats.energy_max*1.2",
                go: "return"
            },
            { text: "Save Game", run: "$SAVE()", go: "return" },
            { text: "Load Game", run: "$LOAD()", go: "return" },
            // {text:"* Grow Plants *",run:"$PLANTS_GROW()"},
            { text: "Back", go: "return" }
        ]
    },
    {
        id: "message",
        intro: [{ text: "{{$message}}" }],
        options: [{ text: "OK", run: "$message=''", go: "return" }]
    },
    {
        id: "eat",
        intro: [{ text: "What do you want to eat?" }],
        run: "$DEBUG('TYPE',$TYPE('cabbage'))",
        options: [
            {
                each:
                    "(v,k) in Object.entries($inventory).filter( (va)=>va[1] && $TYPE(va[0]) && $TYPE(va[0]).foodValue)",
                text: "{{$v[0]}} (you have {{$v[1]}})",
                run: "$STAT('energy',$TYPE($v[0]).foodValue);$INV($v[0],-1);$TURN(1)"
            },
            { text: "Nothing", go: "return" }
        ]
    },
    {
        id: "craft",
        intro: [{ text: "Craft {{$crafting_station||''}}" }],
        options: [
            {
                each: "(v,k) in $recipes",
                if:
                    "( ($v.workstation || $crafting_station) ?$crafting_station==$v.workstation : true ) && $v.ing.every(ing=>$INV(ing[0])>=ing[1])",
                text: "{{$v.name}}",
                run: "$CRAFT($v.name)"
            },
            { text: "Nothing", run: "$crafting_station=''", go: "return" }
        ]
    },
    {
        id: "farm",
        intro: [
            {
                text: `Your farm has {{$farm.length}} plots. Growing {{$farm.map($PLANT_STATUS).join(', ')}}`
            }
        ],
        options: [
            { text: `Plant`, if: "$farm.find(plot=>!plot.plant)", go: "plant" },
            { text: `Harvest`, if: "$farm.find($FINDER('stage',10))", go: "harvest" },
            { text: `Grow`, run: "$PLANTS_GROW()" },
            { text: `Back`, go: `return` }
        ]
    },

    {
        id: "plant",
        intro: [
            {
                text: `Currently planting {{$planting}} and you have {{$INV($planting)}}`,
                if: "$planting"
            },
            { text: `No seeds chosen.` }
        ],
        options: [
            { text: "Change seeds", go: "choose_planting" },
            {
                each: "(v,k) in  $farm",
                if: "!$v.plant && $INV($planting)",
                text: "Plant {{$planting}}",
                run: `$DEBUG($k);$DEBUG($v); 
                $PLANT($k,$planting); $TIRE(1); $TURN(1);$INV($planting,-1)`
            },
            { text: "Back", go: "return" }
        ]
    },
    {
        id: "choose_planting",
        intro: [
            {
                text: `Currently planting {{$planting}} and you have {{$INV($planting)}} `,
                if: "$planting"
            },
            { text: `No seeds chosen.` }
        ],
        options: [
            { text: "Nothing.", run: "$planting=null" },
            {
                each:
                    "(v,k) in Object.keys($inventory).filter(item=>item.includes('_seed'))",
                text: `You have {{$INV($v)}} of {{$v}}`,
                run: "$planting=$v",
                go: "return"
            },
            { text: "Back", go: "return" }
        ]
    },
    {
        id: "trade",
        run:
            "$trader=$npc.find($FINDER('name',$traderName));$DEBUG('tRa',$ITEM_TYPES($trader.sells))",
        intro: [
            { text: "Hello my name is {{$trader.name}} and I'd like to trade!" }
        ],
        options: [
            {
                each: "(v,k) in $ITEM_TYPES($trader.sells)",
                if: "$INV('money')>=$TYPE($v).price",
                text: "Buy 1 {{$v}} for {{$TYPE($v).price}} .",
                run:
                    "$INV($v,1);$INV('money',-$TYPE($v).price);$MSG('You bought 1 {{$v}}')"
            },

            {
                each: "(v,k) in $ITEM_TYPES($trader.buys)",
                if: "$INV($v)",
                text: "Sell 1 {{$v}} for {{$TYPE($v).price}}",
                run:
                    "$INV($v,-1);$INV('money',$TYPE($v).price);$MSG('You sold 1 {{$v}}')"
            },
            { text: "Back", go: "return" }
        ]
    },
    {
        id: "combat",
        run: "$DEBUG($opponent);$options=false;$DEBUG($options)",
        intro: [
            {
                text: "{{$message}} The fight is over!",
                if: "$combat_won||$combat_lost",
                run: "$message=''"
            },
            {
                text:
                    "{{$message}}You are fighting with {{$opponent.name}} that has {{$opponent.stats.energy}} energy",
                run: "$message=''"
            }
        ],
        options: [
            // {text:"You have won!",if:"$opponent.stats.energy<1",run:"$INV('money',$RND(10))",go:"return"},
            { text: "Attack!", if: "!$COMBAT_IS_FINISHED()", run: "$COMBAT_ROUND()" },
            { text: "Flee!", if: "!$COMBAT_IS_FINISHED()", go: "combat_flee" },
            // {text:"You are defeated :(",if:"$stats.energy<1",run:"$WAIT_UNTIL_MORNING();$stats.energy=($stats.energy_max/2)>>0",go:"village"},
            {
                text: "Great!",
                if: "$combat_won",
                run: "$combat_won=false;$combat_lost=false;$options=true",
                go: "return"
            },
            {
                text: "Oh well...",
                if: "$combat_lost",
                run: "$combat_won=false;$combat_lost=false;$options=true",
                go: "return"
            }
        ]
    },
    {
        id: "combat_flee",
        run: "$COMBAT_TRY_FLEE()",
        intro: [{ text: "You try to flee. {{$message}}  ", run: "$message=''" }],
        options: [{ text: "OK", go: "return" }]
    },

    {
        id: "harvest",
        intro: [{ text: `What you want to harvest?` }],
        options: [
            {
                each: "(v,k) in $farm",
                if: "$v.stage===10",
                text: "Harvest {{$v.plant}}",
                run: "$DEBUG($k);$HARVEST($k);$TIRE(2);$TURN(1)"
            },
            { text: "Back", go: "return" }
        ]
    },
    //     {
    // id:"start",
    // intro:[
    //     {text:"Jest"},
    // ],
    // options:[
    //     {text:"Ki"}
    // ]

    //     },
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
    },
    {
        id: "look-at-self",
        // run:"1 TURN",
        run: "$TURN(1)",

        intro: [
            {
                text: `You look {{ $stats.energy > 40 ?  "rested" : "tired"}}, no obvious damage. {{$flags.dirty ? "You are dirty." : "" }}`
            }
        ],
        options: [{ text: "Back", go: "return" }]
    },
    {
        id: "village",
        intro: [
            {
                text: `You are in the village. It doesn't look particularly big. {{$IS_DAY()?"There are some people around." : "Everyone gone inside for the night"}}`
            }
        ],
        options: [
            {
                text: `Talk to {{!$flags.met_bernie ? "an elderly man" : "Bernie"}} sitting on a bench on the green`,
                go: "talk_bernie",
                if: "!$flags.bartender_favor_bernie_finished"
            },
            {
                text: `Go to the pond.`,
                if: "$discovered.village.pond",
                run: "$TURN(1);$TIRE(1)",
                go: "pond"
            },
            {
                text: `Trade with the wondering trader`,
                if: "$IS_DAY() && $flags.village_trader",
                go: "village_trader"
            },
            { text: `Go to the inn.`, go: "inn" },
            { text: `Go to the shop.`, run: "$traderName='Zach'", go: "trade" },
            { text: `Go to your farm.`, if: "$flags.farm_obtained", go: "farm" },
            {
                text: `Go to the forest`,
                if: "$discovered.village.forest",
                run: "$TURN(1);$TIRE(1)",
                go: "forest"
            },
            {
                text: `Go to the caves`,
                if: "$discovered.village.caves",
                run: "$TURN(1);$TIRE(1)",
                go: "caves"
            },
            { text: `Go exploring`, run: "$EXPLORE($discovered.village);$TURN(12)" }
            // { text: "Back to the road", run:"2 TURN", go: "return" }
        ]
    },
    //BERNIE
    {
        id: "talk_bernie",
        run: "$flags.met_bernie++",
        intro: [
            {
                text: `"Hello again. How is it going? What can I do for you?" said Bernie`,
                if: "$flags.met_bernie > 1"
            },
            {
                text: `"Hi there. My name is Bernie. What can I do for you" said elderly man.`
            }
        ],
        options: [
            {
                text: "Can you tell me what is this place?",
                go: "bernie_what_is_this_place"
            },
            {
                text:
                    "The bartender says he is sorry and would like to go the the inn for a meal",
                if:
                    "$flags.bartender_favor_bernie_asked  & !$flags.bartender_favor_bernie_finished",
                go: "bernie_agrees"
            },
            { text: "Nothing, I'm leaving", go: "return" }
        ]
    },
    {
        id: "bernie_agrees",
        intro: [{ text: `"Ok. Free meal? I guess I can forgive him. Let's go!"` }],
        options: [
            { text: "OK.", go: "task_bartender_favor_bernie_finished" } ///?
            // { text: "Thanks.", go: "return" }
        ]
    },
    {
        id: "bernie_what_is_this_place",
        run: "$flags.citaa_remembered=1",
        intro: [
            {
                text: `'It's just a simple village.' we are the last stop before the sea port town of Oppa.
                   People usually go there if they need to get to Citaa, the capital'. You just remembered! You need to get to Citaa!`
            }
        ],
        options: [
            {
                text: "I just remembered! I need to to Citaa! How can I get there?",
                go: "bernie_how_citaa"
            },
            { text: "Thanks.", go: "return" }
        ]
    },
    {
        id: "bernie_how_citaa",
        intro: [
            {
                text:
                    "Well, the ships to Citaa leave every 12 days, and you can catch a carriage to Oppa every afternoon, the bartender knows the current price."
            }
        ],
        options: [{ text: "Thanks", go: "return" }]
    },
    // POND
    {
        id: "pond",
        intro: [{ text: "You find yourself by a pond." }],
        options: [
            {
                text: "Wash yourself.",
                if: "$flags.dirty",
                run: "$TURN(2);$flags.dirty=0"
            },
            { text: "Try to fish", go: "fishing" },
            { text: "Back to village", go: "village" }
        ]
    },

    {
        id: "fishing",
        run: `$TURN(2); $catch = $TEST_ROLL(50) ? 1 : 0; $INV('fish',$catch); $TIRE(2)`,
        intro: [
            { text: "You caught a fish!", if: "$catch" },
            { text: "Sorry, no bonus" }
        ],
        options: [{ text: "Back", go: "return" }]
    },
    // INN
    {
        id: "inn",
        intro: [
            { text: "You are in a small inn. There is a bartender at the bar." }
        ],
        options: [
            { text: "Talk to the bartender", go: "bartender_talk" },
            {
                text: "Talk to Bernie",
                go: "talk_bernie",
                if: "$flags.bartender_favor_bernie_finished"
            },
            { text: "Trade", run: "$traderName='Bartender'", go: "trade" },
            { text: "Talk to Elder", go: "elder_gives_farm" },
            { text: "Back to village", go: "village" }
        ]
    },
    {
        id: "bartender_talk",

        intro: [
            { text: `What can I do for you?`, if: "$flags.talked_to_bartender" },
            { text: `"Hello there. Who are you stranger?"` }
        ],
        options: [
            {
                text: "I don't remember.",
                run: "$flags.talked_to_bartender=1",
                if: "!$flags.talked_to_bartender"
            },
            {
                text: "Thats's not your business! Bye.",
                go: "return",
                run: "$flags.talked_to_bartender=1",
                if: "!$flags.talked_to_bartender"
            },
            {
                text: "How can I earn some money?",
                if: "$flags.talked_to_bartender",
                go: "bartender_money"
            },
            {
                text: "I would like to buy something.",
                if: "$flags.talked_to_bartender",
                go: "bartender_sells"
            },

            {
                text: "All I remember is need to get to Citaa.",
                if: "$flags.citaa_remembered",
                run: "$flags.talked_to_bartender=1",
                go: "bartender_talk_citaa"
            },
            { text: "Nothing", go: "return", if: "$flags.talked_to_bartender" }
        ]
    },
    {
        id: "bartender_talk_citaa",
        intro: [
            {
                text: `"I hope you have a lot of money. The ship fare costs 100 coins."`,
                if: "$flags.talked_to_bartender"
            }
        ],
        options: [{ text: "I understand.", go: "return" }]
    },
    {
        id: "bartender_money",
        run: "$flags.bartender_favor_bernie_asked=1",
        intro: [
            {
                text: `"I always can buy fish from you.{{!$flags.bartender_favor_bernie_finished ? "Go and tell Bernie I'm sorry, ask him to come here and you both will get free meal." : ""  }}"`
            }
        ],
        options: [
            {
                text: `Sell 1 fish`,
                if: "$INV('fish') > 0",
                run: "$INV('fish',-1);$INV('money',3)"
            },
            { text: "I understand.", go: "return" }
        ]
    },
    {
        id: "bartender_sells",
        intro: [{ text: `"I have meals for 5 gold."` }],
        options: [
            {
                text: `Buy 1 meal`,
                if: "$INV('money') > 4",
                run: "$INV('money',-5);$INV('meal',1)"
            },
            { text: "Thanks.", go: "return" }
        ]
    },
    {
        run: "$flags.bartender_favor_bernie_finished=1; $INV('meal',1)",
        id: "task_bartender_favor_bernie_finished",
        intro: [
            {
                text: `You both went to the inn. The Bartender says "Thanks for that! Meals for you!" and gives you a nice hot meal.`
            }
        ],
        options: [
            { text: "Thanks.", go: "inn" }
            // { text: "Thanks.", go: "return" }
        ]
    },
    {
        id: "elder_gives_farm",
        run: "$flags.farm_obtained=1",
        intro: [{ text: `You can use the abandoned farm. It's yours now.` }],
        options: [{ text: "Thanks.", go: "return" }]
    },
    {
        id: "forest",
        run: "$TEST_ROLL(($depth+1)*10) ? $COMBAT_START('goblin') : false",
        intro: [
            {
                text: `You are at the {{$depth}}. You are being attacked by {{$opponent.name}}`,
                if: "$combat_forced"
            },
            { text: `You are at the {{$depth}}.` }
        ],
        options: [
            {
                text: "Go deeper",
                run: "$depth++;$TURN(1);$TIRE(1)",
                if: "!$combat_forced",
                go: "forest"
            },
            {
                text: "Forage",
                run: "$FORAGE();",
                if: "!$combat_forced",
                go: "message"
            },
            {
                text: "Go back to the village",
                run: "$TURN(1);$TIRE(1)",
                if: "!$depth && !$combat_forced",
                go: "village"
            },
            {
                text: "Go back a bit",
                if: "$depth && !$combat_forced",
                run: "$depth--;$TURN(1);$TIRE(1)",
                go: "forest"
            },
            {
                text: "Fight!",
                if: "$combat_forced",
                run: "$combat_forced=false",
                go: "combat"
            }
        ]
    },
    {
        id: "village_trader",
        intro: [{ text: "Hello, I'm a Trader" }],
        options: [
            {
                text: "BYe",
                go: "return"
            }
        ]
    },
    {
        id: "caves",
        run: "$TEST_ROLL(($depth+1)*10) ? $COMBAT_START('goblin') : false",
        intro: [
            {
                text: `You are at the {{$depth}}. You are being attacked by {{$opponent.name}}`,
                if: "$combat_forced"
            },
            { text: `You are at the {{$depth}} of the caves.` }
        ],
        options: [
            {
                text: "Go deeper",
                run: "$depth++;$TURN(1);$TIRE(1)",
                if: "!$combat_forced",
                go: "caves"
            },
            { text: "Mine", run: "$MINE();", if: "!$combat_forced", go: "message" },
            {
                text: "Go back to the village",
                run: "$TURN(1);$TIRE(1)",
                if: "!$depth && !$combat_forced",
                go: "village"
            },
            {
                text: "Go back a bit",
                if: "$depth && !$combat_forced",
                run: "$depth--;$TURN(1);$TIRE(1)",
                go: "caves"
            },
            {
                text: "Fight!",
                if: "$combat_forced",
                run: "$combat_forced=false",
                go: "combat"
            }
        ]
    }
];
export default dialogs;