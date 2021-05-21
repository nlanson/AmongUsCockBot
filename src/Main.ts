//Packages
import Snoowrap from 'snoowrap';

import { Bot } from './Bot';
import { botCredentials, cockList } from './bot.interfaces';


class Main {
    creds: botCredentials;
    c: cockList;
    
    constructor(c: string) {
        this.creds = this.setCreds();
        console.log(this.creds);

        this.c = require(c);
    }
    
    /**Assign Bot Login Credentials */
    private setCreds() {
        if (
            process.env.username &&
            process.env.password &&
            process.env.userAgent &&
            process.env.clientId &&
            process.env.clientSecret
        ) {
            console.log('Environment Creds Detected');
            let a: botCredentials = {
                username: process.env.username,
                password: process.env.password,
                userAgent: process.env.userAgent,
                clientId: process.env.clientId,
                clientSecret:process.env.clientSecret
            };
            return a;
        } else {
            console.log(`Environment Creds are not specified. Using backup...`);
            return require("../common/credentials.json"); //Backup credentials
        }
    }

    public init() {
        const r: Snoowrap = new Snoowrap(this.creds);
        let bot: Bot = new Bot(this.creds, r, this.c); //Create new Bot Instance
        bot.AutoCocksRoll();
    }
}

let a = new Main('../common/cocks.json');
a.init();
