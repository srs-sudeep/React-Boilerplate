import axios from 'axios'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Function to call Gemini API for summarization
const fetchSummary = async (bookTitle, author, language) => {
  try {
    const genAI = new GoogleGenerativeAI(
      import.meta.env.VITE_APP_GEMINI_API_KEY,
    )
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
    }

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    })
    const prompt = `Provide a summary of the book "${bookTitle}" written by ${author} in ${language}. Provide the summary in JSON format with field name "summary".`
    const response = await chatSession.sendMessage(prompt)
    console.log(response?.response)
    return response?.response?.text()
  } catch (error) {
    console.error('Error fetching book summary:', error)
    return 'Summary not available'
  }
}

export default fetchSummary
