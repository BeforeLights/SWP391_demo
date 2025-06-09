import React, { useState, useEffect } from 'react'
import { 
  Clock, Pill, Plus, Edit, Trash2, Bell,
  CheckCircle, Settings, History, TrendingUp
} from 'lucide-react'
import { useNotifications } from '../contexts/NotificationContext'
import { format } from 'date-fns'

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: 'once' | 'twice' | 'three_times' | 'four_times' | 'as_needed'
  times: string[] // Times of day (e.g., ['08:00', '20:00'])
  startDate: string
  endDate?: string
  instructions: string
  sideEffects: string[]
  isActive: boolean
  adherenceRate: number
  missedDoses: number
  totalDoses: number
}

interface Reminder {
  id: string
  medicationId: string
  medicationName: string
  dosage: string
  scheduledTime: string
  actualTime?: string
  status: 'pending' | 'taken' | 'missed' | 'skipped'
  notes?: string
  date: string
}

// Mock data
const mockMedications: Medication[] = [
  {
    id: '1',
    name: 'Efavirenz/Emtricitabine/Tenofovir (Atripla)',
    dosage: '600mg/200mg/300mg',
    frequency: 'once',
    times: ['22:00'],
    startDate: '2024-01-15',
    instructions: 'Uống vào buổi tối, tránh thức ăn nhiều chất béo',
    sideEffects: ['Chóng mặt', 'Mệt mỏi', 'Mơ lạ'],
    isActive: true,
    adherenceRate: 94,
    missedDoses: 3,
    totalDoses: 50
  },
  {
    id: '2',
    name: 'Dolutegravir (Tivicay)',
    dosage: '50mg',
    frequency: 'once',
    times: ['08:00'],
    startDate: '2024-01-15',
    instructions: 'Uống cùng với bữa ăn',
    sideEffects: ['Buồn nôn nhẹ', 'Đau đầu'],
    isActive: true,
    adherenceRate: 98,
    missedDoses: 1,
    totalDoses: 50
  },
  {
    id: '3',
    name: 'Vitamin D3',
    dosage: '1000 IU',
    frequency: 'once',
    times: ['08:00'],
    startDate: '2024-01-15',
    instructions: 'Uống cùng với bữa sáng',
    sideEffects: [],
    isActive: true,
    adherenceRate: 86,
    missedDoses: 7,
    totalDoses: 50
  }
]

const mockTodayReminders: Reminder[] = [
  {
    id: '1',
    medicationId: '2',
    medicationName: 'Dolutegravir (Tivicay)',
    dosage: '50mg',
    scheduledTime: '08:00',
    actualTime: '08:15',
    status: 'taken',
    date: new Date().toISOString().split('T')[0],
    notes: 'Uống với bữa sáng'
  },
  {
    id: '2',
    medicationId: '3',
    medicationName: 'Vitamin D3',
    dosage: '1000 IU',
    scheduledTime: '08:00',
    status: 'pending',
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: '3',
    medicationId: '1',
    medicationName: 'Efavirenz/Emtricitabine/Tenofovir (Atripla)',
    dosage: '600mg/200mg/300mg',
    scheduledTime: '22:00',
    status: 'pending',
    date: new Date().toISOString().split('T')[0]
  }
]

const MedicationReminders: React.FC = () => {
  const { addNotification } = useNotifications()
  const [medications] = useState<Medication[]>(mockMedications)
  const [todayReminders, setTodayReminders] = useState<Reminder[]>(mockTodayReminders)
  const [activeTab, setActiveTab] = useState<'today' | 'medications' | 'history' | 'settings'>('today')
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  // Check for overdue reminders
  useEffect(() => {
    const checkOverdueReminders = () => {
      const now = new Date()
      const overdueReminders = todayReminders.filter(reminder => {
        if (reminder.status !== 'pending') return false
        const [hours, minutes] = reminder.scheduledTime.split(':').map(Number)
        const scheduledTime = new Date()
        scheduledTime.setHours(hours, minutes, 0, 0)
        return now > scheduledTime
      })

      overdueReminders.forEach(reminder => {
        addNotification({
          type: 'info',
          title: 'Nhắc nhở uống thuốc',
          message: `Đã đến giờ uống ${reminder.medicationName}`
        })
      })
    }

    const interval = setInterval(checkOverdueReminders, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [todayReminders, addNotification])

  const markAsTaken = (reminderId: string, actualTime?: string) => {
    setTodayReminders(reminders =>
      reminders.map(reminder =>
        reminder.id === reminderId
          ? { 
              ...reminder, 
              status: 'taken' as const,
              actualTime: actualTime || format(new Date(), 'HH:mm')
            }
          : reminder
      )
    )
    
    addNotification({
      type: 'info',
      title: 'Đã ghi nhận',
      message: 'Đã đánh dấu đã uống thuốc'
    })
  }

  const markAsSkipped = (reminderId: string, reason?: string) => {
    setTodayReminders(reminders =>
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
      message: 'Đã đánh dấu bỏ qua liều thuốc'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'taken': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'missed': return 'bg-red-100 text-red-800'
      case 'skipped': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'taken': return 'Đã uống'
      case 'pending': return 'Chờ uống'
      case 'missed': return 'Bỏ lỡ'
      case 'skipped': return 'Bỏ qua'
      default: return 'Không xác định'
    }
  }

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'once': return 'Một lần/ngày'
      case 'twice': return 'Hai lần/ngày'
      case 'three_times': return 'Ba lần/ngày'
      case 'four_times': return 'Bốn lần/ngày'
      case 'as_needed': return 'Khi cần thiết'
      default: return frequency
    }
  }

  const getAdherenceColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600'
    if (rate >= 85) return 'text-yellow-600'
    return 'text-red-600'
  }

  const todaysPendingCount = todayReminders.filter(r => r.status === 'pending').length
  const todaysTakenCount = todayReminders.filter(r => r.status === 'taken').length
  const overallAdherence = Math.round(
    medications.reduce((sum, med) => sum + med.adherenceRate, 0) / medications.length
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Nhắc nhở uống thuốc</h1>
          <p className="mt-2 text-gray-600">Quản lý và theo dõi việc uống thuốc hàng ngày</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <Bell className="w-8 h-8 text-medical-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-medical-600">{todaysPendingCount}</h3>
            <p className="text-gray-600">Chờ uống hôm nay</p>
          </div>
          <div className="card text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-green-600">{todaysTakenCount}</h3>
            <p className="text-gray-600">Đã uống hôm nay</p>
          </div>
          <div className="card text-center">
            <Pill className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-blue-600">{medications.filter(m => m.isActive).length}</h3>
            <p className="text-gray-600">Thuốc đang dùng</p>
          </div>
          <div className="card text-center">
            <TrendingUp className={`w-8 h-8 mx-auto mb-2 ${getAdherenceColor(overallAdherence)}`} />
            <h3 className={`text-2xl font-bold ${getAdherenceColor(overallAdherence)}`}>{overallAdherence}%</h3>
            <p className="text-gray-600">Tuân thủ điều trị</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'today', label: 'Hôm nay', icon: Clock },
              { id: 'medications', label: 'Danh sách thuốc', icon: Pill },
              { id: 'history', label: 'Lịch sử', icon: History },
              { id: 'settings', label: 'Cài đặt', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-medical-500 text-medical-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Today's Reminders Tab */}
        {activeTab === 'today' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Lịch uống thuốc hôm nay</h2>
            
            <div className="space-y-4">
              {todayReminders.map(reminder => (
                <div key={reminder.id} className="card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          reminder.status === 'taken' ? 'bg-green-100' : 
                          reminder.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                        }`}>
                          <Pill className={`w-6 h-6 ${
                            reminder.status === 'taken' ? 'text-green-600' : 
                            reminder.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                          }`} />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{reminder.medicationName}</h3>
                        <p className="text-gray-600">Liều dùng: {reminder.dosage}</p>
                        <div className="flex items-center mt-1">
                          <Clock className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-600">
                            Giờ dự kiến: {reminder.scheduledTime}
                            {reminder.actualTime && ` | Đã uống lúc: ${reminder.actualTime}`}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reminder.status)}`}>
                          {getStatusText(reminder.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {reminder.status === 'pending' && (
                    <div className="mt-4 flex space-x-3">
                      <button
                        onClick={() => markAsTaken(reminder.id)}
                        className="btn btn-primary btn-sm"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Đã uống
                      </button>
                      <button
                        onClick={() => markAsSkipped(reminder.id, 'Bỏ qua theo ý định')}
                        className="btn btn-secondary btn-sm"
                      >
                        Bỏ qua
                      </button>
                    </div>
                  )}
                  
                  {reminder.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">Ghi chú: {reminder.notes}</p>
                    </div>
                  )}
                </div>
              ))}
              
              {todayReminders.length === 0 && (
                <div className="text-center py-12">
                  <Pill className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Không có thuốc nào cần uống hôm nay</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Medications Tab */}
        {activeTab === 'medications' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Danh sách thuốc</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm thuốc
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {medications.map(medication => (
                <div key={medication.id} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{medication.name}</h3>
                      <p className="text-gray-600">Liều dùng: {medication.dosage}</p>
                      <p className="text-sm text-gray-600">{getFrequencyText(medication.frequency)}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedMedication(medication)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Giờ uống:</h4>
                      <div className="flex flex-wrap gap-2">
                        {medication.times.map((time, index) => (
                          <span key={index} className="bg-medical-100 text-medical-800 text-xs px-2 py-1 rounded">
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Hướng dẫn sử dụng:</h4>
                      <p className="text-sm text-gray-600">{medication.instructions}</p>
                    </div>
                    
                    {medication.sideEffects.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Tác dụng phụ:</h4>
                        <div className="flex flex-wrap gap-1">
                          {medication.sideEffects.map((effect, index) => (
                            <span key={index} className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                              {effect}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                      <div className="text-center">
                        <p className={`text-lg font-bold ${getAdherenceColor(medication.adherenceRate)}`}>
                          {medication.adherenceRate}%
                        </p>
                        <p className="text-xs text-gray-600">Tuân thủ</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900">
                          {medication.totalDoses - medication.missedDoses}/{medication.totalDoses}
                        </p>
                        <p className="text-xs text-gray-600">Đã uống</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Lịch sử uống thuốc</h2>
            
            <div className="card">
              <div className="text-center py-12">
                <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Lịch sử uống thuốc sẽ được hiển thị ở đây</p>
                <p className="text-sm text-gray-500">Chức năng đang được phát triển</p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Cài đặt nhắc nhở</h2>
            
            <div className="card">
              <div className="text-center py-12">
                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Cài đặt nhắc nhở sẽ được hiển thị ở đây</p>
                <p className="text-sm text-gray-500">Chức năng đang được phát triển</p>
              </div>
            </div>
          </div>
        )}

        {/* Add Medication Modal Placeholder */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thêm thuốc mới</h3>
              <p className="text-gray-600 mb-4">Chức năng thêm thuốc sẽ được triển khai sớm</p>
              <button
                onClick={() => setShowAddModal(false)}
                className="btn btn-secondary w-full"
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {/* Medication Detail Modal */}
        {selectedMedication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-900">Chi tiết thuốc</h3>
                <button
                  onClick={() => setSelectedMedication(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedMedication.name}</h4>
                  <p className="text-gray-600">Liều dùng: {selectedMedication.dosage}</p>
                  <p className="text-gray-600">Tần suất: {getFrequencyText(selectedMedication.frequency)}</p>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Giờ uống hàng ngày:</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedMedication.times.map((time, index) => (
                      <span key={index} className="bg-medical-100 text-medical-800 px-3 py-1 rounded">
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Hướng dẫn sử dụng:</h5>
                  <p className="text-gray-600">{selectedMedication.instructions}</p>
                </div>
                
                {selectedMedication.sideEffects.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Tác dụng phụ có thể gặp:</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedMedication.sideEffects.map((effect, index) => (
                        <span key={index} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                          {effect}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <p className={`text-xl font-bold ${getAdherenceColor(selectedMedication.adherenceRate)}`}>
                      {selectedMedication.adherenceRate}%
                    </p>
                    <p className="text-sm text-gray-600">Tuân thủ điều trị</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-green-600">
                      {selectedMedication.totalDoses - selectedMedication.missedDoses}
                    </p>
                    <p className="text-sm text-gray-600">Liều đã uống</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-red-600">{selectedMedication.missedDoses}</p>
                    <p className="text-sm text-gray-600">Liều bỏ lỡ</p>
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

export default MedicationReminders
