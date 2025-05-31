import axios, { AxiosInstance, AxiosResponse } from 'axios'

// Base API configuration
const API_BASE_URL = 'https://localhost:5001/api' // Replace with environment variable in production

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    })

    // Request interceptor to add auth token
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Redirect to login if unauthorized
          localStorage.removeItem('authToken')
          window.location.href = '/signin'
        }
        return Promise.reject(error)
      }
    )
  }
  // Generic HTTP methods
  get<T>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return this.api.get<T>(url, config)
  }

  post<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.api.post<T>(url, data)
  }

  put<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.api.put<T>(url, data)
  }

  delete<T>(url: string): Promise<AxiosResponse<T>> {
    return this.api.delete<T>(url)
  }

  patch<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.api.patch<T>(url, data)
  }
}

export const apiService = new ApiService()
export default apiService
