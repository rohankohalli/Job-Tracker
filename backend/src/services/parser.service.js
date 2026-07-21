import { PDFParse } from 'pdf-parse'
import mammoth from 'mammoth'

export async function parseResumeFile(file) {
  if (!file) {
    throw new Error('No file provided for parsing.')
  }

  const { mimetype, buffer } = file

  if (mimetype === 'application/pdf') {
    try {
      const parser = new PDFParse({ data: buffer })
      const result = await parser.getText()
      return result.text.trim()
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
