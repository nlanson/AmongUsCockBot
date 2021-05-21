"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Packages
var snoowrap_1 = __importDefault(require("snoowrap"));
var snoostorm_1 = require("snoostorm");
//Options
var creds;
//Determine whether to use ENV defined BotAccount or fallback account
if (process.env.username &&
    process.env.password &&
    process.env.userAgent &&
    process.env.clientId &&
    process.env.clientSecret) {
    console.log('Environment Creds Detected');
    creds = {
        username: process.env.username,
        password: process.env.password,
        userAgent: process.env.userAgent,
        clientId: process.env.clientId,
        clientSecret: process.env.clientSecret
    };
}
else {
    console.log("Environment Creds are not specified. Using backup...");
    creds = require("./credentials.json"); //Backup credentials
}
console.log(creds);
var c = require("./cocks.json");
var r = new snoowrap_1.default(creds);
//List of subreddits the bot is allowed to post in.
var allowedSubreddits = [
    "copypasta"
];
var Bot = /** @class */ (function () {
    function Bot(r) {
        this.startTime = Date.now() / 1000;
        this.bot = r;
    }
    //Main CockBot Method
    Bot.prototype.AutoCocksRoll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("Starting AmongUsCockBot...");
                this.newInboxStream();
                return [2 /*return*/];
            });
        });
    };
    //Will send cock to every username mention.
    Bot.prototype.newInboxStream = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        var inbox = new snoostorm_1.InboxStream(_this.bot);
                        inbox.on('item', function (item) {
                            var itemText = item.body.toLowerCase();
                            //On Mention
                            if (itemText.includes('u/' + creds.username.toLowerCase())) {
                                //Check if bot can send to this subreddit
                                var send = false;
                                for (var i = 0; i < allowedSubreddits.length; i++) {
                                    if (item.subreddit.display_name.toLowerCase() == allowedSubreddits[i]) {
                                        send = true;
                                    }
                                }
                                //Time check and send check
                                if (item.created_utc >= _this.startTime && send == true) {
                                    console.log("Cock requested on r/" + item.subreddit.display_name);
                                    console.log("    - " + item.body);
                                    var selection_1 = Math.floor(Math.random() * 3); //Change here to reflect how many ASCII art options there are.
                                    console.log("    - Sending Cock #" + (selection_1 + 1));
                                    item.reply(c.cocks[selection_1])
                                        .then(function () {
                                        console.log("    - Fulfilled");
                                    })
                                        .catch(function (res) {
                                        var e = JSON.parse(JSON.stringify(res));
                                        if (e.error) {
                                            //Check error reason and send PM if bot is banned from subreddit.
                                            if (e.error.message == 'Forbidden') {
                                                console.log("    - Delivery failed as bot is banned from r/" + item.subreddit.display_name + ". Sending PM instead...");
                                                //Send PM with Cock.
                                                _this.bot.composeMessage({
                                                    to: item.author,
                                                    subject: "AmongUsCock",
                                                    text: c.cocks[selection_1]
                                                })
                                                    .then(function () { return console.log("    - PM Delivered."); })
                                                    .catch(function (e) { return console.log("    - PM Failed."); });
                                            }
                                            else {
                                                console.log("    - Delivery Failed.");
                                            }
                                        }
                                    });
                                }
                                else if (send == false) {
                                    console.log("Cannot send to r/" + item.subreddit.display_name);
                                }
                            }
                        });
                        inbox.on('end', function () {
                            resolve('End');
                        });
                    })];
            });
        });
    };
    return Bot;
}());
var cockBot = new Bot(r);
cockBot.AutoCocksRoll();
