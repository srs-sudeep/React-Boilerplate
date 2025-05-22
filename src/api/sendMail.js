import apiClient from 'core/api/apiConfig'
const API_ENDPOINT = '/librarian/send-mail'

const sendMail = async (toEmail, subject, status, name, author) => {
  try {
    // Create an object for the request body
    const mailData = {
      toEmail,
      subject,
      status,
      name,
      author,
    }

    // Make a POST request with the mailData as the body
    const response = await apiClient.post(API_ENDPOINT, mailData)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send email')
  }
}

export default sendMail
