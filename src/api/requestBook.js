import apiClient from 'core/api/apiConfig'
const API_ENDPOINT = '/books'

const requestBook = async (bookId, body) => {
  try {
    const response = await apiClient.post(`${API_ENDPOINT}/${bookId}`, body)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to request book')
  }
}

export default requestBook
