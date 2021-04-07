//Packages
import Snoowrap from 'snoowrap';
import { InboxStream, CommentStream, SubmissionStream } from "snoostorm";
import { botCredentials, cockList } from './bot.interfaces'; 

//Options
const creds: botCredentials = require("./credentials.json");
const c: cockList = require("./cocks.json");
const r: Snoowrap = new Snoowrap(creds);

class Bot {
    bot: Snoowrap;
    startTime: number = Date.now()/1000;
    
    constructor(r: Snoowrap) {
        this.bot = r;
    }

    //Main CockBot Method
    async AutoCocksRoll() {
        console.log(`Starting AmongUsCockBot...`);
        this.newInboxStream();
    }

    
    //Will send cock to every username mention.
    async newInboxStream() {
        return new Promise( ( resolve ) => {
            const inbox = new InboxStream(this.bot);

            inbox.on( 'item', (item) => {
                let itemText = item.body.toLowerCase();
                
                //On Mention
                if ( itemText.includes('u/amonguscockbot') ) {
                    //Time check to not send a cock to every historical mention.
                    if(item.created_utc >= this.startTime) {
                        console.log(`Cock requested on r/${item.subreddit.display_name}`);
                        console.log(`    - ${item.body}`);
                        
                        let selection: number = Math.floor(Math.random() * 3);
                        console.log(`    - Sending Cock #${selection+1}`);
                        item.reply(c.cocks[selection])
                        .then(() => {
                            console.log(`    - Fulfilled`);
                        })
                        .catch((res: any) => {
                            let e: any = JSON.parse(JSON.stringify(res));

                            if ( e.error ) {
                                //Check error reason and send PM if bot is banned from subreddit.
                                if ( e.error.message == 'Forbidden' ) {
                                    console.log(`    - Delivery failed as bot is banned from r/${item.subreddit.display_name}. Sending PM instead...`);
                                    //Send PM with Cock.
                                    this.bot.composeMessage({
                                        to: item.author,
                                        subject: "AmongUsCock",
                                        text: c.cocks[selection]
                                    })
                                    .then(() => console.log(`    - PM Delivered.`))
                                    .catch((e) => console.log(`    - PM Failed.`));
                                } else {
                                    console.log(`    - Delivery Failed.`);
                                }
                            }
                        });
                    }
                }
            });

            inbox.on( 'end', () => {
                resolve('End');
            });
        })
    }

    //Creates a post in r/copypasta with the amongus cock
    postCock(title: string) {
        r.submitSelfpost({
            subredditName: 'copypasta',
            title: title,
            text: c.cocks[0]
        }).then(() => {
            console.log('Posted');
        });
    }

}


let cockBot: Bot = new Bot(r);
cockBot.AutoCocksRoll();
