# MCGPT

A standalone Minecraft "player" bot that logs into an online-mode server, listens for chat commands, and replies using OpenAI’s API.

## Features
- Logs in with a real Microsoft/Mojang account  
- Not a mod and can be run on a seperate machine. 
- Uses `!gpt <your question>` in chat to trigger GPT-4o responses  
- Easy to configure via a `.env` file  

## Prerequisites
- Node.js 18+ (tested on v20 and v22)  
- A Microsoft account for the bot (the account you use must have a valid Minecraft license)
- OpenAI API key with access to GPT-4o or model of your choosing 
- A Minecraft server, running the most recent version.
    - Although it's not required, I STRONGLY recommend installing <a href="https://viaversion.com/">ViaVersion and ViaBackwards</a>,<br>
      as MineFlayer(Node.js Minecraft Client)does not update frequently, which may cause issues.

## Installation 
  The easiest way to test this script is with <a href="https://github.com/codespaces">GitHub Codespaces.</a>

1. Clone the `mc-gptbot` folder onto your machine, then CD into the folder
    ```bash
    git clone https://github.com/IcyonGit/MCGPT.git
    cd MCGPT
   ```
     
2. In the `MCGPT` folder root run:  
   ```bash
   npm install
   ```

## Configuration
1. In the `MCGPT` root, edit the file called `.env`
   It should look like this
   ```.env
   MINECRAFT_HOST=your.server.ip
   MINECRAFT_PORT=25565

   MC_AUTH=microsoft
   MC_USERNAME=you@example.com
   MC_PASSWORD=your_mc_password

   MC_VERSION=1.21.4
   PROTOCOL_VERSION=769

   OPENAI_API_KEY=sk-your_openai_key
   OPENAI_MODEL=gpt-4o
   COMMAND_PREFIX=!gpt
   ```

- If you are using ViaVersion + ViaBackwardes, `MC_VERSION` and `PROTOCOL_VERSION` must match the bot’s client side version (1.21.4 → 769)  
- `COMMAND_PREFIX` is the chat prefix that triggers the bot. Feel free to edit it. 

## Running the Bot
From the project root:

```bash
npm start
```

You should see:

```
Connecting with version: 1.21.4 protocol: 769
Logged in as <your Minecraft username>
```

If you do, your bot is online and ready.

## Usage
In chat on your server, type:

```
!gpt How do I enchant a diamond sword?
```

The bot will respond:

```
[GPT] To enchant a diamond sword, first build an enchantment table...
```

## Troubleshooting
- Bot won’t connect or version mismatch  
  - Verify your server runs on the   
  - Make sure `MC_VERSION=1.21.4` and `PROTOCOL_VERSION=769` in `.env`  
- PartialReadError appears  
  - Those errors should be automatically silenced by the bot. You can ignore them if any come up.
- OpenAI errors  
  - Double-check your `OPENAI_API_KEY` is valid and loaded  
  - Test with:
  ```bash
  curl https://api.openai.com/v1/models \
    -H "Authorization: Bearer $OPENAI_API_KEY"
  ```

## Customization
- Change the system prompt in `bot.js` to tailor GPT’s behavior  
- Modify `skipValidation` or remove it once official 1.21.5 support is released  
- Add rate-limiting, command permissions, or private replies using `bot.whisper()`  

## License
This project is released under the MIT License.
