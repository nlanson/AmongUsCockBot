# Bot Template
This branch shall serve as a template for future cock and ASCII art bots.

## Customisation
In [`index.ts`](./src/index.ts), you can customise the following:
- Subreddits the bot works in
- And other behaviour to configure when and where the bot replies

In [`cocks.json`](./src/cocks.json), you can customise the ASCII art that a bot can send.\
Dont forget if you add more ASCII art you will need to update the random selection in `index.ts`.

## Running
Steps to run the bot:
1. Compile the code using the Typescript Compiler.
2. Create `credentials.json` file in the compilation output folder (`./dist` by default) and fill it with your bot account credentials. (See [`bot.interface.ts`](./src/bot.interface.ts) for the structure of the json file and what it should implement)
3. Build a docker image using the provided Dockerfile. eg. `docker build -t yourUsername/ASCIIBot:latest`
4. Run the docker image using Docker-Compose and enter in the bot account credentials as part of environment variables. (See [/test/](./test) for example).