import apiClient from 'core/api/apiConfig'
const API_ENDPOINT = '/users'

const addtowhishlist = async (userId, body) => {
  try {
    const response = await apiClient.post(`${API_ENDPOINT}/${userId}`, body)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add book')
  }
}

export default addtowhishlist
