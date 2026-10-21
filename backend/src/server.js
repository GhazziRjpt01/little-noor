import dotenv from 'dotenv'
import { createApp } from './app.js'
import { assertProductionOrigin, readConfig } from './config.js'
import { createLogger } from './logger.js'
import { createSupabaseFactory } from './supabase.js'

dotenv.config()

const config = readConfig(process.env)

try {
  assertProductionOrigin(process.env)
} catch (error) {
  console.error(error.message)
  process.exit(1)
}

const app = createApp({
  config,
  logger: createLogger(),
  createClient: createSupabaseFactory(config),
})

const server = app.listen(config.port, () => {
  console.log(JSON.stringify({
    level: 'info',
    event: 'listening',
    port: config.port,
    supabaseEnv: config.supabaseConfigured ? 'present' : 'missing',
    openaiEnv: config.openaiConfigured ? 'present' : 'missing',
  }))
})

server.on('error', (error) => {
  console.error(error.message)
  process.exit(1)
})
