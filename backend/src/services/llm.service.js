import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function generateJSON(prompt) {
  const maxRetries = 2
  let delay = 1000

  // Configuration for structured JSON and stable deterministic output
  const config = {
    responseMimeType: 'application/json',
    temperature: 0.2,
  }

  // Step 1: Try the primary model
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: prompt,
        config: config
      })
      return JSON.parse(response.text)
    } catch (err) {
      const status = err.status || (err.message && (err.message.includes('503') ? 503 : err.message.includes('429') ? 429 : null))
      const isRetryable = status === 503 || status === 429

      if (isRetryable && attempt < maxRetries) {
        console.warn(`Primary Model Warning (Attempt ${attempt}): Failed with ${status}. Retrying in ${delay}ms...`)
        await sleep(delay)
        delay *= 2
        continue
      }

      console.warn(`Primary Model completely failed: ${err.message}. Cascading to Backup Model (gemini-flash-lite-latest)...`)
      break // Break to fallback step
    }
  }

  // Step 2: Fallback to backup model
  try {
    const backupResponse = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: prompt,
      config: config
    })
    return JSON.parse(backupResponse.text)
  } catch (backupErr) {
    console.error(`LLM Error: Backup model [gemini-flash-lite-latest] also failed:`, backupErr.message)
    throw backupErr
  }
}
