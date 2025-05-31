import React, { useState } from 'react'
import {
  Users, UserCheck, Calendar, TestTube, Pill, 
  TrendingUp, AlertTriangle, Settings, Download,
  Search, Plus, Edit, Eye, Trash2,
  BarChart3, Activity, Clock, CheckCircle
} from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

interface DashboardStats {
  totalPatients: number
  activePatients: number
  newPatientsThisMonth: number
  appointmentsToday: number
  pendingTestResults: number
  medicationAdherence: number
  emergencyAlerts: number
}

interface Patient {
  id: string
  name: string
  email: string
  phone: string
  dateOfBirth: string
  diagnosisDate: string
  currentTreatment: string
  lastVisit: string
  nextAppointment?: string
  adherenceRate: number
  status: 'active' | 'inactive' | 'critical'
  assignedDoctor: string
}

interface RecentActivity {
  id: string
  type: 'appointment' | 'test' | 'medication' | 'alert'
  patient: string
  description: string
  timestamp: string
  status: 'completed' | 'pending' | 'cancelled' | 'urgent'
}

interface SystemAlert {
  id: string
  type: 'critical' | 'warning' | 'info'
  title: string
  message: string
  timestamp: string
  isRead: boolean
  patientId?: string
}

// Mock data
const mockStats: DashboardStats = {
  totalPatients: 1247,
  activePatients: 1198,
  newPatientsThisMonth: 23,
  appointmentsToday: 18,
  pendingTestResults: 7,
  medicationAdherence: 94.2,
  emergencyAlerts: 3
}

const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    phone: '0901234567',
    dateOfBirth: '1985-03-15',
    diagnosisDate: '2023-01-20',
    currentTreatment: 'Efavirenz/Emtricitabine/Tenofovir',
    lastVisit: '2024-01-15',
    nextAppointment: '2024-02-15',
    adherenceRate: 96,
    status: 'active',
    assignedDoctor: 'BS. Trần Thị B'
  },
  {
    id: '2',
    name: 'Lê Thị C',
    email: 'lethic@email.com',
    phone: '0912345678',
    dateOfBirth: '1990-07-22',
    diagnosisDate: '2023-06-10',
    currentTreatment: 'Dolutegravir + Tenofovir/Emtricitabine',
    lastVisit: '2024-01-10',
    nextAppointment: '2024-02-10',
    adherenceRate: 98,
    status: 'active',
    assignedDoctor: 'BS. Nguyễn Văn D'
  },
  {
    id: '3',
    name: 'Phạm Văn E',
    email: 'phamvane@email.com',
    phone: '0923456789',
    dateOfBirth: '1978-11-05',
    diagnosisDate: '2022-08-15',
    currentTreatment: 'Lopinavir/Ritonavir',
    lastVisit: '2024-01-08',
    adherenceRate: 78,
    status: 'critical',
    assignedDoctor: 'BS. Hoàng Thị F'
  }
]

const mockRecentActivity: RecentActivity[] = [
  {
    id: '1',
    type: 'appointment',
    patient: 'Nguyễn Văn A',
    description: 'Hoàn thành khám định kỳ',
    timestamp: new Date().toISOString(),
    status: 'completed'
  },
  {
    id: '2',
    type: 'test',
    patient: 'Lê Thị C',
    description: 'Kết quả xét nghiệm CD4: 450 cells/μL',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'completed'
  },
  {
    id: '3',
    type: 'medication',
    patient: 'Phạm Văn E',
    description: 'Cảnh báo: Tuân thủ dưới 80%',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    status: 'urgent'
  },
  {
    id: '4',
    type: 'appointment',
    patient: 'Trần Thị G',
    description: 'Lịch hẹn mới được đặt',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    status: 'pending'
  }
]

const mockSystemAlerts: SystemAlert[] = [
  {
    id: '1',
    type: 'critical',
    title: 'Tuân thủ điều trị thấp',
    message: 'Phạm Văn E có tỷ lệ tuân thủ dưới 80% trong 2 tuần qua',
    timestamp: new Date().toISOString(),
    isRead: false,
    patientId: '3'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Xét nghiệm quá hạn',
    message: '5 bệnh nhân cần xét nghiệm định kỳ trong tuần này',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false
  },
  {
    id: '3',
    type: 'info',
    title: 'Cập nhật hệ thống',
    message: 'Phiên bản 2.1.0 đã được cài đặt thành công',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isRead: true
  }
]

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'patients' | 'activity' | 'alerts' | 'settings'>('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [stats] = useState<DashboardStats>(mockStats)
  const [alerts, setAlerts] = useState<SystemAlert[]>(mockSystemAlerts)

  // Filter patients based on search and status
  const filteredPatients = mockPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || patient.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'inactive': return 'text-gray-600 bg-gray-100'
      case 'critical': return 'text-red-600 bg-red-100'
      case 'completed': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      case 'urgent': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Đang điều trị'
      case 'inactive': return 'Ngừng điều trị'
      case 'critical': return 'Cần theo dõi'
      case 'completed': return 'Hoàn thành'
      case 'pending': return 'Chờ xử lý'
      case 'cancelled': return 'Đã hủy'
      case 'urgent': return 'Khẩn cấp'
      default: return status
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <Calendar className="w-4 h-4 text-blue-600" />
      case 'test': return <TestTube className="w-4 h-4 text-green-600" />
      case 'medication': return <Pill className="w-4 h-4 text-purple-600" />
      case 'alert': return <AlertTriangle className="w-4 h-4 text-red-600" />
      default: return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-600" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'info': return <CheckCircle className="w-5 h-5 text-blue-600" />
      default: return <AlertTriangle className="w-5 h-5 text-gray-600" />
    }
  }

  const markAlertAsRead = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ))
  }

  const unreadAlertsCount = alerts.filter(alert => !alert.isRead).length

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bảng điều khiển quản trị</h1>
          <p className="mt-2 text-gray-600">Tổng quan hệ thống HIV Care Connect</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
              { id: 'patients', label: 'Bệnh nhân', icon: Users },
              { id: 'activity', label: 'Hoạt động', icon: Activity },
              { id: 'alerts', label: `Cảnh báo (${unreadAlertsCount})`, icon: AlertTriangle },
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

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card text-center">
                <Users className="w-8 h-8 text-medical-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-medical-600">{stats.totalPatients}</h3>
                <p className="text-gray-600">Tổng bệnh nhân</p>
                <p className="text-sm text-green-600 mt-1">+{stats.newPatientsThisMonth} tháng này</p>
              </div>
              
              <div className="card text-center">
                <UserCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-green-600">{stats.activePatients}</h3>
                <p className="text-gray-600">Đang điều trị</p>
                <p className="text-sm text-gray-500 mt-1">{((stats.activePatients / stats.totalPatients) * 100).toFixed(1)}%</p>
              </div>
              
              <div className="card text-center">
                <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-blue-600">{stats.appointmentsToday}</h3>
                <p className="text-gray-600">Lịch hẹn hôm nay</p>
                <p className="text-sm text-blue-600 mt-1">{stats.pendingTestResults} kết quả chờ</p>
              </div>
              
              <div className="card text-center">
                <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-purple-600">{stats.medicationAdherence}%</h3>
                <p className="text-gray-600">Tuân thủ điều trị</p>
                {stats.emergencyAlerts > 0 && (
                  <p className="text-sm text-red-600 mt-1">{stats.emergencyAlerts} cảnh báo khẩn cấp</p>
                )}
              </div>
            </div>

            {/* Recent Activity and Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h3>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className="text-medical-600 hover:text-medical-800 text-sm"
                  >
                    Xem tất cả
                  </button>
                </div>
                <div className="space-y-3">
                  {mockRecentActivity.slice(0, 5).map(activity => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.patient}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-400">
                          {format(new Date(activity.timestamp), 'HH:mm dd/MM', { locale: vi })}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                        {getStatusText(activity.status)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Alerts */}
              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Cảnh báo hệ thống</h3>
                  <button
                    onClick={() => setActiveTab('alerts')}
                    className="text-medical-600 hover:text-medical-800 text-sm"
                  >
                    Xem tất cả
                  </button>
                </div>
                <div className="space-y-3">
                  {alerts.slice(0, 4).map(alert => (
                    <div 
                      key={alert.id} 
                      className={`p-3 rounded-lg border-l-4 cursor-pointer ${
                        alert.type === 'critical' ? 'border-red-500 bg-red-50' :
                        alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                        'border-blue-500 bg-blue-50'
                      } ${!alert.isRead ? 'ring-2 ring-medical-200' : ''}`}
                      onClick={() => markAlertAsRead(alert.id)}
                    >
                      <div className="flex items-start space-x-3">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
                          <p className="text-sm text-gray-600">{alert.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {format(new Date(alert.timestamp), 'HH:mm dd/MM', { locale: vi })}
                          </p>
                        </div>
                        {!alert.isRead && (
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Patients Tab */}
        {activeTab === 'patients' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Quản lý bệnh nhân</h2>
              <div className="flex space-x-3">
                <button className="btn btn-secondary">
                  <Download className="w-4 h-4 mr-2" />
                  Xuất danh sách
                </button>
                <button className="btn btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm bệnh nhân
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="card">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm bệnh nhân..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent"
                    />
                  </div>
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="form-select"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="active">Đang điều trị</option>
                    <option value="inactive">Ngừng điều trị</option>
                    <option value="critical">Cần theo dõi</option>
                  </select>
                </div>
                
                <div className="text-sm text-gray-600">
                  {filteredPatients.length} / {mockPatients.length} bệnh nhân
                </div>
              </div>
            </div>

            {/* Patients List */}
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bệnh nhân
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Liên hệ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Điều trị
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tuân thủ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPatients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                            <div className="text-sm text-gray-500">
                              Sinh: {format(new Date(patient.dateOfBirth), 'dd/MM/yyyy', { locale: vi })}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{patient.email}</div>
                          <div className="text-sm text-gray-500">{patient.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{patient.currentTreatment}</div>
                          <div className="text-sm text-gray-500">BS: {patient.assignedDoctor}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">{patient.adherenceRate}%</div>
                            <div className={`ml-2 w-16 h-2 rounded-full ${
                              patient.adherenceRate >= 95 ? 'bg-green-200' :
                              patient.adherenceRate >= 85 ? 'bg-yellow-200' : 'bg-red-200'
                            }`}>
                              <div 
                                className={`h-2 rounded-full ${
                                  patient.adherenceRate >= 95 ? 'bg-green-600' :
                                  patient.adherenceRate >= 85 ? 'bg-yellow-600' : 'bg-red-600'
                                }`}
                                style={{ width: `${patient.adherenceRate}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(patient.status)}`}>
                            {getStatusText(patient.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setSelectedPatient(patient)}
                              className="text-medical-600 hover:text-medical-900"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-blue-600 hover:text-blue-900">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Hoạt động hệ thống</h2>
            
            <div className="space-y-4">
              {mockRecentActivity.map(activity => (
                <div key={activity.id} className="card">
                  <div className="flex items-center space-x-4">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{activity.patient}</h3>
                      <p className="text-gray-600">{activity.description}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {format(new Date(activity.timestamp), 'HH:mm dd/MM/yyyy', { locale: vi })}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(activity.status)}`}>
                      {getStatusText(activity.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Cảnh báo hệ thống</h2>
              <button
                onClick={() => setAlerts(alerts.map(alert => ({ ...alert, isRead: true })))}
                className="btn btn-secondary"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Đánh dấu tất cả đã đọc
              </button>
            </div>
            
            <div className="space-y-4">
              {alerts.map(alert => (
                <div 
                  key={alert.id} 
                  className={`card cursor-pointer transition-all hover:shadow-md ${
                    !alert.isRead ? 'ring-2 ring-medical-200' : ''
                  }`}
                  onClick={() => markAlertAsRead(alert.id)}
                >
                  <div className="flex items-start space-x-4">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">{alert.title}</h3>
                        {!alert.isRead && (
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-gray-600 mt-1">{alert.message}</p>
                      <div className="flex items-center mt-3 text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {format(new Date(alert.timestamp), 'HH:mm dd/MM/yyyy', { locale: vi })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Cài đặt hệ thống</h2>
            
            <div className="card">
              <div className="text-center py-12">
                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Cài đặt hệ thống sẽ được triển khai sớm</p>
                <p className="text-sm text-gray-500">Bao gồm cấu hình thông báo, sao lưu dữ liệu, và quản lý người dùng</p>
              </div>
            </div>
          </div>
        )}

        {/* Patient Detail Modal */}
        {selectedPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-96 overflow-y-auto p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedPatient.name}</h3>
                  <p className="text-gray-600">Chi tiết bệnh nhân</p>
                </div>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Thông tin cá nhân</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Email:</span> {selectedPatient.email}</p>
                      <p><span className="font-medium">Điện thoại:</span> {selectedPatient.phone}</p>
                      <p><span className="font-medium">Ngày sinh:</span> {format(new Date(selectedPatient.dateOfBirth), 'dd/MM/yyyy', { locale: vi })}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Thông tin điều trị</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Ngày chẩn đoán:</span> {format(new Date(selectedPatient.diagnosisDate), 'dd/MM/yyyy', { locale: vi })}</p>
                      <p><span className="font-medium">Phác đồ hiện tại:</span> {selectedPatient.currentTreatment}</p>
                      <p><span className="font-medium">Bác sĩ phụ trách:</span> {selectedPatient.assignedDoctor}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Lịch hẹn</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Lần khám cuối:</span> {format(new Date(selectedPatient.lastVisit), 'dd/MM/yyyy', { locale: vi })}</p>
                      {selectedPatient.nextAppointment && (
                        <p><span className="font-medium">Lịch hẹn tiếp theo:</span> {format(new Date(selectedPatient.nextAppointment), 'dd/MM/yyyy', { locale: vi })}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Tuân thủ điều trị</h4>
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl font-bold text-gray-900">{selectedPatient.adherenceRate}%</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${
                            selectedPatient.adherenceRate >= 95 ? 'bg-green-600' :
                            selectedPatient.adherenceRate >= 85 ? 'bg-yellow-600' : 'bg-red-600'
                          }`}
                          style={{ width: `${selectedPatient.adherenceRate}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className={`text-sm mt-1 ${
                      selectedPatient.adherenceRate >= 95 ? 'text-green-600' :
                      selectedPatient.adherenceRate >= 85 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {selectedPatient.adherenceRate >= 95 ? 'Tuyệt vời' :
                       selectedPatient.adherenceRate >= 85 ? 'Tốt' : 'Cần cải thiện'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Trạng thái</h4>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedPatient.status)}`}>
                      {getStatusText(selectedPatient.status)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="btn btn-secondary"
                >
                  Đóng
                </button>
                <button className="btn btn-primary">
                  Chỉnh sửa thông tin
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
