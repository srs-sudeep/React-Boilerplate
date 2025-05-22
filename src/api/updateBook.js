import apiClient from 'core/api/apiConfig'
const API_ENDPOINT = '/books'

const updateBook = async (bookId, bookData) => {
  try {
    const response = await apiClient.put(`${API_ENDPOINT}/${bookId}`, bookData)
    return response.data
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to update book details',
    )
  }
}

export default updateBook
