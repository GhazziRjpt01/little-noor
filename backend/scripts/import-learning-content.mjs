import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import { readConfig } from '../src/config.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const sqlPath = join(root, 'backend/supabase/seed/learning_content.sql')
const sql = readFileSync(sqlPath, 'utf8')
const inserts = (sql.match(/^insert into public\.learning_content/gm) || []).length
const config = readConfig(process.env)

function hostOf(value) {
  try {
    return new URL(value).host
  } catch {
    return ''
  }
}

const host = hostOf(config.supabaseUrl)
const placeholder = !config.supabaseConfigured || host.toLowerCase().includes('your_project_ref')

console.log(JSON.stringify({
  seedStatements: inserts,
  supabaseConfigured: config.supabaseConfigured,
  placeholderUrl: placeholder,
}))

if (placeholder) {
  console.log('Import did not run. SUPABASE_URL is still the example placeholder.')
  console.log('1. In Supabase, open Project Settings → API.')
  console.log('2. Put the real project URL in backend/.env as SUPABASE_URL and in frontend/.env as VITE_SUPABASE_URL.')
  console.log('3. Put the anon key in SUPABASE_ANON_KEY and VITE_SUPABASE_ANON_KEY. Do not put the service-role key in either file.')
  console.log('4. Run backend/supabase/migrations/20261020120000_profiles_children_progress.sql if those tables are not there yet.')
  console.log('5. Run backend/supabase/migrations/20261020150000_learning_content.sql in the SQL editor.')
  console.log('6. Run backend/supabase/seed/learning_content.sql in the SQL editor. It inserts draft rows and does not change a row you have already marked verified.')
  console.log('The anon key cannot insert these rows. Row Level Security allows only reading verified content.')
  process.exit(2)
}

const client = createClient(config.supabaseUrl, config.supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})
const { count, error } = await client.from('learning_content').select('id', { count: 'exact', head: true })
const safeMessage = String(error?.message ?? '').replace(/https?:\/\/\S+/g, '[url]').slice(0, 180)
console.log(JSON.stringify({
  imported: 0,
  readableVerifiedRows: count,
  errorCode: error?.code ?? null,
  errorMessage: safeMessage,
}))
console.log('No rows were written. This script does not use a service-role key and does not weaken Row Level Security.')
process.exit(2)
