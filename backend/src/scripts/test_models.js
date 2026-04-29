import { GoogleGenerativeAI } from '@google/generative-ai'
import 'dotenv/config'

async function list() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  try {
    // Note: The SDK might not have a direct listModels method on genAI in all versions, 
    // but we can try to fetch it via the underlying API or just test a different name.
    console.log("Testing gemini-1.5-flash...")
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    const result = await model.generateContent("test")
    console.log("Success with gemini-1.5-flash!")
  } catch (err) {
    console.error("Error with gemini-1.5-flash:", err.message)

    try {
      console.log("Testing gemini-1.5-pro...")
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })
      const result = await model.generateContent("test")
      console.log("Success with gemini-1.5-pro!")
    } catch (err2) {
      console.error("Error with gemini-1.5-pro:", err2.message)
    }
  }
}

list()
