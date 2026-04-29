import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Using 'gemini-flash-latest' as identified by your API key list
const model = genAI.getGenerativeModel({
  model: 'gemini-flash-latest', 
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
  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    return JSON.parse(text)
  } catch (err) {
    console.error(`LLM Error [${model.model}]:`, err.message)
    throw err
  }
}
