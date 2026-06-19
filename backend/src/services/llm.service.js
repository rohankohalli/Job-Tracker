import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Primary Model (High-quality Flash model - resolves to 3.5 Flash)
const primaryModel = genAI.getGenerativeModel({
  model: 'gemini-flash-latest',
  generationConfig: {
    /* force structured JSON output */
    responseMimeType: 'application/json',
  },
})

// Backup Model (Lite Flash model - resolves to 3.1 Flash Lite, quieter servers)
const backupModel = genAI.getGenerativeModel({
  model: 'gemini-flash-lite-latest',
  generationConfig: {
    /* force structured JSON output */
    responseMimeType: 'application/json',
  },
})

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Send a prompt to Gemini and return the parsed JSON response.
 * Tries the primary model (gemini-flash-latest) with retries first, then falls back to the backup model (gemini-flash-lite-latest).
 */
export async function generateJSON(prompt) {
  const maxRetries = 2
  let delay = 1000

  // Step 1: Try the primary model
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await primaryModel.generateContent(prompt)
      const text = result.response.text()
      return JSON.parse(text)
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
    const result = await backupModel.generateContent(prompt)
    const text = result.response.text()
    return JSON.parse(text)
  } catch (backupErr) {
    console.error(`LLM Error: Backup model [gemini-flash-lite-latest] also failed:`, backupErr.message)
    throw backupErr
  }
}
