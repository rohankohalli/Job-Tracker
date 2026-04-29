import axios from 'axios'
import * as cheerio from 'cheerio'
import { generateJSON } from './llm.service.js'

/**
 * Fetch HTML from a URL and extract text content.
 * @param {string} url 
 * @returns {Promise<string>}
 */
export async function fetchUrlContent(url) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })
    const $ = cheerio.load(data)
    
    // Remove script and style elements
    $('script, style, nav, footer, header').remove()
    
    return $('body').text().replace(/\s+/g, ' ').trim()
  } catch (err) {
    throw new Error(`Failed to fetch URL: ${err.message}`)
  }
}

/**
 * Use Gemini to extract job details from text.
 * @param {string} text 
 * @returns {Promise<{ title: string, company: string, description: string }>}
 */
export async function extractJobInfo(text) {
  const prompt = `
    Extract the following job information from the text below:
    - title
    - company
    - description (the full job description, cleaned up)

    Text:
    ${text.slice(0, 5000)}

    Respond in JSON format:
    {
      "title": "...",
      "company": "...",
      "description": "..."
    }
  `
  return await generateJSON(prompt)
}
