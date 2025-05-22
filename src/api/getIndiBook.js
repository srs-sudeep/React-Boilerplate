import apiClient from 'core/api/apiConfig'
const API_ENDPOINT = '/books'

const getIndiBook = async (bookId) => {
  try {
    const response = await apiClient.get(`${API_ENDPOINT}/${bookId}`)
    return response.data
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch book details',
    )
  }
}

export default getIndiBook
