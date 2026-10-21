export function healthHandler(config) {
  return function health(_req, res) {
    res.json({
      status: 'ok',
      service: 'little-noor-api',
      supabase: {
        env: config.supabaseConfigured ? 'present' : 'missing',
        checked: false,
      },
      openai: {
        env: config.openaiConfigured ? 'present' : 'missing',
        checked: false,
      },
    })
  }
}
