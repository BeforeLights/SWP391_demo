import { apiService } from './api'
import { User } from '../types'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
  expiresIn: number
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  role: 'patient' | 'doctor' | 'admin'
  phone?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
}

export class AuthService {
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>('/auth/login', credentials)
    
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    
    return response.data
  }

  static async register(userData: RegisterRequest): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>('/auth/register', userData)
    
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    
    return response.data
  }

  static async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
    }
  }

  static async refreshToken(): Promise<string> {
    const response = await apiService.post<{ token: string }>('/auth/refresh')
    
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token)
    }
    
    return response.data.token
  }

  static async getCurrentUser(): Promise<User> {
    const response = await apiService.get<User>('/auth/me')
    return response.data
  }

  static async updateProfile(userId: string, userData: Partial<User>): Promise<User> {
    const response = await apiService.put<User>(`/auth/profile/${userId}`, userData)
    
    // Update local storage
    localStorage.setItem('user', JSON.stringify(response.data))
    
    return response.data
  }

  static async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await apiService.post('/auth/change-password', {
      oldPassword,
      newPassword
    })
  }

  static async resetPassword(email: string): Promise<void> {
    await apiService.post('/auth/reset-password', { email })
  }

  static getStoredUser(): User | null {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }

  static getStoredToken(): string | null {
    return localStorage.getItem('authToken')
  }

  static isAuthenticated(): boolean {
    return !!this.getStoredToken()
  }
}

export default AuthService
