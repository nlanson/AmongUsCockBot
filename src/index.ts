//Packages
import Snoowrap from 'snoowrap';
import { InboxStream } from "snoostorm";
import { botCredentials, cockList } from './bot.interfaces'; 

//Options
let creds: botCredentials;
//Determine whether to use ENV defined BotAccount or fallback account
if (
    process.env.username &&
    process.env.password &&
    process.env.userAgent &&
    process.env.clientId &&
    process.env.clientSecret
) {
    console.log('Environment Creds Detected');
    creds = {
        username: process.env.username,
        password: process.env.password,
        userAgent: process.env.userAgent,
        clientId: process.env.clientId,
        clientSecret:process.env.clientSecret
    };
} else {
    console.log(`Environment Creds are not specified. Using backup...`);
    creds = require("./credentials.json"); //Backup credentials
}

console.log(creds);
const c: cockList = require("./cocks.json");
const r: Snoowrap = new Snoowrap(creds);
//List of subreddits the bot is allowed to post in.
const allowedSubreddits: Array<string> = [
    "copypasta",
    "amogus"
];

class Bot {
    bot: Snoowrap;
    startTime: number = Date.now()/1000;
    
    constructor(r: Snoowrap) {
        this.bot = r;
    }

    //Main CockBot Method
    public async AutoCocksRoll() {
        console.log(`Starting AmongUsCockBot...`);
        this.newInboxStream();
    }

    
    //Will send cock to every username mention.
    private async newInboxStream() {
        return new Promise( ( resolve ) => {
            const inbox = new InboxStream(this.bot);

            inbox.on( 'item', (item) => {
                let itemText = item.body.toLowerCase();
                
                //On Mention
                if ( itemText.includes('u/'+creds.username.toLowerCase()) ) {
                    //Check if bot can send to this subreddit
                    let send: boolean = false;
                    for(let i=0; i<allowedSubreddits.length; i++) {
                        if (item.subreddit.display_name.toLowerCase() == allowedSubreddits[i]){
                            send = true
                        }
                    }
                    
                    //Time check and send check
                    if( item.created_utc >= this.startTime && send == true) { 
                        console.log(`Cock requested on r/${item.subreddit.display_name}`);
                        console.log(`    - ${item.body}`);
                        
                        let selection: number = Math.floor(Math.random() * 3); //Change here to reflect how many ASCII art options there are.
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
                    } else if (send == false){
                        console.log(`Cannot send to r/${item.subreddit.display_name}`);
                    }
                }
            });

            inbox.on( 'end', () => {
                resolve('End');
            });
        })
    }

}


let cockBot: Bot = new Bot(r);
cockBot.AutoCocksRoll();

