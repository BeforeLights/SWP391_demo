import React, { useState, useEffect } from 'react'
import {
  Bell, Clock, Calendar, Brain, HeartPulse,
  CheckCircle, Info, X, Settings,
  Search, Trash2, Sparkles, MessageCircle, Activity
} from 'lucide-react'
import { format, isToday, isYesterday, parseISO } from 'date-fns'
import { vi } from 'date-fns/locale'

interface NotificationData {
  id: string
  type: 'activity' | 'appointment' | 'mood' | 'system' | 'reminder'
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
  mentalActivities: boolean
  appointments: boolean
  moodTracking: boolean
  systemUpdates: boolean
  reminderBeforeAppointment: number // minutes
  activityReminders: boolean
  emailNotifications: boolean
  smsNotifications: boolean
}

// Mock notifications data for mental health focus
const mockNotifications: NotificationData[] = [
  {
    id: '1',
    type: 'activity',
    title: 'Nhắc nhở hoạt động',
    message: 'Đã đến giờ cho buổi thiền 15 phút của bạn (22:00)',
    timestamp: new Date().toISOString(),
    isRead: false,
    priority: 'high',
    actionRequired: true,
    relatedId: 'act_1'
  },
  {
    id: '2',
    type: 'appointment',
    title: 'Lịch hẹn sắp tới',
    message: 'Bạn có lịch hẹn tư vấn với Ths. Nguyễn Văn A vào ngày mai lúc 09:00',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    priority: 'medium',
    actionRequired: false,
    relatedId: 'apt_1'
  },
  {
    id: '3',
    type: 'mood',
    title: 'Kết quả theo dõi tâm trạng',
    message: 'Mức độ lo âu giảm 15% trong tuần này. Tiếp tục giữ vững!',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    priority: 'medium',
    actionRequired: false,
    relatedId: 'mood_1'
  },
  {
    id: '4',
    type: 'system',
    title: 'Cập nhật hệ thống',
    message: 'YOU ARE HEARD vừa cập nhật tính năng mới về theo dõi giấc ngủ',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    priority: 'low',
    actionRequired: false
  },
  {
    id: '5',
    type: 'reminder',
    title: 'Nhắc nhở đánh giá',
    message: 'Đã đến lúc cập nhật mức độ lo âu và trầm cảm hàng tuần',
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
    mentalActivities: true,
    appointments: true,
    moodTracking: true,
    systemUpdates: true,
    reminderBeforeAppointment: 60,
    activityReminders: true,
    emailNotifications: true,
    smsNotifications: false
  })
  const [animationVisible, setAnimationVisible] = useState(false)

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
      case 'activity': return <Sparkles className="w-5 h-5 text-purple-600" />
      case 'appointment': return <Calendar className="w-5 h-5 text-[#0284c7]" />
      case 'mood': return <HeartPulse className="w-5 h-5 text-[#dc2626]" />
      case 'system': return <Settings className="w-5 h-5 text-gray-600" />
      case 'reminder': return <Bell className="w-5 h-5 text-yellow-600" />
      default: return <Info className="w-5 h-5 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-[#dc2626] bg-red-50'
      case 'high': return 'border-orange-500 bg-orange-50'
      case 'medium': return 'border-yellow-500 bg-yellow-50'
      case 'low': return 'border-[#0284c7] bg-blue-50'
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
      case 'mood': return 'Tâm trạng'
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
    if (selectedNotification?.id === notificationId) {
      setSelectedNotification(null)
    }
  }

  const deleteAllNotifications = () => {
    setAllNotifications([])
    setSelectedNotification(null)
  }

  const handleDeleteRead = () => {
    setAllNotifications(notifications =>
      notifications.filter(notification => !notification.isRead)
    )
    setSelectedNotification(null)
  }

  const handleNotificationClick = (notification: NotificationData) => {
    setSelectedNotification(notification)
    if (!notification.isRead) {
      markAsRead(notification.id)
    }
  }

  const handleSaveSettings = () => {
    // Here you would save the settings to an API
    setShowSettings(false)
    // Simulate a confirmation
    alert('Cài đặt thông báo đã được lưu')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="fade-in slide-up">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Bell className="w-8 h-8 mr-3 text-[#0284c7]" />
              <span className="gradient-text">Trung tâm thông báo</span>
            </h1>
            <p className="mt-2 text-gray-600">
              Theo dõi thông báo và nhắc nhở về sức khỏe tinh thần của bạn
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3 fade-in" style={{ animationDelay: '200ms' }}>
            <button 
              onClick={markAllAsRead}
              className="btn-secondary px-4 py-2 text-sm flex items-center"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Đánh dấu tất cả đã đọc
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="btn-outline px-4 py-2 text-sm flex items-center"
            >
              <Settings className="w-4 h-4 mr-2" />
              Cài đặt
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 fade-in" style={{ animationDelay: '300ms' }}>
          <div className="col-span-1 relative">
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
          <div className="col-span-2 flex flex-wrap gap-3">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
                filterType === 'all' 
                  ? 'bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white shadow-md' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Activity className="w-4 h-4 mr-2" />
              Tất cả
            </button>
            <button
              onClick={() => setFilterType('activity')}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
                filterType === 'activity' 
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Hoạt động
            </button>
            <button
              onClick={() => setFilterType('appointment')}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
                filterType === 'appointment' 
                  ? 'bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white shadow-md' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Lịch hẹn
            </button>
            <button
              onClick={() => setFilterType('mood')}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
                filterType === 'mood' 
                  ? 'bg-gradient-to-r from-[#dc2626] to-red-500 text-white shadow-md' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <HeartPulse className="w-4 h-4 mr-2" />
              Tâm trạng
            </button>
            <button
              onClick={() => setFilterType('reminder')}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
                filterType === 'reminder' 
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Bell className="w-4 h-4 mr-2" />
              Nhắc nhở
            </button>
            <div className="flex items-center ml-2">
              <input
                id="unread-toggle"
                type="checkbox"
                checked={showUnreadOnly}
                onChange={(e) => setShowUnreadOnly(e.target.checked)}
                className="h-4 w-4 text-[#0284c7] border-gray-300 rounded focus:ring-[#0284c7]"
              />
              <label htmlFor="unread-toggle" className="ml-2 text-sm text-gray-700">
                Chỉ hiện chưa đọc
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Notification List */}
          <div className="w-full md:w-2/5 lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">
                  Thông báo ({filteredNotifications.filter(n => !n.isRead).length} chưa đọc)
                </h2>
                <div className="flex space-x-2">
                  <button 
                    onClick={handleDeleteRead}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-200 max-h-[70vh] overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                  <div className="py-8 text-center">
                    <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Không có thông báo nào</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification, index) => (
                    <div 
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 cursor-pointer transition-all duration-300 ${
                        selectedNotification?.id === notification.id 
                          ? 'bg-blue-50' 
                          : notification.isRead ? 'bg-white hover:bg-gray-50' : 'bg-blue-50/50 hover:bg-blue-50'
                      } stagger-item`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex">
                        <div className={`mr-3 p-2 rounded-full ${
                          notification.type === 'activity' ? 'bg-purple-100' :
                          notification.type === 'mood' ? 'bg-red-100' :
                          notification.type === 'appointment' ? 'bg-blue-100' :
                          notification.type === 'reminder' ? 'bg-yellow-100' : 'bg-gray-100'
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className={`font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                              {notification.title}
                            </p>
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                          </div>
                          <p className={`text-sm mt-1 ${!notification.isRead ? 'text-gray-800' : 'text-gray-500'}`}>
                            {notification.message.length > 80 
                              ? `${notification.message.substring(0, 80)}...` 
                              : notification.message}
                          </p>
                          <div className="flex items-center mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              notification.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                              notification.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                              notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {getPriorityText(notification.priority)}
                            </span>
                            {notification.actionRequired && (
                              <span className="ml-2 text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                                Yêu cầu hành động
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Notification Detail */}
          <div className="w-full md:w-3/5 lg:w-2/3">
            {selectedNotification ? (
              <div className="card-glow fade-in">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div className={`mr-3 p-2 rounded-full ${
                      selectedNotification.type === 'activity' ? 'bg-purple-100' :
                      selectedNotification.type === 'mood' ? 'bg-red-100' :
                      selectedNotification.type === 'appointment' ? 'bg-blue-100' :
                      selectedNotification.type === 'reminder' ? 'bg-yellow-100' : 'bg-gray-100'
                    }`}>
                      {getNotificationIcon(selectedNotification.type)}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{selectedNotification.title}</h2>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-gray-500">
                          {formatTimestamp(selectedNotification.timestamp)}
                        </span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          selectedNotification.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          selectedNotification.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          selectedNotification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {getPriorityText(selectedNotification.priority)}
                        </span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-sm text-gray-500">
                          {getTypeText(selectedNotification.type)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => deleteNotification(selectedNotification.id)}
                      className="text-gray-500 hover:text-red-600 transition-colors duration-200"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setSelectedNotification(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <p className="text-gray-800 leading-relaxed">{selectedNotification.message}</p>
                </div>

                {selectedNotification.actionRequired && (
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg mb-6">
                    <div className="flex items-center">
                      <Info className="w-5 h-5 text-purple-600 mr-2" />
                      <p className="text-sm text-purple-800">
                        Thông báo này yêu cầu hành động từ bạn
                      </p>
                    </div>
                    <button className="btn-primary px-4 py-2 text-sm">
                      Thực hiện ngay
                    </button>
                  </div>
                )}

                {selectedNotification.type === 'appointment' && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Chi tiết lịch hẹn</h3>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Chuyên gia</p>
                          <p className="font-medium">Ths. Nguyễn Văn A</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Ngày & Giờ</p>
                          <p className="font-medium">25/12/2024, 09:00</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Loại tư vấn</p>
                          <p className="font-medium">Tư vấn tâm lý cá nhân</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Địa điểm</p>
                          <p className="font-medium">Phòng tư vấn 102, Lầu 1</p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end space-x-3">
                        <button className="btn-outline px-4 py-2 text-sm">
                          Hủy lịch hẹn
                        </button>
                        <button className="btn-secondary px-4 py-2 text-sm">
                          Đặt lại lịch
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedNotification.type === 'activity' && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Chi tiết hoạt động</h3>
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Hoạt động</p>
                          <p className="font-medium">Thiền định hướng</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Thời gian</p>
                          <p className="font-medium">15 phút</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Tần suất</p>
                          <p className="font-medium">Hàng ngày, 22:00</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Lợi ích</p>
                          <p className="font-medium">Giảm lo âu, cải thiện giấc ngủ</p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end space-x-3">
                        <button className="btn-outline px-4 py-2 text-sm">
                          Bỏ qua
                        </button>
                        <button className="btn-primary px-4 py-2 text-sm">
                          Bắt đầu ngay
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedNotification.type === 'mood' && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Chi tiết theo dõi tâm trạng</h3>
                    <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Mức độ lo âu hiện tại</p>
                          <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
                            <div 
                              className="bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] h-4 rounded-full" 
                              style={{ width: '35%' }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>0</span>
                            <span>35%</span>
                            <span>100</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Xu hướng</p>
                          <p className="font-medium text-green-600 flex items-center mt-1">
                            <Activity className="w-4 h-4 mr-1" />
                            Giảm 15% trong 7 ngày qua
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end space-x-3">
                        <button className="btn-secondary px-4 py-2 text-sm">
                          Xem báo cáo đầy đủ
                        </button>
                        <button className="btn-primary px-4 py-2 text-sm">
                          Cập nhật tâm trạng
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  {selectedNotification.actionRequired ? (
                    <button 
                      className="btn-primary px-6 py-3 text-sm inline-flex items-center"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Đánh dấu đã hoàn thành
                    </button>
                  ) : (
                    <button 
                      className="px-4 py-2 text-sm bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-sm hover:shadow-md flex items-center"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Liên hệ hỗ trợ
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="card text-center fade-in">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Không có thông báo nào được chọn</h3>
                <p className="text-gray-500 mb-6">
                  Chọn một thông báo từ danh sách bên trái để xem chi tiết
                </p>
                <div className="flex justify-center">
                  <button 
                    onClick={() => setFilterType('all')}
                    className="btn-primary px-6 py-3 text-sm inline-flex items-center"
                  >
                    <Bell className="w-5 h-5 mr-2" />
                    Xem tất cả thông báo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Cài đặt thông báo</h2>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Loại thông báo</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
                          <label htmlFor="activities-toggle" className="text-gray-700">
                            Nhắc nhở hoạt động sức khỏe tinh thần
                          </label>
                        </div>
                        <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                          <input 
                            type="checkbox" 
                            id="activities-toggle" 
                            checked={settings.mentalActivities}
                            onChange={(e) => setSettings({...settings, mentalActivities: e.target.checked})}
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer transition-transform duration-200"
                          />
                          <label 
                            htmlFor="activities-toggle" 
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                              settings.mentalActivities ? 'bg-[#0284c7]' : 'bg-gray-300'
                            }`}
                          ></label>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 text-[#0284c7] mr-2" />
                          <label htmlFor="appointments-toggle" className="text-gray-700">
                            Lịch hẹn tư vấn
                          </label>
                        </div>
                        <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                          <input 
                            type="checkbox" 
                            id="appointments-toggle" 
                            checked={settings.appointments}
                            onChange={(e) => setSettings({...settings, appointments: e.target.checked})}
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer transition-transform duration-200"
                          />
                          <label 
                            htmlFor="appointments-toggle" 
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                              settings.appointments ? 'bg-[#0284c7]' : 'bg-gray-300'
                            }`}
                          ></label>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <HeartPulse className="w-5 h-5 text-[#dc2626] mr-2" />
                          <label htmlFor="mood-toggle" className="text-gray-700">
                            Theo dõi tâm trạng
                          </label>
                        </div>
                        <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                          <input 
                            type="checkbox" 
                            id="mood-toggle" 
                            checked={settings.moodTracking}
                            onChange={(e) => setSettings({...settings, moodTracking: e.target.checked})}
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer transition-transform duration-200"
                          />
                          <label 
                            htmlFor="mood-toggle" 
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                              settings.moodTracking ? 'bg-[#0284c7]' : 'bg-gray-300'
                            }`}
                          ></label>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Settings className="w-5 h-5 text-gray-600 mr-2" />
                          <label htmlFor="system-toggle" className="text-gray-700">
                            Cập nhật hệ thống
                          </label>
                        </div>
                        <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                          <input 
                            type="checkbox" 
                            id="system-toggle" 
                            checked={settings.systemUpdates}
                            onChange={(e) => setSettings({...settings, systemUpdates: e.target.checked})}
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer transition-transform duration-200"
                          />
                          <label 
                            htmlFor="system-toggle" 
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                              settings.systemUpdates ? 'bg-[#0284c7]' : 'bg-gray-300'
                            }`}
                          ></label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Thời gian nhắc nhở</h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="appointment-reminder" className="block text-sm font-medium text-gray-700 mb-1">
                          Nhắc lịch hẹn trước (phút)
                        </label>
                        <select
                          id="appointment-reminder"
                          value={settings.reminderBeforeAppointment}
                          onChange={(e) => setSettings({...settings, reminderBeforeAppointment: parseInt(e.target.value)})}
                          className="form-input"
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

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Phương thức thông báo</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Mail className="w-5 h-5 text-gray-600 mr-2" />
                          <label htmlFor="email-toggle" className="text-gray-700">
                            Thông báo qua Email
                          </label>
                        </div>
                        <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                          <input 
                            type="checkbox" 
                            id="email-toggle" 
                            checked={settings.emailNotifications}
                            onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer transition-transform duration-200"
                          />
                          <label 
                            htmlFor="email-toggle" 
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                              settings.emailNotifications ? 'bg-[#0284c7]' : 'bg-gray-300'
                            }`}
                          ></label>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Smartphone className="w-5 h-5 text-gray-600 mr-2" />
                          <label htmlFor="sms-toggle" className="text-gray-700">
                            Thông báo qua SMS
                          </label>
                        </div>
                        <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                          <input 
                            type="checkbox" 
                            id="sms-toggle" 
                            checked={settings.smsNotifications}
                            onChange={(e) => setSettings({...settings, smsNotifications: e.target.checked})}
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer transition-transform duration-200"
                          />
                          <label 
                            htmlFor="sms-toggle" 
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                              settings.smsNotifications ? 'bg-[#0284c7]' : 'bg-gray-300'
                            }`}
                          ></label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setShowSettings(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSaveSettings}
                      className="btn-primary px-4 py-2 text-sm inline-flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Lưu cài đặt
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .toggle-checkbox:checked {
          transform: translateX(100%);
          border-color: #0284c7;
        }
        .toggle-label {
          transition: background-color 0.2s ease;
        }
      `}</style>
    </div>
  )
}

export default NotificationsCenter
