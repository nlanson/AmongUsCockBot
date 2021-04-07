//Packages
import Snoowrap from 'snoowrap';
import { InboxStream, CommentStream, SubmissionStream } from "snoostorm";
import { botCredentials } from './cockBot.interface'; 

//Options
const creds: botCredentials = require("./credentials.json");
const r: Snoowrap = new Snoowrap(creds);
const cockString: string = '⠀⠀‎‎‎‎‎ ‎‎‎‎‎ ‎‎‎‎‎ ‎‎‎‎‎ ‎‎‎‎‎ ‎‎‎‎‎‎‎ ‎‎‎‎‎ ‎‎‎‎‎ ‎‎‎‎‎ ‎‎‎‎‎⠀⣠⣤⣤⣤⣤⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⠀⠀⠀⢰⡿⠋⠁⠀⠀⠈⠉⠙⠻⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⠀⠀⢀⣿⠇⠀⢀⣴⣶⡾⠿⠿⠿⢿⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⣀⣀⣸⡿⠀⠀⢸⣿⣇⠀⠀⠀⠀⠀⠀⠙⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⣾⡟⠛⣿⡇⠀⠀⢸⣿⣿⣷⣤⣤⣤⣤⣶⣶⣿⠇⠀⠀⠀⠀⠀⠀⠀⣀⠀⠀ ⢀⣿⠀⢀⣿⡇⠀⠀⠀⠻⢿⣿⣿⣿⣿⣿⠿⣿⡏⠀⠀⠀⠀⢴⣶⣶⣿⣿⣿⣆ ⢸⣿⠀⢸⣿⡇⠀⠀⠀⠀⠀⠈⠉⠁⠀⠀⠀⣿⡇⣀⣠⣴⣾⣮⣝⠿⠿⠿⣻⡟ ⢸⣿⠀⠘⣿⡇⠀⠀⠀⠀⠀⠀⠀⣠⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠁⠉⠀ ⠸⣿⠀⠀⣿⡇⠀⠀⠀⠀⠀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠉⠀⠀⠀⠀ ⠀⠻⣷⣶⣿⣇⠀⠀⠀⢠⣼⣿⣿⣿⣿⣿⣿⣿⣛⣛⣻⠉⠁⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⠀⠀⢸⣿⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀ ⠀⠀ ⠀⠀⠀⠀⢸⣿⣀⣀⣀⣼⡿⢿⣿⣿⣿⣿⣿⡿⣿⣿⣿'

class Bot {
    bot: Snoowrap;
    startTime: number = Date.now()/1000;
    
    constructor(r: Snoowrap) {
        this.bot = r;
    }

    //Main CockBot Method
    async AutoCocksRoll() {
        console.log(`Starting AmongUsCockBot... (Mention Mode)`);
        this.newInboxStream();


        //Loop to create subsequent submission streams.
        // while (true) {
        //     await this.newSubmissionStream('copypasta', 100)
        // }
    }

    
    //Will send cock to every username mention.
    async newInboxStream() {
        return new Promise( ( resolve ) => {
            const inbox = new InboxStream(this.bot);

            inbox.on( 'item', (item) => {
                let itemText = item.body.toLowerCase();
                
                //On Mention
                if ( itemText.includes('u/amonguscockbot') ) {
                    //If the message was received after start time, send the cock.
                    if(item.created_utc >= this.startTime) {
                        console.log(`Cock requested on r/${item.subreddit.display_name}`);
                        console.log(`    - ${item.body}`);
                        console.log('    - Sending Cock...');
                        item.reply(cockString);
                        console.log(`    - Fulfilled.`);
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
            text: cockString
        }).then(() => {
            console.log('Posted');
        });
    }

    //Submission Stream
    /*
        DOESNT WORK YET
        
        Currently it will reply to new submissions but since every new submission has a creation
        time newer than the bot start time it will endlessly send the cock to every new submission.
    */
    newSubmissionStream( subreddit: string, limit: number ) {
        return new Promise((resolve) => { 
            let i = 0; //Var for the limit resetter. When i == limit the promise will resolve itself.
            
            const submissions = new SubmissionStream(this.bot, { //Create new submission stream.
                subreddit: subreddit,
                limit: limit,
                pollTime: 10000,
            });

            submissions.on( "item", ( item ) => {
                i++; //Increment counter on new submission for the limit reseter.
                if ( item.created_utc >= this.startTime ) {
                    console.log(`New Submission: ${item.title}`);
                    console.log('    - Sending Cock...');
                    //item.reply(cockString);
                    console.log(`    - Fulfilled.`);
                }

                //Limit checker to resolve the stream and recall.
                //If the limit has been reached, fire the end event.
                if ( i == limit ) {
                    submissions.end();
                }
            });

            //Resolve on end.
            submissions.on('end', () => {
                resolve(i);
            });
        });
    }

}


let cockBot = new Bot(r);
cockBot.AutoCocksRoll();
