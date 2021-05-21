//Packages
import Snoowrap from 'snoowrap';
import { InboxStream } from "snoostorm";

//Internal Packages
import { botCredentials, cockList } from './bot.interfaces'; 


export class Bot {
    credentials: botCredentials;
    c: cockList;
    bot: Snoowrap;
    startTime: number = Date.now()/1000;
    
    constructor(
        creds: botCredentials,
        r: Snoowrap, 
        c: cockList
    ) {
        this.credentials = creds;
        this.c = c;
        this.bot = r;
    }

    //Main CockBot Method
    public async AutoCocksRoll() {
        console.log(`Starting ASCII Bot...`);
        this.newInboxStream();
    }

    
    //Will send cock to every username mention.
    private async newInboxStream() {
        return new Promise( ( resolve ) => {
            const inbox = new InboxStream(this.bot);

            inbox.on( 'item', (item) => {
                let itemText = item.body.toLowerCase();
                
                //On Mention
                if ( itemText.includes('u/'+this.credentials.username.toLowerCase()) ) {
                    
                    //Time check and send check
                    if( item.created_utc >= this.startTime ) { 
                        console.log(`Cock requested on r/${item.subreddit.display_name}`);
                        console.log(`    - ${item.body}`);
                        
                        let selection: number = Math.floor(Math.random() * this.c.cocks.length+1); //Change here to reflect how many ASCII art options there are.
                        console.log(`    - Sending Cock #${selection+1}`);
                        item.reply(this.c.cocks[selection])
                        .then(() => {
                            console.log(`    - Fulfilled`);
                        })
                        .catch((res: any) => {
                            let e: any = JSON.parse(JSON.stringify(res));

                            if ( e.error ) {
                                //Check error reason and send PM if bot is banned from subreddit.
                                if ( e.error.message == 'Forbidden' ) {
                                    console.log(`    - Delivery failed as bot is banned from r/${item.subreddit.display_name}.`);
                                    //Send PM with Cock.
                                    this.bot.composeMessage({
                                        to: item.author,
                                        subject: "AmongUsCock",
                                        text: this.c.cocks[selection]
                                    })
                                    .then(() => console.log(`    - PM Delivered.`))
                                    .catch((e) => console.log(`    - PM Failed.`));
                                } else {
                                    console.log(`    - Delivery Failed due to unforeseen circumstances`);
                                }
                            }
                        });
                    } else {

                    }
                }
            });

            inbox.on( 'end', () => {
                resolve('End');
            });
        })
    }

}




