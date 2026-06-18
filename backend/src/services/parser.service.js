import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const pdfParse = require('pdf-parse')
const mammoth = require('mammoth')

/**
 * Parse uploaded resume file (PDF or DOCX) to extract raw text content.
 * @param {object} file - The file object from multer memoryStorage (contains buffer, mimetype, size)
 * @returns {Promise<string>} - Extracted text content
 */
export async function parseResumeFile(file) {
  if (!file) {
    throw new Error('No file provided for parsing.')
  }

  const { mimetype, buffer } = file

  if (mimetype === 'application/pdf') {
    try {
      const data = await pdfParse(buffer)
      return data.text.trim()
    } catch (err) {
      throw new Error(`Failed to parse PDF file: ${err.message}`)
    }
  } else if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimetype === 'application/msword'
  ) {
    try {
      const result = await mammoth.extractRawText({ buffer })
      return result.value.trim()
    } catch (err) {
      throw new Error(`Failed to parse DOCX file: ${err.message}`)
    }
  } else {
    throw new Error('Unsupported file format. Please upload a PDF or DOCX file.')
  }
}
