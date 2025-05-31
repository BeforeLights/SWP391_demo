import React, { createContext, useContext, useState, useEffect } from 'react'

export interface User {
  id: string
  email: string
  name: string
  role: 'patient' | 'doctor' | 'admin'
  patientInfo?: {
    dateOfBirth: string
    phone: string
    address: string
    emergencyContact: string
    hivStatus: 'positive' | 'negative' | 'unknown'
    cd4Count?: number
    viralLoad?: number
    currentARV?: string[]
  }
  doctorInfo?: {
    specialization: string
    license: string
    experience: number
    schedule: { [key: string]: string[] } // day: time slots
  }
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (userData: any) => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export { AuthContext }

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('auth_token')
    if (token) {
      // Validate token and get user info from API
      // For now, mock user data
      setUser({
        id: '1',
        email: 'patient@example.com',
        name: 'Nguyễn Văn A',
        role: 'patient',
        patientInfo: {
          dateOfBirth: '1990-01-01',
          phone: '0123456789',
          address: 'Hà Nội, Việt Nam',
          emergencyContact: '0987654321',
          hivStatus: 'positive',
          cd4Count: 450,
          viralLoad: 50,
          currentARV: ['TDF', '3TC', 'DTG']
        }
      })
    }
    setLoading(false)
  }, [])
  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // API call to .NET backend
      // const response = await fetch('/api/auth/login', { ... })
      
      // Mock login - using password for validation
      console.log('Login attempt:', { email, password })
      const mockUser: User = {
        id: '1',
        email,
        name: 'Nguyễn Văn A',
        role: 'patient',
        patientInfo: {
          dateOfBirth: '1990-01-01',
          phone: '0123456789',
          address: 'Hà Nội, Việt Nam',
          emergencyContact: '0987654321',
          hivStatus: 'positive',
          cd4Count: 450,
          viralLoad: 50,
          currentARV: ['TDF', '3TC', 'DTG']
        }
      }
      
      setUser(mockUser)
      localStorage.setItem('auth_token', 'mock_token')
    } catch (error) {
      throw new Error('Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth_token')
  }

  const register = async (userData: any) => {
    setLoading(true)
    try {
      // API call to .NET backend
      // const response = await fetch('/api/auth/register', { ... })
      
      // Mock registration
      console.log('Registering user:', userData)
    } catch (error) {
      throw new Error('Đăng ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    login,
    logout,
    register,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
