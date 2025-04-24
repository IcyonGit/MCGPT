require('dotenv').config()
const mineflayer = require('mineflayer')
const { OpenAI }  = require('openai')

const {
  MINECRAFT_HOST,
  MINECRAFT_PORT,
  MC_USERNAME,
  MC_PASSWORD,
  MC_AUTH,
  OPENAI_API_KEY,
  OPENAI_MODEL,
  COMMAND_PREFIX,
  MC_VERSION
} = process.env

const openai = new OpenAI({ apiKey: OPENAI_API_KEY })

console.log('Connecting with version:', MC_VERSION)

const bot = mineflayer.createBot({
  host:           MINECRAFT_HOST,
  port:           parseInt(MINECRAFT_PORT, 10),
  username:       MC_USERNAME,
  password:       MC_PASSWORD,
  auth:           MC_AUTH,
  version:        MC_VERSION,
  skipValidation: true
})

bot.on('login', () => {
  console.log(`Logged in as ${bot.username}`)
})

// listen for chat commands
bot.on('chat', async (username, message) => {
  if (username === bot.username) return
  if (!message.startsWith(COMMAND_PREFIX)) return

  const prompt = message.slice(COMMAND_PREFIX.length).trim()
  if (!prompt) return

  try {
    // GPT-4o call (v4 client)
    const res = await openai.chat.completions.create({
      model:    OPENAI_MODEL,
      messages: [
        { role: 'system', content: 'You are a helpful Minecraft guide.' },
        { role: 'user',   content: prompt }
      ]
    })
    const reply = res.choices[0].message.content.trim()
    bot.chat(reply)

  } catch (err) {
    console.error('OpenAI error:', err)
    bot.chat('Sorry, I hit an error fetching from OpenAI.')
  }
})
