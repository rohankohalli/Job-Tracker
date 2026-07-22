import apiClient from './client'

export const login = async (credentials) => {
  const response = await apiClient.post('/users/login', credentials)
  return response.data
}

export const register = async (userData) => {
  const response = await apiClient.post('/users/register', userData)
  return response.data
}

export const logout = async () => {
  const response = await apiClient.post('/users/logout')
  return response.data
}

export const refreshToken = async () => {
  const response = await apiClient.post('/users/refresh')
}