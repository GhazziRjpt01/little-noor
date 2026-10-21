import { createServer } from 'node:http'

export const ORIGIN = 'http://localhost:5173'
export const PARENT_A = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
export const PARENT_B = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
export const CHILD_ID = '11111111-1111-4111-8111-111111111111'
export const TOKEN_A = 'parent-a-access-token-ok'
export const TOKEN_B = 'parent-b-access-token-ok'

export function listen(app) {
  const server = createServer(app)
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address()
      resolve({
        url: `http://127.0.0.1:${port}`,
        close() {
          return new Promise((done, reject) => {
            server.close((error) => (error ? reject(error) : done()))
          })
        },
      })
    })
  })
}

export async function send(url, path, { method = 'GET', token, body, origin = ORIGIN, contentType } = {}) {
  const headers = { Origin: origin }
  if (body !== undefined) headers['Content-Type'] = contentType ?? 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`${url}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  })
  const text = await response.text()
  let json = null
  try {
    json = JSON.parse(text)
  } catch {
    json = null
  }
  return { status: response.status, json, text, headers: response.headers }
}

export function fakeSupabase(query) {
  const calls = []

  function createClient({ accessToken } = {}) {
    return {
      accessToken,
      auth: {
        async getUser(token) {
          calls.push({ op: 'getUser', token })
          if (token === TOKEN_A) return { data: { user: { id: PARENT_A } }, error: null }
          if (token === TOKEN_B) return { data: { user: { id: PARENT_B } }, error: null }
          return { data: { user: null }, error: { message: 'invalid' } }
        },
        async signUp(input) {
          calls.push({
            op: 'signUp',
            email: input.email,
            displayName: input.options?.data?.display_name,
            parentalConsent: input.options?.data?.parental_consent,
          })
          return query.signUp(input)
        },
        async signInWithPassword(input) {
          calls.push({ op: 'signIn', email: input.email })
          return query.signIn(input)
        },
      },
      from(table) {
        const recorded = { table, accessToken, ops: [] }
        calls.push(recorded)
        const finish = () => query.query(recorded)
        const builder = {
          select(columns) {
            recorded.ops.push(['select', columns])
            return builder
          },
          eq(column, value) {
            recorded.ops.push(['eq', column, value])
            return builder
          },
          insert(row) {
            recorded.ops.push(['insert', row])
            return builder
          },
          delete() {
            recorded.ops.push(['delete'])
            return builder
          },
          upsert(row, options) {
            recorded.ops.push(['upsert', row, options])
            return builder
          },
          maybeSingle() {
            recorded.ops.push(['maybeSingle'])
            return finish()
          },
          single() {
            recorded.ops.push(['single'])
            return finish()
          },
          then(resolve, reject) {
            return Promise.resolve(finish()).then(resolve, reject)
          },
        }
        return builder
      },
    }
  }

  return { createClient, calls }
}
