import React, { useState, useEffect } from 'react'
import { 
  Clock, Heart, Plus, Edit, Trash2, Bell,
  CheckCircle, Settings, History, TrendingUp,
  Brain, ActivitySquare, Smile, Frown, Meh, Sun, Sunset
} from 'lucide-react'
import { useNotifications } from '../contexts/NotificationContext'
import { format } from 'date-fns'

interface MentalHealthActivity {
  id: string
  name: string
  description: string
  frequency: 'daily' | 'twice_daily' | 'weekly' | 'as_needed' | 'custom'
  times: string[] // Times of day (e.g., ['08:00', '20:00'])
  startDate: string
  endDate?: string
  instructions: string
  benefits: string[]
  isActive: boolean
  adherenceRate: number
  missedSessions: number
  totalSessions: number
}

interface Reminder {
  id: string
  activityId: string
  activityName: string
  scheduledTime: string
  actualTime?: string
  status: 'pending' | 'completed' | 'missed' | 'skipped'
  moodBefore?: 'happy' | 'neutral' | 'sad' | 'anxious' | 'calm'
  moodAfter?: 'happy' | 'neutral' | 'sad' | 'anxious' | 'calm'
  notes?: string
  date: string
}

// Mock data
const mockActivities: MentalHealthActivity[] = [
  {
    id: '1',
    name: 'Thiền Mindfulness',
    description: 'Tập trung vào hơi thở và khoảnh khắc hiện tại',
    frequency: 'daily',
    times: ['07:00'],
    startDate: '2024-01-15',
    instructions: 'Ngồi ở vị trí thoải mái, tập trung vào hơi thở trong 10-15 phút',
    benefits: ['Giảm căng thẳng', 'Tăng cường tập trung', 'Cải thiện giấc ngủ'],
    isActive: true,
    adherenceRate: 92,
    missedSessions: 4,
    totalSessions: 50
  },
  {
    id: '2',
    name: 'Nhật ký Cảm xúc',
    description: 'Ghi lại cảm xúc và suy nghĩ hàng ngày',
    frequency: 'daily',
    times: ['21:00'],
    startDate: '2024-02-01',
    instructions: 'Viết trong 10-15 phút về cảm xúc, suy nghĩ và trải nghiệm trong ngày',
    benefits: ['Tăng cường nhận thức bản thân', 'Xử lý cảm xúc tiêu cực', 'Phát hiện mẫu hành vi'],
    isActive: true,
    adherenceRate: 85,
    missedSessions: 7,
    totalSessions: 46
  },
  {
    id: '3',
    name: 'Tập thể dục Aerobic',
    description: 'Hoạt động thể chất cường độ vừa phải',
    frequency: 'twice_daily',
    times: ['06:30', '17:30'],
    startDate: '2024-01-20',
    instructions: 'Đi bộ nhanh, chạy bộ hoặc đạp xe 20-30 phút',
    benefits: ['Giảm lo âu', 'Cải thiện tâm trạng', 'Tăng cường sức khỏe tim mạch'],
    isActive: true,
    adherenceRate: 78,
    missedSessions: 12,
    totalSessions: 55
  }
]

const mockReminders: Reminder[] = [
  {
    id: '1',
    activityId: '1',
    activityName: 'Thiền Mindfulness',
    scheduledTime: '07:00',
    status: 'pending',
    date: format(new Date(), 'yyyy-MM-dd')
  },
  {
    id: '2',
    activityId: '2',
    activityName: 'Nhật ký Cảm xúc',
    scheduledTime: '21:00',
    status: 'pending',
    date: format(new Date(), 'yyyy-MM-dd')
  },
  {
    id: '3',
    activityId: '3',
    activityName: 'Tập thể dục Aerobic',
    scheduledTime: '06:30',
    status: 'completed',
    actualTime: '06:45',
    moodBefore: 'anxious',
    moodAfter: 'calm',
    notes: 'Cảm thấy tốt hơn sau khi tập thể dục buổi sáng',
    date: format(new Date(), 'yyyy-MM-dd')
  }
]

const MentalHealthActivities: React.FC = () => {
  const { addNotification } = useNotifications()
  const [activities, setActivities] = useState<MentalHealthActivity[]>(mockActivities)
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders)
  const [activeTab, setActiveTab] = useState<'today' | 'all' | 'history' | 'analytics'>('today')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<MentalHealthActivity | null>(null)
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false)
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null)

  useEffect(() => {
    // Simulate getting data from API
    setActivities(mockActivities)
    setReminders(mockReminders)
  }, [])

  // Check for overdue reminders
  useEffect(() => {
    const checkOverdueReminders = () => {
      const now = new Date()
      const overdueReminders = reminders.filter(reminder => {
        if (reminder.status !== 'pending') return false
        const [hours, minutes] = reminder.scheduledTime.split(':').map(Number)
        const scheduledTime = new Date()
        scheduledTime.setHours(hours, minutes, 0, 0)
        return now > scheduledTime
      })

      overdueReminders.forEach(reminder => {
        addNotification({
          type: 'info',
          title: 'Nhắc nhở hoạt động',
          message: `Đã đến giờ thực hiện ${reminder.activityName}`
        })
      })
    }

    const interval = setInterval(checkOverdueReminders, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [reminders, addNotification])
  const handleActivityStatus = (id: string, completed: boolean) => {
    const reminder = reminders.find(r => r.id === id)
    if (!reminder) return
    
    const updatedReminders = reminders.map(r => 
      r.id === id ? { 
        ...r, 
        status: completed ? 'completed' as const : 'pending' as const, 
        actualTime: completed ? format(new Date(), 'HH:mm') : undefined 
      } : r
    )
    
    setReminders(updatedReminders)
    
    addNotification({
      type: 'info',
      title: `Hoạt động ${completed ? 'đã hoàn thành' : 'chưa hoàn thành'}`,
      message: `${reminder.activityName} đã được đánh dấu là ${completed ? 'hoàn thành' : 'chưa hoàn thành'}`
    })
  }

  const markAsSkipped = (reminderId: string, reason?: string) => {
    setReminders(reminders =>
      reminders.map(reminder =>
        reminder.id === reminderId
          ? { 
              ...reminder, 
              status: 'skipped' as const,
              notes: reason
            }
          : reminder
      )
    )
    
    addNotification({
      type: 'info',
      title: 'Đã ghi nhận',
      message: 'Đã đánh dấu hoạt động là đã bỏ qua'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'missed': return 'bg-red-100 text-red-800'
      case 'skipped': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Đã hoàn thành'
      case 'pending': return 'Chờ thực hiện'
      case 'missed': return 'Bỏ lỡ'
      case 'skipped': return 'Bỏ qua'
      default: return 'Không xác định'
    }
  }

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'Hàng ngày'
      case 'twice_daily': return 'Hai lần/ngày'
      case 'weekly': return 'Hàng tuần'
      case 'as_needed': return 'Khi cần thiết'
      case 'custom': return 'Tùy chỉnh'
      default: return frequency
    }
  }

  const getAdherenceColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600'
    if (rate >= 85) return 'text-yellow-600'
    return 'text-red-600'
  }

  const todaysPendingCount = reminders.filter(r => r.status === 'pending').length
  const todaysCompletedCount = reminders.filter(r => r.status === 'completed').length
  const overallAdherence = Math.round(
    activities.reduce((sum, act) => sum + act.adherenceRate, 0) / activities.length
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-slate-900">Sức khỏe Tinh thần</h1>
          <p className="mt-2 text-slate-600">Theo dõi và quản lý các hoạt động hỗ trợ sức khỏe tinh thần của bạn</p>
        </div>
        
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-fade-in" style={{animationDelay: '0.1s'}}>
          <div className="card bg-gradient-to-br from-brand-50 to-brand-100 border-brand-200">
            <div className="flex items-center">
              <div className="bg-brand-100 p-3 rounded-full">
                <ActivitySquare className="h-6 w-6 text-brand-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Hoạt động Hiện tại</p>
                <p className="text-2xl font-bold text-slate-900">{activities.filter(m => m.isActive).length}</p>
              </div>
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-ocean-50 to-ocean-100 border-ocean-200">
            <div className="flex items-center">
              <div className="bg-ocean-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-ocean-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Tỷ lệ Hoàn thành</p>
                <p className="text-2xl font-bold text-slate-900">
                  {Math.round(activities.reduce((acc, curr) => acc + curr.adherenceRate, 0) / activities.length)}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <Smile className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Tâm trạng Hôm nay</p>
                <p className="text-2xl font-bold text-slate-900">Tích cực</p>
              </div>
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
            <div className="flex items-center">
              <div className="bg-slate-100 p-3 rounded-full">
                <Sun className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Thời gian Hoạt động</p>
                <p className="text-2xl font-bold text-slate-900">25 ngày</p>
              </div>
            </div>
          </div>
        </div>        {/* Navigation Tabs */}
        <div className="flex space-x-1 border-b border-gray-200 mb-6 animate-fade-in rounded-t-xl bg-gradient-to-r from-slate-50 to-white p-1" style={{animationDelay: '0.2s'}}>
          <button
            onClick={() => setActiveTab('today')}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-all duration-300 flex items-center ${
              activeTab === 'today'
                ? 'bg-gradient-to-r from-brand-500 to-ocean-600 text-white shadow-lg'
                : 'text-slate-600 hover:bg-slate-100 hover:text-ocean-600'
            }`}
          >
            <Sun className={`h-4 w-4 mr-2 ${activeTab === 'today' ? 'animate-pulse' : ''}`} />
            Hoạt động Hôm nay
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-all duration-300 flex items-center ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-brand-500 to-ocean-600 text-white shadow-lg'
                : 'text-slate-600 hover:bg-slate-100 hover:text-ocean-600'
            }`}
          >
            <ActivitySquare className={`h-4 w-4 mr-2 ${activeTab === 'all' ? 'animate-pulse' : ''}`} />
            Tất cả Hoạt động
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-all duration-300 flex items-center ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-brand-500 to-ocean-600 text-white shadow-lg'
                : 'text-slate-600 hover:bg-slate-100 hover:text-ocean-600'
            }`}
          >
            <History className={`h-4 w-4 mr-2 ${activeTab === 'history' ? 'animate-pulse' : ''}`} />
            Lịch sử
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-all duration-300 flex items-center ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-brand-500 to-ocean-600 text-white shadow-lg'
                : 'text-slate-600 hover:bg-slate-100 hover:text-ocean-600'
            }`}
          >
            <TrendingUp className={`h-4 w-4 mr-2 ${activeTab === 'analytics' ? 'animate-pulse' : ''}`} />
            Phân tích
          </button>
          
          <div className="ml-auto">
            <button
              onClick={() => {
                setSelectedActivity(null)
                setIsAddModalOpen(true)
              }}
              className="bg-gradient-to-r from-brand-600 to-ocean-600 hover:from-brand-700 hover:to-ocean-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-all transform hover:scale-[1.02]"
            >
              <Plus className="h-4 w-4 mr-1" />
              Thêm hoạt động
            </button>
          </div>
        </div>        {/* Today's Activities */}
        {activeTab === 'today' && (
          <div className="space-y-4 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-brand-600 to-ocean-600 bg-clip-text text-transparent">Hoạt động hôm nay</h2>
              <p className="text-sm text-slate-600 bg-ocean-50 px-3 py-1 rounded-full shadow-sm animate-pulse">
                {format(new Date(), 'EEEE, dd/MM/yyyy')}
              </p>
            </div>

            {reminders.length === 0 ? (
              <div className="card text-center py-12 animate-float">
                <div className="mx-auto w-20 h-20 bg-gradient-to-r from-brand-100 to-ocean-100 rounded-full flex items-center justify-center mb-6 shadow-lg animate-pulse">
                  <Sun className="h-10 w-10 text-ocean-600" />
                </div>
                <h3 className="text-xl font-medium text-slate-900 mb-3">Không có hoạt động nào</h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">Bạn không có hoạt động nào được lên lịch cho hôm nay. Hãy thêm một hoạt động mới để chăm sóc sức khỏe tinh thần của bạn.</p>
                <button
                  onClick={() => {
                    setSelectedActivity(null)
                    setIsAddModalOpen(true)
                  }}
                  className="bg-gradient-to-r from-brand-600 to-ocean-600 hover:from-brand-700 hover:to-ocean-700 text-white px-6 py-3 rounded-xl font-medium inline-flex items-center transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Plus className="h-5 w-5 mr-2 animate-bounce-gentle" />
                  Thêm hoạt động mới
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 animate-stagger">
                {reminders.map((reminder, index) => (
                  <div 
                    key={reminder.id} 
                    className={`card border-l-4 transition-all hover:shadow-xl transform hover:-translate-y-1 stagger-item ${
                      reminder.status === 'completed' 
                        ? 'border-l-green-500 bg-gradient-to-r from-green-50 to-white'
                        : reminder.status === 'missed'
                        ? 'border-l-red-500 bg-gradient-to-r from-red-50 to-white'
                        : 'border-l-ocean-500 bg-gradient-to-r from-ocean-50 to-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-4">
                          {reminder.status === 'completed' ? (
                            <div className="bg-green-100 p-2 rounded-full">
                              <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                          ) : reminder.status === 'missed' ? (
                            <div className="bg-red-100 p-2 rounded-full">
                              <Frown className="h-6 w-6 text-red-600" />
                            </div>
                          ) : (
                            <div className="bg-ocean-100 p-2 rounded-full">
                              <Brain className="h-6 w-6 text-ocean-600" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-slate-900">{reminder.activityName}</h3>
                          <div className="flex items-center text-sm text-slate-600">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{reminder.scheduledTime}</span>
                            {reminder.actualTime && (
                              <span className="ml-2 text-green-600">
                                (Hoàn thành lúc {reminder.actualTime})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {reminder.status === 'pending' && (
                          <button
                            onClick={() => handleActivityStatus(reminder.id, true)}
                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                        )}
                        
                        {reminder.status === 'completed' && (
                          <button
                            onClick={() => handleActivityStatus(reminder.id, false)}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 p-2 rounded-full transition-colors"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {reminder.status === 'completed' && reminder.moodAfter && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center">
                          <div className="flex items-center mr-4">
                            <span className="text-sm text-slate-600 mr-2">Tâm trạng trước:</span>
                            {reminder.moodBefore === 'happy' && <Smile className="h-5 w-5 text-green-500" />}
                            {reminder.moodBefore === 'neutral' && <Meh className="h-5 w-5 text-yellow-500" />}
                            {reminder.moodBefore === 'sad' && <Frown className="h-5 w-5 text-red-500" />}
                            {reminder.moodBefore === 'anxious' && <Frown className="h-5 w-5 text-purple-500" />}
                            {reminder.moodBefore === 'calm' && <Smile className="h-5 w-5 text-blue-500" />}
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm text-slate-600 mr-2">Tâm trạng sau:</span>
                            {reminder.moodAfter === 'happy' && <Smile className="h-5 w-5 text-green-500" />}
                            {reminder.moodAfter === 'neutral' && <Meh className="h-5 w-5 text-yellow-500" />}
                            {reminder.moodAfter === 'sad' && <Frown className="h-5 w-5 text-red-500" />}
                            {reminder.moodAfter === 'anxious' && <Frown className="h-5 w-5 text-purple-500" />}
                            {reminder.moodAfter === 'calm' && <Smile className="h-5 w-5 text-blue-500" />}
                          </div>
                        </div>
                        {reminder.notes && (
                          <p className="mt-2 text-sm text-slate-600">
                            {reminder.notes}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* All Activities Tab */}
        {activeTab === 'all' && (
          <div className="space-y-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-900">Tất cả Hoạt động</h2>
              <button
                onClick={() => {
                  setSelectedActivity(null)
                  setIsAddModalOpen(true)
                }}
                className="btn-secondary inline-flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Thêm hoạt động
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {activities.map((activity) => (
                <div key={activity.id} className="card animate-slide-up">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <div className="mr-4">
                        <div className="bg-ocean-100 p-3 rounded-full">
                          <Brain className="h-6 w-6 text-ocean-600" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-slate-900">{activity.name}</h3>
                          {activity.isActive ? (
                            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                              Đang hoạt động
                            </span>
                          ) : (
                            <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-800 text-xs rounded-full">
                              Không hoạt động
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mt-1">{activity.description}</p>
                        
                        <div className="mt-3 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-slate-500">Tần suất</p>
                            <p className="text-sm text-slate-700">
                              {activity.frequency === 'daily' && 'Hàng ngày'}
                              {activity.frequency === 'twice_daily' && 'Hai lần mỗi ngày'}
                              {activity.frequency === 'weekly' && 'Hàng tuần'}
                              {activity.frequency === 'as_needed' && 'Khi cần thiết'}
                              {activity.frequency === 'custom' && 'Tùy chỉnh'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Thời gian</p>
                            <p className="text-sm text-slate-700">{activity.times.join(', ')}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Ngày bắt đầu</p>
                            <p className="text-sm text-slate-700">{activity.startDate}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Tỷ lệ thực hiện</p>
                            <div className="flex items-center">
                              <div className="w-24 h-2 bg-slate-200 rounded-full mr-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    activity.adherenceRate >= 80 ? 'bg-green-500' : 
                                    activity.adherenceRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${activity.adherenceRate}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-slate-700">{activity.adherenceRate}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedActivity(activity)
                          setIsEditModalOpen(true)
                        }}
                        className="p-2 text-slate-600 hover:text-ocean-600 hover:bg-ocean-50 rounded-full transition-colors"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          // Handle delete
                          addNotification({
                            type: 'info',
                            title: 'Hoạt động đã xóa',
                            message: `${activity.name} đã được xóa thành công`
                          })
                        }}
                        className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  {activity.benefits.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-slate-500 mb-2">Lợi ích</p>
                      <div className="flex flex-wrap gap-2">
                        {activity.benefits.map((benefit, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-ocean-100 text-ocean-800"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Lịch sử hoạt động</h2>
            
            <div className="card">
              <div className="text-center py-12">
                <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Lịch sử hoạt động sẽ được hiển thị ở đây</p>
                <p className="text-sm text-gray-500">Chức năng đang được phát triển</p>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Phân tích hoạt động</h2>
            
            <div className="card">
              <div className="text-center py-12">
                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Phân tích hoạt động sẽ được hiển thị ở đây</p>
                <p className="text-sm text-gray-500">Chức năng đang được phát triển</p>
              </div>
            </div>
          </div>
        )}

        {/* Add Activity Modal Placeholder */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thêm hoạt động mới</h3>
              <p className="text-gray-600 mb-4">Chức năng thêm hoạt động sẽ được triển khai sớm</p>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="btn btn-secondary w-full"
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {/* Edit Activity Modal */}
        {isEditModalOpen && selectedActivity && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-900">Chỉnh sửa hoạt động</h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên hoạt động</label>
                  <input
                    type="text"
                    value={selectedActivity.name}
                    onChange={e => setSelectedActivity({ ...selectedActivity, name: e.target.value })}
                    className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-medical-500 focus:border-medical-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <textarea
                    value={selectedActivity.description}
                    onChange={e => setSelectedActivity({ ...selectedActivity, description: e.target.value })}
                    className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-medical-500 focus:border-medical-500"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tần suất</label>
                  <select
                    value={selectedActivity.frequency}
                    onChange={e => setSelectedActivity({ ...selectedActivity, frequency: e.target.value as any })}
                    className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-medical-500 focus:border-medical-500"
                  >
                    <option value="daily">Hàng ngày</option>
                    <option value="twice_daily">Hai lần/ngày</option>
                    <option value="weekly">Hàng tuần</option>
                    <option value="as_needed">Khi cần thiết</option>
                    <option value="custom">Tùy chỉnh</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giờ thực hiện</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedActivity.times.map((time, index) => (
                      <div key={index} className="flex items-center bg-medical-100 text-medical-800 text-xs px-3 py-1 rounded">
                        {time}
                        <button
                          onClick={() => setSelectedActivity({ 
                            ...selectedActivity, 
                            times: selectedActivity.times.filter(t => t !== time) 
                          })}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => setSelectedActivity({ 
                        ...selectedActivity, 
                        times: [...selectedActivity.times, ''] 
                      })}
                      className="text-medical-600 hover:text-medical-800 text-xs font-medium"
                    >
                      + Thêm giờ
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hướng dẫn thực hiện</label>
                  <textarea
                    value={selectedActivity.instructions}
                    onChange={e => setSelectedActivity({ ...selectedActivity, instructions: e.target.value })}
                    className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-medical-500 focus:border-medical-500"
                    rows={3}
                  />
                </div>
                
                {selectedActivity.benefits.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lợi ích có thể đạt được</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedActivity.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded">
                          {benefit}
                          <button
                            onClick={() => setSelectedActivity({ 
                              ...selectedActivity, 
                              benefits: selectedActivity.benefits.filter(b => b !== benefit) 
                            })}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => setSelectedActivity({ 
                          ...selectedActivity, 
                          benefits: [...selectedActivity.benefits, ''] 
                        })}
                        className="text-yellow-600 hover:text-yellow-800 text-xs font-medium"
                      >
                        + Thêm lợi ích
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <p className={`text-lg font-bold ${getAdherenceColor(selectedActivity.adherenceRate)}`}>
                      {selectedActivity.adherenceRate}%
                    </p>
                    <p className="text-xs text-gray-600">Tuân thủ</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">
                      {selectedActivity.totalSessions - selectedActivity.missedSessions}/{selectedActivity.totalSessions}
                    </p>
                    <p className="text-xs text-gray-600">Đã thực hiện</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    setActivities(activities.map(act => act.id === selectedActivity.id ? selectedActivity : act))
                    setIsEditModalOpen(false)
                    addNotification({
                      type: 'success',
                      title: 'Cập nhật hoạt động',
                      message: 'Đã cập nhật thông tin hoạt động thành công'
                    })
                  }}
                  className="btn btn-primary"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Activity Detail Modal */}
        {selectedActivity && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-900">Chi tiết hoạt động</h3>
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedActivity.name}</h4>
                  <p className="text-gray-600">Mô tả: {selectedActivity.description}</p>
                  <p className="text-gray-600">Tần suất: {getFrequencyText(selectedActivity.frequency)}</p>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Giờ thực hiện hàng ngày:</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedActivity.times.map((time, index) => (
                      <span key={index} className="bg-medical-100 text-medical-800 px-3 py-1 rounded">
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Hướng dẫn thực hiện:</h5>
                  <p className="text-gray-600">{selectedActivity.instructions}</p>
                </div>
                
                {selectedActivity.benefits.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Lợi ích có thể đạt được:</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedActivity.benefits.map((benefit, index) => (
                        <span key={index} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <p className={`text-xl font-bold ${getAdherenceColor(selectedActivity.adherenceRate)}`}>
                      {selectedActivity.adherenceRate}%
                    </p>
                    <p className="text-sm text-gray-600">Tuân thủ kế hoạch</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-green-600">
                      {selectedActivity.totalSessions - selectedActivity.missedSessions}
                    </p>
                    <p className="text-sm text-gray-600">Lần đã thực hiện</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-red-600">{selectedActivity.missedSessions}</p>
                    <p className="text-sm text-gray-600">Lần bỏ lỡ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MentalHealthActivities
