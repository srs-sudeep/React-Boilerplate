import apiClient from 'core/api/apiConfig'
const API_ENDPOINT = '/books'

const getAllBooks = async (params = {}) => {
  try {
    const response = await apiClient.get(API_ENDPOINT, { params })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch books')
  }
}

export default getAllBooks
