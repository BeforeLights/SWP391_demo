import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../contexts/NotificationContext'
import { 
  Calendar, 
  Pill, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  User,
  Brain,
  MessageCircle,
  Smile
} from 'lucide-react'

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const { notifications } = useNotifications()
  const [medicationTaken, setMedicationTaken] = useState<{ [key: string]: boolean }>({})

  const markMedicationTaken = (medicationId: string) => {
    setMedicationTaken(prev => ({
      ...prev,
      [medicationId]: !prev[medicationId]
    }))
  }
  const upcomingAppointments = [
    {
      id: '1',
      doctor: 'ThS. Nguyễn Thị Hương',
      specialty: 'Tâm lý trị liệu',
      date: '2024-12-15',
      time: '15:00',
      type: 'Phiên tư vấn cá nhân'
    },
    {
      id: '2',
      doctor: 'TS. Trần Văn Nam',
      specialty: 'Tâm lý học lâm sàng',
      date: '2024-12-20',
      time: '10:30',
      type: 'Đánh giá tâm lý'
    }
  ]

  const medications = [
    {
      id: '1',
      name: 'Sertraline',
      dosage: '50mg/ngày',
      time: '08:00',
      taken: medicationTaken['1'] || false
    },
    {
      id: '2',
      name: 'Vitamin D3',
      dosage: '1000IU/ngày',
      time: '20:00',
      taken: medicationTaken['2'] || false
    }
  ]

  const recentTests = [
    {
      id: '1',
      name: 'Đánh giá tâm trạng (PHQ-9)',
      value: '8',
      unit: 'điểm',
      date: '2024-11-15',
      status: 'normal',
      reference: '0-27'
    },
    {
      id: '2',
      name: 'Mức độ lo âu (GAD-7)',
      value: '6',
      unit: 'điểm',
      date: '2024-11-15',
      status: 'normal',
      reference: '0-21'
    },
    {
      id: '3',
      name: 'Chất lượng giấc ngủ',
      value: '7',
      unit: 'điểm',
      date: '2024-11-10',
      status: 'excellent',
      reference: '0-10'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50'
      case 'normal': return 'text-blue-600 bg-blue-50'
      case 'warning': return 'text-yellow-600 bg-yellow-50'
      case 'critical': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-slate-900">
            Chào mừng, {user.name}
          </h1>
          <p className="text-slate-600">
            Theo dõi hành trình phục hồi sức khỏe tinh thần của bạn
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card hover:shadow-lg transition-all duration-300 animate-slide-up" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center">
              <div className="p-3 bg-brand-100 rounded-lg">
                <Brain className="h-6 w-6 text-brand-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Mức độ tâm trạng</p>
                <p className="text-2xl font-semibold text-slate-900">Tốt</p>
                <p className="text-sm text-ocean-600">Cải thiện 15%</p>
              </div>
            </div>
          </div>

          <div className="card hover:shadow-lg transition-all duration-300 animate-slide-up" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center">
              <div className="p-3 bg-ocean-100 rounded-lg">
                <Smile className="h-6 w-6 text-ocean-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Mức độ lo âu</p>
                <p className="text-2xl font-semibold text-slate-900">Thấp</p>
                <p className="text-sm text-green-600">Giảm 30%</p>
              </div>
            </div>
          </div>

          <div className="card hover:shadow-lg transition-all duration-300 animate-slide-up" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Pill className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Tuân thủ điều trị</p>
                <p className="text-2xl font-semibold text-slate-900">95%</p>
                <p className="text-sm text-green-600">Xuất sắc</p>
              </div>
            </div>
          </div>

          <div className="card hover:shadow-lg transition-all duration-300 animate-slide-up" style={{animationDelay: '0.4s'}}>
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Phiên tư vấn tiếp theo</p>
                <p className="text-2xl font-semibold text-slate-900">3</p>
                <p className="text-sm text-yellow-600">ngày nữa</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">            {/* Medication Schedule */}
            <div className="card animate-slide-up" style={{animationDelay: '0.5s'}}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                  <Pill className="h-5 w-5 mr-2 text-purple-600" />
                  Thuốc và liệu pháp hôm nay
                </h2>
                <span className="text-sm text-slate-500">
                  {new Date().toLocaleDateString('vi-VN')}
                </span>
              </div>
              
              <div className="space-y-4">
                {medications.map((med) => (
                  <div 
                    key={med.id} 
                    className={`flex items-center justify-between p-4 border rounded-lg ${
                      med.taken ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        med.taken ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-900">{med.name}</p>
                        <p className="text-sm text-gray-600">{med.dosage} • {med.time}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => markMedicationTaken(med.id)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        med.taken
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {med.taken ? (
                        <span className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Đã uống
                        </span>
                      ) : (
                        'Đánh dấu đã uống'
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>            {/* Recent Test Results */}
            <div className="card animate-slide-up" style={{animationDelay: '0.6s'}}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-ocean-600" />
                  Đánh giá tâm lý gần đây
                </h2>
                <button className="text-ocean-600 hover:text-ocean-700 text-sm font-medium">
                  Xem tất cả
                </button>
              </div>
              
              <div className="space-y-4">
                {recentTests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{test.name}</p>                      <p className="text-sm text-slate-600">
                        {test.date} • Thang điểm: {test.reference}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-slate-900">
                        {test.value} {test.unit}
                      </p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(test.status)}`}>
                        {test.status === 'excellent' && 'Xuất sắc'}
                        {test.status === 'normal' && 'Bình thường'}
                        {test.status === 'warning' && 'Cần chú ý'}
                        {test.status === 'critical' && 'Cần can thiệp'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>          {/* Right Column */}
          <div className="space-y-8">
            {/* Upcoming Appointments */}
            <div className="card animate-slide-up" style={{animationDelay: '0.7s'}}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-ocean-600" />
                  Phiên tư vấn sắp tới
                </h2>
              </div>
              
              <div className="space-y-4">
                {upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-slate-900">{apt.doctor}</p>
                        <p className="text-sm text-slate-600">{apt.specialty}</p>
                        <p className="text-sm text-slate-600">{apt.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(apt.date).toLocaleDateString('vi-VN')}
                        </p>
                        <p className="text-sm text-gray-600">{apt.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 py-2 text-medical-600 hover:text-medical-700 text-sm font-medium border border-medical-600 rounded-md hover:bg-medical-50 transition-colors">
                Đặt lịch hẹn mới
              </button>
            </div>

            {/* Recent Notifications */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
                  Thông báo gần đây
                </h2>
              </div>
              
              <div className="space-y-3">
                {notifications.slice(0, 3).map((notification) => (
                  <div key={notification.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {notification.time.toLocaleString('vi-VN')}
                    </p>
                  </div>
                ))}
              </div>
            </div>            {/* Quick Actions */}
            <div className="card animate-slide-up" style={{animationDelay: '0.9s'}}>
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Thao tác nhanh</h2>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors"
                        onClick={() => window.location.href = '/booking'}>                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-ocean-600 mr-3" />
                    <span>Đặt phiên tư vấn</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-ocean-600 mr-3" />
                    <span>Xem báo cáo tâm lý</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-ocean-600 mr-3" />
                    <span>Cập nhật hồ sơ</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
