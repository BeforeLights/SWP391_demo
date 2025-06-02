import React, { useState, useEffect } from 'react'
import {
  Bell, Clock, Calendar, Sparkles, Brain,
  CheckCircle, Info, X, Settings,
  Search, MessageCircle, Shield
} from 'lucide-react'
import { format, isToday, isYesterday, parseISO } from 'date-fns'
import { vi } from 'date-fns/locale'

interface NotificationData {
  id: string
  type: 'activity' | 'appointment' | 'assessment' | 'system' | 'reminder' | 'support'
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
  activities: boolean
  appointments: boolean
  assessmentResults: boolean
  systemUpdates: boolean
  reminderBeforeAppointment: number // minutes
  activityReminder: boolean
  emailNotifications: boolean
  smsNotifications: boolean
}

// Mock notifications data
const mockNotifications: NotificationData[] = [
  {
    id: '1',
    type: 'activity',
    title: 'Nhắc nhở hoạt động hàng ngày',
    message: 'Đã đến giờ thực hiện thiền định 10 phút (22:00)',
    timestamp: new Date().toISOString(),
    isRead: false,
    priority: 'high',
    actionRequired: true,
    relatedId: 'act_1'
  },
  {
    id: '2',
    type: 'appointment',
    title: 'Lịch hẹn tư vấn sắp tới',
    message: 'Bạn có lịch hẹn với Ths. Nguyễn Văn A vào ngày mai lúc 09:00',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    priority: 'medium',
    actionRequired: false,
    relatedId: 'apt_1'
  },
  {
    id: '3',
    type: 'assessment',
    title: 'Kết quả đánh giá',
    message: 'Kết quả đánh giá tâm lý đã có. Mức độ lo âu: 38/100 (Nhẹ)',
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
    message: 'Hệ thống đã được cập nhật với các tính năng mới về theo dõi cảm xúc',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    priority: 'low',
    actionRequired: false
  },
  {
    id: '5',
    type: 'reminder',
    title: 'Nhắc nhở đánh giá tuần',
    message: 'Đã đến thời gian đánh giá tâm trạng và lo âu tuần này',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    priority: 'high',
    actionRequired: true,
    relatedId: 'reminder_1'
  },
  {
    id: '6',
    type: 'support',
    title: 'Tin nhắn hỗ trợ',
    message: 'Chuyên gia Trần Thị B đã gửi tài liệu hỗ trợ mới cho bạn',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    priority: 'medium',
    actionRequired: true,
    relatedId: 'support_1'
  }
]

const NotificationsCenter: React.FC = () => {  const [allNotifications, setAllNotifications] = useState<NotificationData[]>(mockNotifications)
  const [filteredNotifications, setFilteredNotifications] = useState<NotificationData[]>(mockNotifications)
  const [filterType, setFilterType] = useState<string>('all')
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNotification, setSelectedNotification] = useState<NotificationData | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState<NotificationSettings>({
    activities: true,
    appointments: true,
    assessmentResults: true,
    systemUpdates: true,
    reminderBeforeAppointment: 60,
    activityReminder: true,
    emailNotifications: true,
    smsNotifications: false
  })

  // Animation effect
  useEffect(() => {
    setAnimationVisible(true)
  }, [])

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
      case 'activity': return <Sparkles className="w-5 h-5 text-[#0284c7]" />
      case 'appointment': return <Calendar className="w-5 h-5 text-[#0284c7]" />
      case 'assessment': return <Brain className="w-5 h-5 text-green-600" />
      case 'system': return <Settings className="w-5 h-5 text-gray-600" />
      case 'reminder': return <Bell className="w-5 h-5 text-yellow-600" />
      case 'support': return <MessageCircle className="w-5 h-5 text-[#dc2626]" />
      default: return <Info className="w-5 h-5 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-[#dc2626] bg-gradient-to-r from-red-50 to-red-100'
      case 'high': return 'border-orange-500 bg-gradient-to-r from-orange-50 to-orange-100'
      case 'medium': return 'border-yellow-500 bg-gradient-to-r from-yellow-50 to-yellow-100'
      case 'low': return 'border-[#0284c7] bg-gradient-to-r from-blue-50 to-blue-100'
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
      case 'activity': return 'Hoạt động'
      case 'appointment': return 'Lịch hẹn'
      case 'assessment': return 'Đánh giá'
      case 'system': return 'Hệ thống'
      case 'reminder': return 'Nhắc nhở'
      case 'support': return 'Hỗ trợ'
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
    if (selectedNotification?.id === notificationId) {
      setSelectedNotification(null)
    }
  }

  const deleteAllNotifications = () => {
    setAllNotifications([])
    setSelectedNotification(null)
  }

  const viewNotification = (notification: NotificationData) => {
    if (!notification.isRead) {
      markAsRead(notification.id)
    }
    setSelectedNotification(notification)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="fade-in slide-up">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Bell className="mr-3 text-[#0284c7]" />
              Trung tâm thông báo
            </h1>
            <p className="mt-2 text-gray-600">Quản lý tất cả thông báo và nhắc nhở</p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3 fade-in slide-up" style={{ animationDelay: '200ms' }}>
            <button
              onClick={markAllAsRead}
              className="btn inline-flex items-center px-4 py-2 border border-transparent font-medium rounded-lg text-white bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] hover:from-[#0369a1] hover:to-[#0284c7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0284c7]"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Đánh dấu tất cả đã đọc
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`btn inline-flex items-center px-4 py-2 border border-transparent font-medium rounded-lg ${
                showSettings 
                  ? 'text-white bg-gradient-to-r from-[#dc2626] to-[#ef4444]' 
                  : 'text-gray-700 bg-white hover:bg-gray-50 border-gray-300'
              }`}
            >
              <Settings className={`w-4 h-4 mr-2 ${showSettings ? 'animate-spin-slow' : ''}`} />
              Cài đặt
            </button>
          </div>
        </div>

        {/* Search and filters */}
        <div className="bg-white rounded-xl shadow-lg mb-6 p-4 fade-in" style={{ animationDelay: '300ms' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm thông báo..."
                className="form-input pl-10"
              />
            </div>
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="form-input"
              >
                <option value="all">Tất cả thông báo</option>
                <option value="activity">Hoạt động</option>
                <option value="appointment">Lịch hẹn</option>
                <option value="assessment">Đánh giá</option>
                <option value="system">Hệ thống</option>
                <option value="reminder">Nhắc nhở</option>
                <option value="support">Hỗ trợ</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="unread-only"
                checked={showUnreadOnly}
                onChange={(e) => setShowUnreadOnly(e.target.checked)}
                className="h-5 w-5 text-[#0284c7] border-gray-300 rounded focus:ring-[#0284c7]"
              />
              <label htmlFor="unread-only" className="ml-2 block text-sm text-gray-700">
                Chỉ hiển thị chưa đọc
              </label>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white rounded-xl shadow-lg mb-6 p-6 border border-gray-200 fade-in slide-up">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-[#0284c7]" />
              Cài đặt thông báo
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Loại thông báo</h3>
                <div className="space-y-3">
                  {{
                    id: 'all',
                    name: 'Tất cả',
                    icon: Bell
                  },
                  {
                    id: 'activity',
                    name: 'Hoạt động',
                    icon: Sparkles
                  },
                  {
                    id: 'appointment',
                    name: 'Lịch hẹn',
                    icon: Calendar
                  },
                  {
                    id: 'assessment',
                    name: 'Đánh giá',
                    icon: Brain
                  },
                  {
                    id: 'system',
                    name: 'Hệ thống',
                    icon: Shield
                  }
                  }.map((filter) => (
                    <div key={filter.id} className="flex items-center stagger-item">
                      <input
                        type="checkbox"
                        id={filter.id}
                        checked={settings[filter.id as keyof NotificationSettings] as boolean}
                        onChange={(e) => setSettings({
                          ...settings,
                          [filter.id]: e.target.checked
                        })}
                        className="h-5 w-5 text-[#0284c7] border-gray-300 rounded focus:ring-[#0284c7]"
                      />
                      <label htmlFor={filter.id} className="ml-2 flex items-center text-gray-700">
                        <filter.icon className="w-4 h-4 mr-2 text-[#0284c7]" />
                        {filter.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 mb-3">Cài đặt nhắc nhở</h3>
                <div className="space-y-4">
                  <div className="stagger-item">
                    <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Nhắc trước lịch hẹn (phút)
                    </label>
                    <select
                      id="reminderTime"
                      value={settings.reminderBeforeAppointment}
                      onChange={(e) => setSettings({
                        ...settings,
                        reminderBeforeAppointment: parseInt(e.target.value)
                      })}
                      className="form-input"
                    >
                      <option value={15}>15 phút</option>
                      <option value={30}>30 phút</option>
                      <option value={60}>1 giờ</option>
                      <option value={120}>2 giờ</option>
                      <option value={1440}>1 ngày</option>
                    </select>
                  </div>

                  <div className="flex items-center stagger-item">
                    <input
                      type="checkbox"
                      id="activityReminder"
                      checked={settings.activityReminder}
                      onChange={(e) => setSettings({
                        ...settings,
                        activityReminder: e.target.checked
                      })}
                      className="h-5 w-5 text-[#0284c7] border-gray-300 rounded focus:ring-[#0284c7]"
                    />
                    <label htmlFor="activityReminder" className="ml-2 block text-gray-700">
                      Nhắc nhở hoạt động hàng ngày
                    </label>
                  </div>
                </div>

                <h3 className="font-medium text-gray-700 mt-6 mb-3">Phương thức thông báo</h3>
                <div className="space-y-3">
                  <div className="flex items-center stagger-item">
                    <input
                      type="checkbox"
                      id="emailNotifications"
                      checked={settings.emailNotifications}
                      onChange={(e) => setSettings({
                        ...settings,
                        emailNotifications: e.target.checked
                      })}
                      className="h-5 w-5 text-[#0284c7] border-gray-300 rounded focus:ring-[#0284c7]"
                    />
                    <label htmlFor="emailNotifications" className="ml-2 block text-gray-700">
                      Gửi thông báo qua email
                    </label>
                  </div>

                  <div className="flex items-center stagger-item">
                    <input
                      type="checkbox"
                      id="smsNotifications"
                      checked={settings.smsNotifications}
                      onChange={(e) => setSettings({
                        ...settings,
                        smsNotifications: e.target.checked
                      })}
                      className="h-5 w-5 text-[#0284c7] border-gray-300 rounded focus:ring-[#0284c7]"
                    />
                    <label htmlFor="smsNotifications" className="ml-2 block text-gray-700">
                      Gửi thông báo qua SMS
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  // Save settings logic would go here
                  setShowSettings(false)
                }}
                className="px-4 py-2 bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white rounded-lg hover:from-[#0369a1] hover:to-[#0284c7]"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white flex justify-between items-center">
                <h2 className="text-xl font-semibold">Thông báo của bạn</h2>
                <span className="bg-white text-[#0284c7] py-1 px-3 rounded-full text-sm font-medium">
                  {filteredNotifications.filter(n => !n.isRead).length} chưa đọc
                </span>
              </div>

              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 fade-in">
                  <Bell className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-lg font-medium">Không có thông báo nào</p>
                  <p className="mt-1">Tất cả thông báo của bạn sẽ xuất hiện ở đây</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                  {filteredNotifications.map((notification, index) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-all duration-300 ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      } fade-in stagger-item`}
                      onClick={() => {
                        setSelectedNotification(notification)
                        if (!notification.isRead) {
                          markAsRead(notification.id)
                        }
                      }}
                    >
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                          notification.priority === 'urgent' ? 'bg-red-100' : 
                          notification.priority === 'high' ? 'bg-orange-100' :
                          notification.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${!notification.isRead ? 'text-[#0284c7]' : 'text-gray-900'}`}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatTimestamp(notification.timestamp)}
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="mt-2 flex items-center text-xs">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded ${
                              notification.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                              notification.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                              notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {getPriorityText(notification.priority)}
                            </span>
                            <span className="mx-2 text-gray-500">•</span>
                            <span className="text-gray-500">{getTypeText(notification.type)}</span>
                            {notification.actionRequired && (
                              <>
                                <span className="mx-2 text-gray-500">•</span>
                                <span className="text-[#dc2626]">Yêu cầu hành động</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notification Detail Panel */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg h-full">
              {selectedNotification ? (
                <div className="h-full flex flex-col fade-in">
                  <div className="p-4 bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white flex justify-between items-center rounded-t-xl">
                    <h2 className="text-xl font-semibold">Chi tiết</h2>
                    <button 
                      onClick={() => setSelectedNotification(null)}
                      className="text-white hover:text-gray-200"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="p-6 flex-1 overflow-y-auto">
                    <div className="mb-6">
                      <div className="flex items-center mb-4">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                          selectedNotification.priority === 'urgent' ? 'bg-red-100' : 
                          selectedNotification.priority === 'high' ? 'bg-orange-100' :
                          selectedNotification.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                        }`}>
                          {getNotificationIcon(selectedNotification.type)}
                        </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-medium text-gray-900">{selectedNotification.title}</h3>
                          <p className="text-sm text-gray-500">{formatTimestamp(selectedNotification.timestamp)}</p>
                        </div>
                      </div>
                      <div className="prose prose-sm text-gray-700">
                        <p>{selectedNotification.message}</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Loại</span>
                        <span className="text-sm font-medium text-gray-900">{getTypeText(selectedNotification.type)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Độ ưu tiên</span>
                        <span className={`text-sm font-medium ${
                          selectedNotification.priority === 'urgent' ? 'text-red-600' : 
                          selectedNotification.priority === 'high' ? 'text-orange-600' :
                          selectedNotification.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                        }`}>
                          {getPriorityText(selectedNotification.priority)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Trạng thái</span>
                        <span className={`text-sm font-medium ${selectedNotification.isRead ? 'text-gray-600' : 'text-[#0284c7]'}`}>
                          {selectedNotification.isRead ? 'Đã đọc' : 'Chưa đọc'}
                        </span>
                      </div>
                      {selectedNotification.actionRequired && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Hành động</span>
                          <span className="text-sm font-medium text-[#dc2626]">Yêu cầu phản hồi</span>
                        </div>
                      )}
                    </div>

                    {selectedNotification.actionRequired && (
                      <div className="mt-6">
                        <button
                          className="w-full px-4 py-2 bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white rounded-lg hover:from-[#0369a1] hover:to-[#0284c7] flex items-center justify-center"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Thực hiện hành động
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-500 fade-in">
                  <Bell className="w-16 h-16 text-gray-300 mb-3" />
                  <p className="text-lg font-medium">Chọn một thông báo</p>
                  <p className="mt-1">Chọn một thông báo để xem chi tiết</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notification Tips */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 shadow-md fade-in" style={{ animationDelay: '800ms' }}>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <Info className="w-5 h-5 mr-2 text-[#0284c7]" />
            Mẹo quản lý thông báo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 stagger-item">
              <div className="flex items-center mb-3">
                <Bell className="w-5 h-5 text-[#0284c7] mr-2" />
                <h4 className="font-medium text-gray-900">Tùy chỉnh thông báo</h4>
              </div>
              <p className="text-sm text-gray-600">
                Sử dụng cài đặt để tùy chỉnh loại thông báo bạn muốn nhận và cách bạn nhận chúng.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 stagger-item">
              <div className="flex items-center mb-3">
                <Clock className="w-5 h-5 text-[#0284c7] mr-2" />
                <h4 className="font-medium text-gray-900">Nhắc nhở đúng lúc</h4>
              </div>
              <p className="text-sm text-gray-600">
                Thiết lập nhắc nhở hoạt động hàng ngày giúp bạn duy trì thói quen sức khỏe tinh thần.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 stagger-item">
              <div className="flex items-center mb-3">
                <CheckCircle className="w-5 h-5 text-[#0284c7] mr-2" />
                <h4 className="font-medium text-gray-900">Thực hiện ngay</h4>
              </div>
              <p className="text-sm text-gray-600">
                Phản hồi nhanh các thông báo có yêu cầu hành động để duy trì lộ trình phục hồi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationsCenter
