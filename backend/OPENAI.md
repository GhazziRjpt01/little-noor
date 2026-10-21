# Connect OpenAI

The API calls OpenAI from this server only. The browser never receives the key. A missing key does not stop the rest of the API: chat and speech then return `openai_not_configured`.

`GET /api/health` reports `openai.env` as `present` or `missing`, and `openai.checked: false`. That means the process can see `OPENAI_API_KEY`. It does not mean OpenAI was contacted.

## 1. Store the key

1. Create a secret key in the OpenAI dashboard for this project.
2. Copy `backend/.env.example` to `backend/.env` if that file is not there yet.
3. Set `OPENAI_API_KEY` in `backend/.env` to that secret.
4. Leave the model, voice, and timeout lines as they are unless you need a different one. Allowed voices are `alloy`, `ash`, `ballad`, `coral`, `echo`, `fable`, `nova`, `onyx`, `sage`, `shimmer`, and `verse`. Anything else falls back to `nova`.
5. Do not put the key in `frontend/.env`, a `VITE_` variable, source code, or git. `backend/.env` is ignored by git.

Restart the API after changing `.env`:

```powershell
cd "D:\AI ML Projects\little-noor\backend"
npm run dev
```

The startup line includes `openaiEnv` as `present` or `missing`. It does not include the key.

## 2. What the endpoints do

`POST /api/ai/chat` with `{ "message", "language" }` (`en`, `ur`, or `ar`):

1. Moderates the child's message.
2. If moderation flags it, responds `422` with `moderation_blocked` and does not send the message to the chat model.
3. Otherwise asks the chat model with a fixed system prompt: simple words for ages 3–10, no invented Quranic verses, duas, or hadith, and quotations only from verified lesson fields. If the model is unsure it is told to say exactly `Please ask your parents or teacher.`
4. Speaks that same reply in `OPENAI_TEACHER_VOICE` (default `coral`) with a warm, slow, playful delivery for ages 3–10. The audio is returned on the chat response. If the voice fails, the text reply is still returned.

`POST /api/ai/greeting` with `{ "language" }` speaks only the fixed greeting for `en`, `ur`, or `ar`. It does not speak a sentence sent by the browser.

`POST /api/ai/tts` with `{ "lessonId", "field" }`. `field` is `arabic`, `transliteration`, `en`, or `ur`.

- The text is read from the Kalima and Azkar files. A field is approved only when that item has `verified: true` and the field is not `TO_BE_PROVIDED`.
- If that lesson has an `https://` `audioUrl`, the response is `source: "recorded"` and OpenAI is not called.
- Otherwise the approved text is sent to speech with `OPENAI_TTS_VOICE` (default `nova`) and the response is `source: "ai"` with the label `AI-generated voice. It may not follow Tajweed perfectly.` Lesson speech stays separate from the teacher's chat voice.
- The request cannot supply its own sentence. A `text` field on the body is ignored.

Chat is limited to 20 requests per 15 minutes. Speech is limited to 8 requests per 15 minutes. Both also count toward the global limit. The child's message, the reply, and the spoken text are not written to the logs.

## 3. Test without spending a call

From `backend`, the automated tests use a stand-in client. They do not call OpenAI:

```powershell
npm test
```

With the server running and no key, a real question should come back as not configured. The response must not contain the question:

```powershell
$base = 'http://localhost:5000'
$headers = @{ 'Content-Type' = 'application/json' }
try {
  Invoke-WebRequest -Method Post -Uri "$base/api/ai/chat" -Headers $headers -Body '{"message":"How can I be kind today?","language":"en"}'
} catch {
  $_.Exception.Response.StatusCode.value__
  $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
  $reader.ReadToEnd()
}
```

Expect HTTP 503 and `"code":"openai_not_configured"`.

An unapproved lesson must not produce audio:

```powershell
try {
  Invoke-WebRequest -Method Post -Uri "$base/api/ai/tts" -Headers $headers -Body '{"lessonId":"kalima-1","field":"arabic"}'
} catch {
  $_.Exception.Response.StatusCode.value__
  $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
  $reader.ReadToEnd()
}
```

Expect HTTP 404 and `"code":"lesson_not_approved"`. The current Kalima and Azkar files are placeholders, so this is the expected result until a scholar verifies an item.

## 4. Test with the key

Set the key, restart, and confirm health:

```powershell
Invoke-RestMethod -Uri "$base/api/health"
```

`openai.env` should be `present` and `openai.checked` should be `false`.

```powershell
Invoke-RestMethod -Method Post -Uri "$base/api/ai/chat" -Headers $headers -Body '{"message":"How can I be kind today?","language":"en"}'
```

A successful body is `{ "reply": "..." }`. There is no verified quotation in the dataset yet, so a request for a verse, dua, or hadith should come back as `Please ask your parents or teacher.`

To hear recorded audio instead of a generated voice, set that lesson's `audioUrl` to an `https://` file and `verified` to `true`. Speech then returns `source: "recorded"` even if the OpenAI key is missing.

To generate a voice, a scholar first replaces `TO_BE_PROVIDED`, sets `verified` to `true`, and leaves `audioUrl` null. Then:

```powershell
Invoke-RestMethod -Method Post -Uri "$base/api/ai/tts" -Headers $headers -Body '{"lessonId":"kalima-1","field":"en"}'
```

Expect `source` `ai` and the label `AI-generated voice. It may not follow Tajweed perfectly.` Do not mark an item verified before that review.
