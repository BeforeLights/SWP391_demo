import React, { useState, useEffect } from 'react'
import {
  User, Bell, Shield, SettingsIcon,
  Save, Eye, EyeOff, Camera, Mail,
  Smartphone, Monitor, Moon, Sun,
  Brain, Heart, Sparkles
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../contexts/NotificationContext'

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  address: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  mentalHealthInfo: {
    therapistName: string
    diagnoses: string[]
    triggers: string[]
    copingStrategies: string[]
    currentActivities: string[]
  }
  avatar?: string
}

interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  language: 'vi' | 'en'
  timezone: string
  dateFormat: 'dd/MM/yyyy' | 'MM/dd/yyyy' | 'yyyy-MM-dd'
  timeFormat: '12h' | '24h'
}

interface NotificationSettings {
  email: boolean
  sms: boolean
  push: boolean
  mentalHealthActivities: boolean
  appointments: boolean
  moodTracking: boolean
  systemUpdates: boolean
  reminderTiming: number
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'medical-team'
  shareDataForResearch: boolean
  allowCommunications: boolean
  dataRetention: boolean
}

interface SecuritySettings {
  twoFactorAuth: boolean
  loginNotifications: boolean
  sessionTimeout: number
  passwordLastChanged: string
}

const SettingsPage: React.FC = () => {
  const { user } = useAuth()
  const { addNotification } = useNotifications()
  const [activeTab, setActiveTab] = useState<'profile' | 'app' | 'notifications' | 'privacy' | 'security'>('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [animationVisible, setAnimationVisible] = useState(false)
  
  useEffect(() => {
    setAnimationVisible(true)
  }, [])
  
  // Mock data - in real app, this would come from API using user data
  const [profile, setProfile] = useState<UserProfile>({
    id: user?.id || '1',
    name: user?.name || 'Nguyễn Văn A',
    email: user?.email || 'nguyen.vana@example.com',
    phone: user?.patientInfo?.phone || '0123456789',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    dateOfBirth: '1985-06-15',
    gender: 'male',
    emergencyContact: {
      name: 'Nguyễn Thị B',
      phone: '0987654321',
      relationship: 'Vợ'
    },
    mentalHealthInfo: {
      therapistName: 'ThS. Trần Thị C',
      diagnoses: ['Lo âu', 'Trầm cảm nhẹ'],
      triggers: ['Áp lực công việc', 'Mâu thuẫn gia đình'],
      copingStrategies: ['Thiền định', 'Tập thể dục', 'Viết nhật ký'],
      currentActivities: ['Tham gia nhóm hỗ trợ', 'Thực hành chánh niệm hàng ngày']
    }
  })
  const [appSettings, setAppSettings] = useState<AppSettings>({
    theme: 'light',
    language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: '24h'
  })

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: true,
    sms: true,
    push: true,
    mentalHealthActivities: true,
    appointments: true,
    moodTracking: true,
    systemUpdates: false,
    reminderTiming: 30
  })

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: 'medical-team',
    shareDataForResearch: false,
    allowCommunications: true,
    dataRetention: true
  })

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
    loginNotifications: true,
    sessionTimeout: 60,
    passwordLastChanged: '2024-01-15'
  })

  const handleSave = () => {
    // Save settings to backend
    addNotification({
      type: 'success',
      title: 'Đã lưu cài đặt',
      message: 'Tất cả thay đổi đã được lưu thành công'
    })
    setIsEditing(false)
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Handle avatar upload
      addNotification({
        type: 'info',
        title: 'Tải ảnh lên',
        message: 'Ảnh đại diện đang được xử lý'
      })
    }
  }
  const tabs = [
    { id: 'profile', label: 'Hồ sơ cá nhân', icon: User },
    { id: 'app', label: 'Ứng dụng', icon: SettingsIcon },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'privacy', label: 'Quyền riêng tư', icon: Shield },
    { id: 'security', label: 'Bảo mật', icon: Shield }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 fade-in">
          <h1 className="text-3xl font-bold text-gray-900">Cài đặt</h1>
          <p className="mt-2 text-gray-600">Quản lý thông tin cá nhân và cài đặt ứng dụng</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="card-glow fade-in" style={{ animationDelay: '100ms' }}>
              <nav className="space-y-2">
                {tabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-brand-100 to-ocean-100 text-ocean-700 border-l-4 border-ocean-500'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    style={{ animationDelay: `${(index + 1) * 100}ms` }}
                  >
                    <tab.icon className={`w-5 h-5 mr-3 ${activeTab === tab.id ? 'text-ocean-600' : ''}`} />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4 fade-in" style={{ animationDelay: '200ms' }}>
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="card-glow">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Thông tin cá nhân</h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="btn btn-secondary"
                    >
                      {isEditing ? 'Hủy' : 'Chỉnh sửa'}
                    </button>
                  </div>

                  {/* Avatar */}
                  <div className="flex items-center space-x-6 mb-8">
                    <div className="relative">
                      <div className="w-24 h-24 bg-medical-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                        {profile.name.charAt(0)}
                      </div>
                      {isEditing && (
                        <label className="absolute bottom-0 right-0 bg-medical-600 text-white rounded-full p-2 cursor-pointer hover:bg-medical-700">
                          <Camera className="w-4 h-4" />
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                          />
                        </label>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{profile.name}</h3>
                      <p className="text-gray-600">{profile.email}</p>
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing}
                        className="form-input"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                        className="form-input"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={!isEditing}
                        className="form-input"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày sinh
                      </label>
                      <input
                        type="date"
                        value={profile.dateOfBirth}
                        onChange={(e) => setProfile(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                        disabled={!isEditing}
                        className="form-input"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giới tính
                      </label>
                      <select
                        value={profile.gender}
                        onChange={(e) => setProfile(prev => ({ ...prev, gender: e.target.value as any }))}
                        disabled={!isEditing}
                        className="form-select"
                      >
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ
                    </label>
                    <textarea
                      value={profile.address}
                      onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                      disabled={!isEditing}
                      rows={3}
                      className="form-textarea"
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Liên hệ khẩn cấp</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        value={profile.emergencyContact.name}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          emergencyContact: { ...prev.emergencyContact, name: e.target.value }
                        }))}
                        disabled={!isEditing}
                        className="form-input"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        value={profile.emergencyContact.phone}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
                        }))}
                        disabled={!isEditing}
                        className="form-input"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mối quan hệ
                      </label>
                      <input
                        type="text"
                        value={profile.emergencyContact.relationship}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          emergencyContact: { ...prev.emergencyContact, relationship: e.target.value }
                        }))}
                        disabled={!isEditing}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Mental Health Information */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin sức khỏe tâm thần</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên nhà trị liệu
                      </label>
                      <input
                        type="text"
                        value={profile.mentalHealthInfo.therapistName}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          mentalHealthInfo: { ...prev.mentalHealthInfo, therapistName: e.target.value }
                        }))}
                        disabled={!isEditing}
                        className="form-input"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chẩn đoán
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {profile.mentalHealthInfo.diagnoses.map((diagnosis, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {diagnosis}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Yếu tố kích thích
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {profile.mentalHealthInfo.triggers.map((trigger, index) => (
                          <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                            {trigger}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chiến lược đối phó
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {profile.mentalHealthInfo.copingStrategies.map((strategy, index) => (
                          <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                            {strategy}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hoạt động hiện tại
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {profile.mentalHealthInfo.currentActivities.map((activity, index) => (
                          <span key={index} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="btn btn-secondary"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSave}
                      className="btn btn-primary"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Lưu thay đổi
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* App Settings Tab */}
            {activeTab === 'app' && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Cài đặt ứng dụng</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giao diện
                    </label>
                    <div className="flex space-x-4">
                      {[
                        { value: 'light', label: 'Sáng', icon: Sun },
                        { value: 'dark', label: 'Tối', icon: Moon },
                        { value: 'system', label: 'Theo hệ thống', icon: Monitor }
                      ].map(theme => (
                        <button
                          key={theme.value}
                          onClick={() => setAppSettings(prev => ({ ...prev, theme: theme.value as any }))}
                          className={`flex items-center px-4 py-2 rounded-lg border ${
                            appSettings.theme === theme.value
                              ? 'border-medical-500 bg-medical-50 text-medical-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <theme.icon className="w-4 h-4 mr-2" />
                          {theme.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngôn ngữ
                      </label>
                      <select
                        value={appSettings.language}
                        onChange={(e) => setAppSettings(prev => ({ ...prev, language: e.target.value as any }))}
                        className="form-select"
                      >
                        <option value="vi">Tiếng Việt</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Múi giờ
                      </label>
                      <select
                        value={appSettings.timezone}
                        onChange={(e) => setAppSettings(prev => ({ ...prev, timezone: e.target.value }))}
                        className="form-select"
                      >
                        <option value="Asia/Ho_Chi_Minh">Việt Nam (GMT+7)</option>
                        <option value="Asia/Bangkok">Bangkok (GMT+7)</option>
                        <option value="Asia/Singapore">Singapore (GMT+8)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Định dạng ngày
                      </label>
                      <select
                        value={appSettings.dateFormat}
                        onChange={(e) => setAppSettings(prev => ({ ...prev, dateFormat: e.target.value as any }))}
                        className="form-select"
                      >
                        <option value="dd/MM/yyyy">dd/MM/yyyy</option>
                        <option value="MM/dd/yyyy">MM/dd/yyyy</option>
                        <option value="yyyy-MM-dd">yyyy-MM-dd</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Định dạng giờ
                      </label>
                      <select
                        value={appSettings.timeFormat}
                        onChange={(e) => setAppSettings(prev => ({ ...prev, timeFormat: e.target.value as any }))}
                        className="form-select"
                      >
                        <option value="24h">24 giờ</option>
                        <option value="12h">12 giờ (AM/PM)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button onClick={handleSave} className="btn btn-primary">
                      <Save className="w-4 h-4 mr-2" />
                      Lưu cài đặt
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Cài đặt thông báo</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Phương thức thông báo</h3>
                    <div className="space-y-3">
                      {[
                        { key: 'email', label: 'Email', icon: Mail },
                        { key: 'sms', label: 'SMS', icon: Smartphone },
                        { key: 'push', label: 'Thông báo đẩy', icon: Bell }
                      ].map(method => (
                        <label key={method.key} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={notificationSettings[method.key as keyof NotificationSettings] as boolean}
                            onChange={(e) => setNotificationSettings(prev => ({
                              ...prev,
                              [method.key]: e.target.checked
                            }))}
                            className="mr-3"
                          />
                          <method.icon className="w-5 h-5 mr-2 text-gray-600" />
                          <span className="text-gray-700">{method.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                    <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Loại thông báo</h3>
                    <div className="space-y-3">
                      {[
                        { key: 'mentalHealthActivities', label: 'Nhắc nhở hoạt động tinh thần' },
                        { key: 'appointments', label: 'Lịch hẹn trị liệu' },
                        { key: 'moodTracking', label: 'Theo dõi cảm xúc' },
                        { key: 'systemUpdates', label: 'Cập nhật hệ thống' }
                      ].map(type => (
                        <label key={type.key} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={notificationSettings[type.key as keyof NotificationSettings] as boolean}
                            onChange={(e) => setNotificationSettings(prev => ({
                              ...prev,
                              [type.key]: e.target.checked
                            }))}
                            className="mr-3"
                          />
                          <span className="text-gray-700">{type.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thời gian nhắc nhở trước lịch hẹn (phút)
                    </label>
                    <select
                      value={notificationSettings.reminderTiming}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        reminderTiming: parseInt(e.target.value)
                      }))}
                      className="form-select"
                    >
                      <option value={15}>15 phút</option>
                      <option value={30}>30 phút</option>
                      <option value={60}>1 giờ</option>
                      <option value={120}>2 giờ</option>
                      <option value={1440}>1 ngày</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end">
                    <button onClick={handleSave} className="btn btn-primary">
                      <Save className="w-4 h-4 mr-2" />
                      Lưu cài đặt
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Quyền riêng tư</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hiển thị hồ sơ
                    </label>
                    <select
                      value={privacySettings.profileVisibility}
                      onChange={(e) => setPrivacySettings(prev => ({
                        ...prev,
                        profileVisibility: e.target.value as any
                      }))}
                      className="form-select"
                    >
                      <option value="private">Riêng tư</option>
                      <option value="medical-team">Chỉ đội ngũ y tế</option>
                      <option value="public">Công khai</option>
                    </select>
                    <p className="text-sm text-gray-600 mt-1">
                      Kiểm soát ai có thể xem thông tin hồ sơ của bạn
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        checked={privacySettings.shareDataForResearch}
                        onChange={(e) => setPrivacySettings(prev => ({
                          ...prev,
                          shareDataForResearch: e.target.checked
                        }))}
                        className="mr-3 mt-1"
                      />
                      <div>
                        <span className="text-gray-700 font-medium">Chia sẻ dữ liệu cho nghiên cứu</span>
                        <p className="text-sm text-gray-600">
                          Cho phép sử dụng dữ liệu ẩn danh của bạn cho nghiên cứu y khoa
                        </p>
                      </div>
                    </label>
                    
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        checked={privacySettings.allowCommunications}
                        onChange={(e) => setPrivacySettings(prev => ({
                          ...prev,
                          allowCommunications: e.target.checked
                        }))}
                        className="mr-3 mt-1"
                      />
                      <div>
                        <span className="text-gray-700 font-medium">Cho phép liên lạc</span>
                        <p className="text-sm text-gray-600">
                          Nhận thông tin về các dịch vụ và chương trình hỗ trợ
                        </p>
                      </div>
                    </label>
                    
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        checked={privacySettings.dataRetention}
                        onChange={(e) => setPrivacySettings(prev => ({
                          ...prev,
                          dataRetention: e.target.checked
                        }))}
                        className="mr-3 mt-1"
                      />
                      <div>
                        <span className="text-gray-700 font-medium">Lưu trữ dữ liệu lâu dài</span>
                        <p className="text-sm text-gray-600">
                          Giữ lại dữ liệu của bạn để theo dõi xu hướng sức khỏe lâu dài
                        </p>
                      </div>
                    </label>
                  </div>
                  
                  <div className="flex justify-end">
                    <button onClick={handleSave} className="btn btn-primary">
                      <Save className="w-4 h-4 mr-2" />
                      Lưu cài đặt
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="card">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Bảo mật tài khoản</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Thay đổi mật khẩu</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mật khẩu hiện tại
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              className="form-input pr-10"
                              placeholder="Nhập mật khẩu hiện tại"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mật khẩu mới
                          </label>
                          <input
                            type="password"
                            className="form-input"
                            placeholder="Nhập mật khẩu mới"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Xác nhận mật khẩu mới
                          </label>
                          <input
                            type="password"
                            className="form-input"
                            placeholder="Xác nhận mật khẩu mới"
                          />
                        </div>
                        
                        <button className="btn btn-primary">
                          Cập nhật mật khẩu
                        </button>
                      </div>
                    </div>
                    
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Cài đặt bảo mật</h3>
                      <div className="space-y-4">
                        <label className="flex items-center justify-between">
                          <div>
                            <span className="text-gray-700 font-medium">Xác thực hai yếu tố</span>
                            <p className="text-sm text-gray-600">Thêm lớp bảo mật bổ sung cho tài khoản</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={securitySettings.twoFactorAuth}
                            onChange={(e) => setSecuritySettings(prev => ({
                              ...prev,
                              twoFactorAuth: e.target.checked
                            }))}
                            className="toggle-switch"
                          />
                        </label>
                        
                        <label className="flex items-center justify-between">
                          <div>
                            <span className="text-gray-700 font-medium">Thông báo đăng nhập</span>
                            <p className="text-sm text-gray-600">Nhận thông báo khi có đăng nhập mới</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={securitySettings.loginNotifications}
                            onChange={(e) => setSecuritySettings(prev => ({
                              ...prev,
                              loginNotifications: e.target.checked
                            }))}
                            className="toggle-switch"
                          />
                        </label>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Thời gian hết hạn phiên (phút)
                          </label>
                          <select
                            value={securitySettings.sessionTimeout}
                            onChange={(e) => setSecuritySettings(prev => ({
                              ...prev,
                              sessionTimeout: parseInt(e.target.value)
                            }))}
                            className="form-select"
                          >
                            <option value={30}>30 phút</option>
                            <option value={60}>1 giờ</option>
                            <option value={120}>2 giờ</option>
                            <option value={480}>8 giờ</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button onClick={handleSave} className="btn btn-primary">
                        <Save className="w-4 h-4 mr-2" />
                        Lưu cài đặt
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
