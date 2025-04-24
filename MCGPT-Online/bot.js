// bot.js
require('dotenv').config()

// swallow PartialReadError at the source
const origConsoleError = console.error
console.error = (...args) => {
  if (args[0] && args[0].name === 'PartialReadError') return
  return origConsoleError.apply(console, args)
}

// catch any uncaught PartialReadError
process.on('uncaughtException', err => {
  if (err.name === 'PartialReadError') return
  console.error('Uncaught exception:', err)
})
process.on('unhandledRejection', reason => {
  if (reason && reason.name === 'PartialReadError') return
  console.error('Unhandled rejection:', reason)
})

const mineflayer = require('mineflayer')
const { OpenAI }  = require('openai')

const {
  MINECRAFT_HOST,
  MINECRAFT_PORT,
  MC_USERNAME,
  MC_PASSWORD,
  MC_AUTH,
  MC_VERSION,
  PROTOCOL_VERSION,
  OPENAI_API_KEY,
  OPENAI_MODEL,
  COMMAND_PREFIX
} = process.env

console.log('Connecting with version:', MC_VERSION, 'protocol:', PROTOCOL_VERSION)

const openai = new OpenAI({ apiKey: OPENAI_API_KEY })

const bot = mineflayer.createBot({
  host:            MINECRAFT_HOST,
  port:            parseInt(MINECRAFT_PORT, 10),
  username:        MC_USERNAME,
  password:        MC_PASSWORD,
  auth:            MC_AUTH,
  version:         MC_VERSION,
  protocolVersion: parseInt(PROTOCOL_VERSION, 10),
  skipValidation:  true
})

bot.on('login', () => {
  console.log(`Logged in as ${bot.username}`)
})

bot.on('chat', async (username, message) => {
  if (username === bot.username) return
  if (!message.startsWith(COMMAND_PREFIX)) return

  const prompt = message.slice(COMMAND_PREFIX.length).trim()
  if (!prompt) return

  try {
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
    bot.chat('Sorry, I hit an error fetching from OpenAI')
  }
})
