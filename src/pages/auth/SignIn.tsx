import React, { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Eye, EyeOff, Brain, Sparkles } from 'lucide-react'

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [animationVisible, setAnimationVisible] = useState(false)
  
  useEffect(() => {
    setAnimationVisible(true)
  }, [])
  
  const { user, login } = useAuth()

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
    } catch (err) {
      setError('Email hoặc mật khẩu không đúng')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen hero-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md fade-in">
        <div className="flex justify-center items-center space-x-2">
          <Brain className="h-12 w-12 text-brand-600" />
          <Sparkles className="h-8 w-8 text-ocean-600 animate-pulse" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold gradient-text">
          YOU ARE HEARD
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Hãy đăng nhập để tiếp tục hành trình chăm sóc sức khỏe tinh thần của bạn
        </p>
        <p className="mt-2 text-center text-sm text-gray-600">
          Hoặc{' '}
          <Link
            to="/signup"
            className="font-medium text-ocean-600 hover:text-ocean-500 gradient-text-hover"
          >
            tạo tài khoản mới
          </Link>
        </p>
      </div>      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md fade-in" style={{ animationDelay: '200ms' }}>
        <div className="bg-white py-8 px-4 shadow-lg rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Địa chỉ email
              </label>
              <div className="mt-1">                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <div className="mt-1 relative">                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input pr-10"
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-ocean-600 focus:ring-ocean-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-ocean-600 hover:text-ocean-500 gradient-text-hover">
                  Quên mật khẩu?
                </a>
              </div>
            </div>

            <div>              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex justify-center items-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Đăng nhập'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo credentials</span>
              </div>
            </div>            <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-slate-200">
              <p className="font-medium">Tài khoản demo:</p>
              <p>Email: patient@example.com</p>
              <p>Mật khẩu: password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn
