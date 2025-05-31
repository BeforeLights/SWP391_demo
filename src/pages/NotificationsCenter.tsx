import React, { useState, useEffect } from 'react'
import {
  Bell, Clock, Calendar, Pill, TestTube,
  CheckCircle, Info, X, Settings,
  Search, Trash2
} from 'lucide-react'
import { format, isToday, isYesterday, parseISO } from 'date-fns'
import { vi } from 'date-fns/locale'

interface NotificationData {
  id: string
  type: 'medication' | 'appointment' | 'test' | 'system' | 'reminder'
  title: string
  message: string
  timestamp: string
  isRead: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  actionRequired?: boolean
  relatedId?: string
  data?: any
}

interface NotificationSettings {
  medication: boolean
  appointments: boolean
  testResults: boolean
  systemUpdates: boolean
  reminderBeforeAppointment: number // minutes
  medicationReminder: boolean
  emailNotifications: boolean
  smsNotifications: boolean
}

// Mock notifications data
const mockNotifications: NotificationData[] = [
  {
    id: '1',
    type: 'medication',
    title: 'Nhắc nhở uống thuốc',
    message: 'Đã đến giờ uống Efavirenz/Emtricitabine/Tenofovir (22:00)',
    timestamp: new Date().toISOString(),
    isRead: false,
    priority: 'high',
    actionRequired: true,
    relatedId: 'med_1'
  },
  {
    id: '2',
    type: 'appointment',
    title: 'Lịch hẹn sắp tới',
    message: 'Bạn có lịch hẹn với BS. Nguyễn Văn A vào ngày mai lúc 09:00',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    priority: 'medium',
    actionRequired: false,
    relatedId: 'apt_1'
  },
  {
    id: '3',
    type: 'test',
    title: 'Kết quả xét nghiệm',
    message: 'Kết quả xét nghiệm CD4 đã có. CD4: 450 cells/μL (Bình thường)',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    priority: 'medium',
    actionRequired: false,
    relatedId: 'test_1'
  },
  {
    id: '4',
    type: 'system',
    title: 'Cập nhật hệ thống',
    message: 'Hệ thống đã được cập nhật với các tính năng mới về theo dõi sức khỏe',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    priority: 'low',
    actionRequired: false
  },
  {
    id: '5',
    type: 'reminder',
    title: 'Nhắc nhở xét nghiệm',
    message: 'Đã đến thời gian xét nghiệm định kỳ CD4 và Viral Load',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    priority: 'high',
    actionRequired: true,
    relatedId: 'reminder_1'
  }
]

const NotificationsCenter: React.FC = () => {
  const [allNotifications, setAllNotifications] = useState<NotificationData[]>(mockNotifications)
  const [filteredNotifications, setFilteredNotifications] = useState<NotificationData[]>(mockNotifications)
  const [filterType, setFilterType] = useState<string>('all')
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNotification, setSelectedNotification] = useState<NotificationData | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState<NotificationSettings>({
    medication: true,
    appointments: true,
    testResults: true,
    systemUpdates: true,
    reminderBeforeAppointment: 60,
    medicationReminder: true,
    emailNotifications: true,
    smsNotifications: false
  })

  // Filter notifications
  useEffect(() => {
    let filtered = allNotifications

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(notification => notification.type === filterType)
    }

    // Filter by read status
    if (showUnreadOnly) {
      filtered = filtered.filter(notification => !notification.isRead)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredNotifications(filtered)
  }, [allNotifications, filterType, showUnreadOnly, searchTerm])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'medication': return <Pill className="w-5 h-5 text-purple-600" />
      case 'appointment': return <Calendar className="w-5 h-5 text-blue-600" />
      case 'test': return <TestTube className="w-5 h-5 text-green-600" />
      case 'system': return <Settings className="w-5 h-5 text-gray-600" />
      case 'reminder': return <Bell className="w-5 h-5 text-yellow-600" />
      default: return <Info className="w-5 h-5 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-500 bg-red-50'
      case 'high': return 'border-orange-500 bg-orange-50'
      case 'medium': return 'border-yellow-500 bg-yellow-50'
      case 'low': return 'border-blue-500 bg-blue-50'
      default: return 'border-gray-300 bg-white'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Khẩn cấp'
      case 'high': return 'Cao'
      case 'medium': return 'Trung bình'
      case 'low': return 'Thấp'
      default: return 'Bình thường'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'medication': return 'Thuốc'
      case 'appointment': return 'Lịch hẹn'
      case 'test': return 'Xét nghiệm'
      case 'system': return 'Hệ thống'
      case 'reminder': return 'Nhắc nhở'
      default: return 'Khác'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = parseISO(timestamp)
    if (isToday(date)) {
      return `Hôm nay ${format(date, 'HH:mm')}`
    } else if (isYesterday(date)) {
      return `Hôm qua ${format(date, 'HH:mm')}`
    } else {
      return format(date, 'dd/MM/yyyy HH:mm', { locale: vi })
    }
  }

  const markAsRead = (notificationId: string) => {
    setAllNotifications(notifications =>
      notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setAllNotifications(notifications =>
      notifications.map(notification => ({ ...notification, isRead: true }))
    )
  }

  const deleteNotification = (notificationId: string) => {
    setAllNotifications(notifications =>
      notifications.filter(notification => notification.id !== notificationId)
    )
  }

  const handleNotificationAction = (notification: NotificationData) => {
    markAsRead(notification.id)
    
    // Handle specific actions based on notification type
    switch (notification.type) {
      case 'medication':
        // Navigate to medication reminders
        window.location.href = '/medications'
        break
      case 'appointment':
        // Navigate to appointments
        window.location.href = '/appointments'
        break
      case 'test':
        // Navigate to reports
        window.location.href = '/reports'
        break
      default:
        setSelectedNotification(notification)
    }
  }

  const unreadCount = allNotifications.filter(n => !n.isRead).length
  const urgentCount = allNotifications.filter(n => n.priority === 'urgent' && !n.isRead).length

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Trung tâm thông báo</h1>
              <p className="mt-2 text-gray-600">
                Quản lý tất cả thông báo và cảnh báo
                {unreadCount > 0 && (
                  <span className="ml-2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                    {unreadCount} chưa đọc
                  </span>
                )}
                {urgentCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium animate-pulse">
                    {urgentCount} khẩn cấp
                  </span>
                )}
              </p>
            </div>
            <div className="flex space-x-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="btn btn-secondary"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Đánh dấu tất cả đã đọc
                </button>
              )}
              <button
                onClick={() => setShowSettings(true)}
                className="btn btn-primary"
              >
                <Settings className="w-4 h-4 mr-2" />
                Cài đặt
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm thông báo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="form-select"
              >
                <option value="all">Tất cả loại</option>
                <option value="medication">Thuốc</option>
                <option value="appointment">Lịch hẹn</option>
                <option value="test">Xét nghiệm</option>
                <option value="reminder">Nhắc nhở</option>
                <option value="system">Hệ thống</option>
              </select>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showUnreadOnly}
                  onChange={(e) => setShowUnreadOnly(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Chỉ hiện chưa đọc</span>
              </label>
            </div>
            
            <div className="text-sm text-gray-600">
              {filteredNotifications.length} / {allNotifications.length} thông báo
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`card cursor-pointer transition-all hover:shadow-md ${
                  !notification.isRead ? 'ring-2 ring-medical-200' : ''
                } ${getPriorityColor(notification.priority)}`}
                onClick={() => handleNotificationAction(notification)}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className={`text-lg font-medium ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-medical-500 rounded-full"></div>
                        )}
                        {notification.actionRequired && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                            Cần hành động
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          notification.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          notification.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {getPriorityText(notification.priority)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(notification.id)
                          }}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className={`mt-1 ${
                      !notification.isRead ? 'text-gray-900' : 'text-gray-600'
                    }`}>
                      {notification.message}
                    </p>
                    
                    <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                          {getTypeText(notification.type)}
                        </span>
                      </div>
                      
                      {!notification.isRead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            markAsRead(notification.id)
                          }}
                          className="text-medical-600 hover:text-medical-800 text-sm"
                        >
                          Đánh dấu đã đọc
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card text-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Không có thông báo nào</p>
            </div>
          )}
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Cài đặt thông báo</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Loại thông báo</h4>
                  <div className="space-y-3">
                    {[
                      { key: 'medication', label: 'Nhắc nhở uống thuốc' },
                      { key: 'appointments', label: 'Lịch hẹn' },
                      { key: 'testResults', label: 'Kết quả xét nghiệm' },
                      { key: 'systemUpdates', label: 'Cập nhật hệ thống' }
                    ].map(setting => (
                      <label key={setting.key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings[setting.key as keyof NotificationSettings] as boolean}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            [setting.key]: e.target.checked
                          }))}
                          className="mr-3"
                        />
                        <span className="text-gray-700">{setting.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Thời gian nhắc nhở</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nhắc trước lịch hẹn (phút)
                      </label>
                      <select
                        value={settings.reminderBeforeAppointment}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          reminderBeforeAppointment: parseInt(e.target.value)
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
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Phương thức thông báo</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          emailNotifications: e.target.checked
                        }))}
                        className="mr-3"
                      />
                      <span className="text-gray-700">Email</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.smsNotifications}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          smsNotifications: e.target.checked
                        }))}
                        className="mr-3"
                      />
                      <span className="text-gray-700">SMS</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => setShowSettings(false)}
                  className="btn btn-secondary"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    // Save settings here
                    setShowSettings(false)
                  }}
                  className="btn btn-primary"
                >
                  Lưu cài đặt
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Notification Modal */}
        {selectedNotification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-lg w-full p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  {getNotificationIcon(selectedNotification.type)}
                  <h3 className="text-xl font-bold text-gray-900">{selectedNotification.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-700">{selectedNotification.message}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Loại: {getTypeText(selectedNotification.type)}</span>
                  <span>Ưu tiên: {getPriorityText(selectedNotification.priority)}</span>
                </div>
                
                <div className="text-sm text-gray-600">
                  <Clock className="w-4 h-4 inline mr-1" />
                  {formatTimestamp(selectedNotification.timestamp)}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="btn btn-secondary"
                >
                  Đóng
                </button>
                {selectedNotification.actionRequired && (
                  <button
                    onClick={() => {
                      handleNotificationAction(selectedNotification)
                      setSelectedNotification(null)
                    }}
                    className="btn btn-primary"
                  >
                    Thực hiện hành động
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationsCenter
