import apiClient from 'core/api/apiConfig'
const API_ENDPOINT = '/librarian'

const createLibrarian = async (body = {}) => {
  try {
    const response = await apiClient.post(API_ENDPOINT, body)
    return response.data
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to create librarian',
    )
  }
}

export default createLibrarian
