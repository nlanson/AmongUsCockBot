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
    counter: number; //Counts how many comments have been made.
    
    constructor(r: Snoowrap) {
        this.bot = r;
        this.counter = 0;
    }

    //Main CockBot Method
    async AutoCocksRoll() {
        console.log(`Starting AmongUsCockBot... (Command Mode)`);
        //this.swInboxMentions();
        this.newInboxStream();


        //Loop to create subsequent submission streams.
        // while (true) {
        //     await this.newSubmissionStream('copypasta', 100)
        // }

        //Try RSS Approach
        /*
            Set RSS and remeber latest post.
            Fetch RSS every 10 seconds and if the latest post has changed, do a loop to count how many new posts there are and for each post, do the COCK reply
        */
    }

    
    //Inbox stream method.
    //Will send cock to ever username mention BUT will send a cock to every historical username mention as well.
    async newInboxStream() {
        return new Promise((resolve) => {
            const inbox = new InboxStream(this.bot);

            inbox.on('item', (item) => {
                console.log(`Item Received: ${item.name}`);
                console.log(`    - ${item.body}`);
                
                //On Mention
                if (item.body == `u/AmongUsCockBot`) {
                    //Perform check to see if commend is unread or not.
                    
                    
                    console.log('    - Sending Cock...');
                    item.reply(cockString);
                    this.bot.markMessagesAsRead([item.name]); //mark message as read
                    console.log(`    - Fulfilled and marked as read.`)
                }

                //EMERGENCY STOP
                if( item.body == `!forcestop` ) {
                    console.log(`    - Force End.`);
                    this.bot.markMessagesAsRead([item.name]); //mark message as read
                    inbox.end(); //Fire end event.
                    console.log(`    - Successfully Closed.`);
                }
            });

            inbox.on('end', () => {
                resolve('End');
            })
        })
    }

    //Inbox Mention SnooWrap Method
    async swInboxMentions() {
        let inbox = this.bot.getInbox().then(() => {
            console.log('Inbox Loaded');
            console.log(inbox);
        });
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
        DOESNT WORK AS INTENDED
    */
    newSubmissionStream( subreddit: string, limit: number ) {
        return new Promise((resolve) => { 
            let i = 0; //Var for the limit resetter. When i == limit the promise will resolve itself.
            
            const submissions = new SubmissionStream(this.bot, { //Create new submission stream.
                subreddit: subreddit,
                limit: limit,
                pollTime: 10000,
              });

              submissions.on("item", (item) => {
                i++; //Increment counter on new submission for the limit reseter.
                this.counter++; //Increments counter to display how many cock comments have been made.

                item.reply(cockString); //Reply with cock string.
                console.log(`Comment #${i}`); //Log.
                
                //If the limit has been reached, fire the end event.
                if(i == limit) {
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
