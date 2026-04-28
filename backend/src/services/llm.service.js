import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Shared model instance — reused across all service calls
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    responseMimeType: 'application/json', // force structured JSON output
  },
})

/**
 * Send a prompt to Gemini and return the parsed JSON response.
 * Throws if the response cannot be parsed as JSON.
 * @param {string} prompt
 * @returns {Promise<object>}
 */
export async function generateJSON(prompt) {
  const result = await model.generateContent(prompt)
  const text = result.response.text()
  try {
    return JSON.parse(text)
  } catch {
    throw new Error(`LLM returned non-JSON response: ${text.slice(0, 200)}`)
  }
}
