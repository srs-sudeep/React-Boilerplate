import apiClient from 'core/api/apiConfig'

const API_ENDPOINT = '/auth/login'

export const loginApi = async (email, password) => {
  try {
    // Send the phone and password to the backend for authentication
    const response = await apiClient.post(API_ENDPOINT, {
      email,
      password,
    })
    const { user, tokens } = response.data
    localStorage.setItem('refreshToken', tokens.refresh.token)
    localStorage.setItem('accessToken', tokens.access.token)
    localStorage.setItem('userRole', user.role)
    localStorage.setItem('user', user.name)
    localStorage.setItem('id', user.id)
    localStorage.setItem('request', true)
    console.log(user)
    return { user, tokens }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed')
  }
}

const API_ENDPOINT_SIGNUPUSER = '/auth/register'

export const SignupApi = async (name, email, phone, Id, password) => {
  try {
    const emailRes = await apiClient.post('/auth/verify-email', {
      email,
    })
    console.log(emailRes)
    if (!emailRes) {
      throw new Error('Invalid or unverified email address')
    }
    // Proceed with creating the user if email is valid
    const response = await apiClient.post(API_ENDPOINT_SIGNUPUSER, {
      name,
      email,
      phone,
      Id,
      password,
    })

    // Extract user and tokens from the response
    const { user, tokens } = response.data

    // Store tokens and user information in localStorage
    localStorage.setItem('refreshToken', tokens.refresh.token)
    localStorage.setItem('accessToken', tokens.access.token)
    localStorage.setItem('userRole', user.role)
    localStorage.setItem('user', user.name)
    localStorage.setItem('id', user.id)

    console.log(user)
    return { user, tokens }
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || 'Signup failed',
    )
  }
}
