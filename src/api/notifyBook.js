import apiClient from 'core/api/apiConfig'
const API_ENDPOINT = '/books'

const notifyBook = async (bookId, body) => {
  try {
    const response = await apiClient.patch(`${API_ENDPOINT}/${bookId}`, body)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to notify book')
  }
}

export default notifyBook
