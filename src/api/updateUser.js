import apiClient from 'core/api/apiConfig'
const API_ENDPOINT = '/users'

const updateUser = async (userId, userData) => {
  try {
    const response = await apiClient.put(`${API_ENDPOINT}/${userId}`, userData)
    return response.data
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to update user details',
    )
  }
}

export default updateUser
