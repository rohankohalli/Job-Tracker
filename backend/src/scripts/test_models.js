import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../../.env') })

async function listAllModels() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY not found.")
    return
  }

  // Use the standard client to list models
  // Note: listing models often requires a different endpoint or special permissions
  // but let's try the discovery approach.
  
  const genAI = new GoogleGenerativeAI(apiKey)
  
  try {
    console.log("--- Fetching Model List ---")
    // In @google/generative-ai, there isn't a direct listModels() on the GenAI object
    // It's usually done via the underlying REST API.
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
    const data = await response.json()
    
    if (data.error) {
      console.error("API Error:", data.error.message)
      return
    }

    console.log("Available models for your key:")
    data.models.forEach(m => {
      console.log(`- ${m.name} (Supports: ${m.supportedGenerationMethods.join(', ')})`)
    })

  } catch (err) {
    console.error("Failed to fetch models:", err.message)
  }
}

listAllModels()
