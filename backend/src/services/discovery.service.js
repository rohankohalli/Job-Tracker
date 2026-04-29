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
    
    // Remove noise elements
    $('script, style, nav, footer, header, aside, .related-jobs, .footer-links').remove()
    
    // Focus on likely content areas if they exist, otherwise use body
    const content = $('.job-description, .description, main, #main, body').text()
    
    return content.replace(/\s+/g, ' ').trim()
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
    Extract high-quality job information from the raw web content provided below.
    
    Return a JSON object with:
    1. "title": The formal job title.
    2. "company": The company name.
    3. "description": A clean, well-formatted markdown job description. 
       - Remove any cookie banners, login prompts, or navigation text.
       - Focus strictly on the Role, Requirements, and Benefits.

    Content:
    ---
    ${text.slice(0, 8000)}
    ---

    JSON Output:
    {
      "title": "...",
      "company": "...",
      "description": "..."
    }
  `
  return await generateJSON(prompt)
}
