import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const model = genAI.getGenerativeModel({
  model: 'gemini-flash-latest',
  generationConfig: {
    responseMimeType: 'application/json',
  },
})

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
