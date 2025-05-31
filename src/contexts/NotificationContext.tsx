import React, { createContext, useContext, useState } from 'react'

export interface Notification {
  id: string
  type: 'medication' | 'appointment' | 'test' | 'info' | 'success'
  title: string
  message: string
  time: Date
  read: boolean
  actionUrl?: string
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'time' | 'read'>) => void
  markAsRead: (id: string) => void
  clearNotification: (id: string) => void
  unreadCount: number
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export { NotificationContext }

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'medication',
      title: 'Nhắc nhở uống thuốc',
      message: 'Đã đến giờ uống ARV (TDF + 3TC + DTG)',
      time: new Date(),
      read: false,
      actionUrl: '/dashboard'
    },
    {
      id: '2',
      type: 'appointment',
      title: 'Lịch hẹn sắp tới',
      message: 'Bạn có lịch khám với BS. Nguyễn Thị B vào 15:00 ngày mai',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      actionUrl: '/appointments'
    },
    {
      id: '3',
      type: 'test',
      title: 'Kết quả xét nghiệm',
      message: 'Kết quả CD4 mới đã có. Vui lòng xem trong báo cáo.',
      time: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
      actionUrl: '/reports'
    }
  ])

  const addNotification = (notificationData: Omit<Notification, 'id' | 'time' | 'read'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      time: new Date(),
      read: false
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const value = {
    notifications,
    addNotification,
    markAsRead,
    clearNotification,
    unreadCount
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}
