import apiClient from 'core/api/apiConfig'
const API_ENDPOINT = '/users'

const getAllUsers = async (params = {}) => {
  try {
    const response = await apiClient.get(API_ENDPOINT, { params })
    return response.data.results
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch users')
  }
}

export default getAllUsers
