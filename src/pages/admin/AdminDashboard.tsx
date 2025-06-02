import React, { useState, useEffect } from 'react'
import {
  Users, UserCheck, Calendar, Brain, 
  AlertTriangle, Settings, Download,
  Search, Plus, Edit, Eye, Trash2,
  BarChart3, Activity, Clock, CheckCircle,
  HeartPulse, Sparkles, Smile
} from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

interface DashboardStats {
  totalClients: number
  activeClients: number
  newClientsThisMonth: number
  sessionsToday: number
  pendingAssessments: number
  activityCompletion: number
  emergencyAlerts: number
}

interface Client {
  id: string
  name: string
  email: string
  phone: string
  dateOfBirth: string
  initialAssessmentDate: string
  currentTherapyType: string
  lastSession: string
  nextSession?: string
  activityCompletionRate: number
  status: 'active' | 'inactive' | 'urgent'
  assignedTherapist: string
}

interface RecentActivity {
  id: string
  type: 'session' | 'assessment' | 'activity' | 'alert'
  client: string
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
  clientId?: string
}

// Mock data
const mockStats: DashboardStats = {
  totalClients: 1247,
  activeClients: 1198,
  newClientsThisMonth: 23,
  sessionsToday: 18,
  pendingAssessments: 7,
  activityCompletion: 94.2,
  emergencyAlerts: 3
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    phone: '0901234567',
    dateOfBirth: '1985-03-15',
    initialAssessmentDate: '2023-01-20',
    currentTherapyType: 'Liệu pháp nhận thức hành vi (CBT)',
    lastSession: '2024-01-15',
    nextSession: '2024-02-15',
    activityCompletionRate: 96,
    status: 'active',
    assignedTherapist: 'ThS. Trần Thị B'
  },
  {
    id: '2',
    name: 'Lê Thị C',
    email: 'lethic@email.com',
    phone: '0912345678',
    dateOfBirth: '1990-07-22',
    initialAssessmentDate: '2023-06-10',
    currentTherapyType: 'Liệu pháp tâm lý động (Psychodynamic)',
    lastSession: '2024-01-10',
    nextSession: '2024-02-10',
    activityCompletionRate: 98,
    status: 'active',
    assignedTherapist: 'ThS. Nguyễn Văn D'
  },
  {
    id: '3',
    name: 'Phạm Văn E',
    email: 'phamvane@email.com',
    phone: '0923456789',
    dateOfBirth: '1978-11-05',
    initialAssessmentDate: '2022-08-15',
    currentTherapyType: 'Liệu pháp giải pháp ngắn hạn (SFBT)',
    lastSession: '2024-01-05',
    nextSession: '2024-01-20',
    activityCompletionRate: 85,
    status: 'urgent',
    assignedTherapist: 'ThS. Phạm Thị F'
  }
]

const mockRecentActivity: RecentActivity[] = [
  {
    id: '1',
    type: 'session',
    client: 'Nguyễn Văn A',
    description: 'Hoàn thành phiên tư vấn',
    timestamp: new Date().toISOString(),
    status: 'completed'
  },
  {
    id: '2',
    type: 'assessment',
    client: 'Lê Thị C',
    description: 'Đánh giá tâm lý định kỳ hoàn thành',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'completed'
  },
  {
    id: '3',
    type: 'activity',
    client: 'Phạm Văn E',
    description: 'Cảnh báo: Hoạt động dưới 80%',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    status: 'urgent'
  },
  {
    id: '4',
    type: 'session',
    client: 'Trần Thị G',
    description: 'Lịch hẹn mới được đặt',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    status: 'pending'
  }
]

const mockSystemAlerts: SystemAlert[] = [
  {
    id: '1',
    type: 'critical',
    title: 'Hoạt động thấp',
    message: 'Phạm Văn E có tỷ lệ hoạt động dưới 80% trong 2 tuần qua',
    timestamp: new Date().toISOString(),
    isRead: false,
    clientId: '3'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Đánh giá quá hạn',
    message: '5 khách hàng cần đánh giá tâm lý định kỳ trong tuần này',
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
  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'activity' | 'alerts' | 'settings'>('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [stats] = useState<DashboardStats>(mockStats)
  const [alerts, setAlerts] = useState<SystemAlert[]>(mockSystemAlerts)

  // Filter clients based on search and status
  const filteredClients = mockClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'inactive': return 'text-gray-600 bg-gray-100'
      case 'urgent': return 'text-red-600 bg-red-100'
      case 'completed': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Đang trị liệu'
      case 'inactive': return 'Ngừng trị liệu'
      case 'urgent': return 'Cần hỗ trợ'
      case 'completed': return 'Hoàn thành'
      case 'pending': return 'Chờ xử lý'
      case 'cancelled': return 'Đã hủy'
      default: return status
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'session': return <Calendar className="w-4 h-4 text-blue-600" />
      case 'assessment': return <Brain className="w-4 h-4 text-green-600" />
      case 'activity': return <Sparkles className="w-4 h-4 text-purple-600" />
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

  const tabItems = [
    { id: 'overview' as const, label: 'Tổng quan', icon: BarChart3 },
    { id: 'clients' as const, label: 'Khách hàng', icon: Users },
    { id: 'activity' as const, label: 'Hoạt động', icon: Activity },
    { id: 'alerts' as const, label: `Cảnh báo (${unreadAlertsCount})`, icon: AlertTriangle },
    { id: 'settings' as const, label: 'Cài đặt', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 fade-in">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">
              Bảng điều khiển quản trị
            </span>
            <span className="ml-2 text-sm bg-gradient-to-r from-red-600 to-blue-600 text-white px-2 py-1 rounded-full">
              YOU ARE HEARD
            </span>
          </h1>
          <p className="mt-2 text-gray-600">Tổng quan hệ thống sức khỏe tâm thần</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6 slide-up">
          <nav className="-mb-px flex space-x-8">
            {tabItems.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <tab.icon className={`w-4 h-4 mr-2 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'}`} />
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
              <div className="card text-center bg-white shadow-md rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 slide-up" style={{ animationDelay: '100ms' }}>
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-blue-600">{stats.totalClients}</h3>
                <p className="text-gray-600">Tổng khách hàng</p>
                <p className="text-sm text-green-600 mt-1 float">+{stats.newClientsThisMonth} tháng này</p>
              </div>
              
              <div className="card text-center bg-white shadow-md rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 slide-up" style={{ animationDelay: '200ms' }}>
                <UserCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-green-600">{stats.activeClients}</h3>
                <p className="text-gray-600">Đang trị liệu</p>
                <p className="text-sm text-gray-500 mt-1 float">{((stats.activeClients / stats.totalClients) * 100).toFixed(1)}%</p>
              </div>
              
              <div className="card text-center bg-white shadow-md rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 slide-up" style={{ animationDelay: '300ms' }}>
                <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-blue-600">{stats.sessionsToday}</h3>
                <p className="text-gray-600">Lịch hẹn hôm nay</p>
                <p className="text-sm text-blue-600 mt-1 float">{stats.pendingAssessments} đánh giá chờ</p>
              </div>
              
              <div className="card text-center bg-white shadow-md rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 slide-up" style={{ animationDelay: '400ms' }}>
                <Smile className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-red-600">{stats.activityCompletion}%</h3>
                <p className="text-gray-600">Hoàn thành hoạt động</p>
                {stats.emergencyAlerts > 0 && (
                  <p className="text-sm text-red-600 mt-1 bounce-gentle">{stats.emergencyAlerts} cảnh báo sức khỏe</p>
                )}
              </div>
            </div>

            {/* Recent Activity and Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="card bg-white shadow-md rounded-xl p-6 border border-gray-100 slide-up" style={{ animationDelay: '500ms' }}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h3>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className="text-blue-600 hover:text-blue-800 text-sm transition-all"
                  >
                    Xem tất cả
                  </button>
                </div>
                <div className="space-y-3">
                  {mockRecentActivity.slice(0, 5).map((activity, index) => (
                    <div 
                      key={activity.id} 
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-all slide-up"
                      style={{ animationDelay: `${600 + index * 100}ms` }}
                    >
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.client}</p>
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
              <div className="card bg-white shadow-md rounded-xl p-6 border border-gray-100 slide-up" style={{ animationDelay: '500ms' }}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Cảnh báo hệ thống</h3>
                  <button
                    onClick={() => setActiveTab('alerts')}
                    className="text-blue-600 hover:text-blue-800 text-sm transition-all"
                  >
                    Xem tất cả
                  </button>
                </div>
                <div className="space-y-3">
                  {alerts.slice(0, 4).map((alert, index) => (
                    <div 
                      key={alert.id} 
                      className={`p-3 rounded-lg border-l-4 cursor-pointer transition-all slide-up hover:shadow-md ${
                        alert.type === 'critical' ? 'border-red-500 bg-red-50' :
                        alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                        'border-blue-500 bg-blue-50'
                      } ${!alert.isRead ? 'ring-2 ring-blue-200' : ''}`}
                      onClick={() => markAlertAsRead(alert.id)}
                      style={{ animationDelay: `${600 + index * 100}ms` }}
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
                          <div className="w-2 h-2 bg-red-500 rounded-full pulse"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Clients Tab */}
        {activeTab === 'clients' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center fade-in">
              <h2 className="text-xl font-semibold text-gray-900">Quản lý khách hàng</h2>
              <div className="flex space-x-3">
                <button className="btn btn-secondary bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-all">
                  <Download className="w-4 h-4 mr-2" />
                  Xuất danh sách
                </button>
                <button className="btn btn-primary bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-4 rounded-lg transition-all">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm khách hàng
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="card bg-white shadow-md rounded-xl p-6 border border-gray-100 slide-up">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm khách hàng..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="form-select border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="active">Đang trị liệu</option>
                    <option value="inactive">Ngừng trị liệu</option>
                    <option value="urgent">Cần hỗ trợ</option>
                  </select>
                </div>
                
                <div className="text-sm text-gray-600">
                  {filteredClients.length} / {mockClients.length} khách hàng
                </div>
              </div>
            </div>

            {/* Clients List */}
            <div className="card bg-white shadow-md rounded-xl overflow-hidden border border-gray-100 slide-up" style={{ animationDelay: '200ms' }}>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Khách hàng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Liên hệ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Liệu pháp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hoàn thành hoạt động
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
                    {filteredClients.map((client, index) => (
                      <tr key={client.id} className="hover:bg-blue-50 transition-all slide-up" style={{ animationDelay: `${300 + index * 100}ms` }}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{client.name}</div>
                            <div className="text-sm text-gray-500">
                              Sinh: {format(new Date(client.dateOfBirth), 'dd/MM/yyyy', { locale: vi })}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{client.email}</div>
                          <div className="text-sm text-gray-500">{client.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{client.currentTherapyType}</div>
                          <div className="text-sm text-gray-500">ThS: {client.assignedTherapist}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">{client.activityCompletionRate}%</div>
                            <div className={`ml-2 w-16 h-2 rounded-full ${
                              client.activityCompletionRate >= 95 ? 'bg-green-200' :
                              client.activityCompletionRate >= 85 ? 'bg-yellow-200' : 'bg-red-200'
                            }`}>
                              <div 
                                className={`h-2 rounded-full ${
                                  client.activityCompletionRate >= 95 ? 'bg-green-600' :
                                  client.activityCompletionRate >= 85 ? 'bg-yellow-600' : 'bg-red-600'
                                }`}
                                style={{ width: `${client.activityCompletionRate}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(client.status)}`}>
                            {getStatusText(client.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setSelectedClient(client)}
                              className="text-blue-600 hover:text-blue-900 transition-all"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-blue-600 hover:text-blue-900 transition-all">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900 transition-all">
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
            <h2 className="text-xl font-semibold text-gray-900 fade-in">Hoạt động hệ thống</h2>
            
            <div className="space-y-4">
              {mockRecentActivity.map((activity, index) => (
                <div 
                  key={activity.id} 
                  className="card bg-white shadow-md rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center space-x-4">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{activity.client}</h3>
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
            <div className="flex justify-between items-center fade-in">
              <h2 className="text-xl font-semibold text-gray-900">Cảnh báo hệ thống</h2>
              <button
                onClick={() => setAlerts(alerts.map(alert => ({ ...alert, isRead: true })))}
                className="btn btn-secondary bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-all"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Đánh dấu tất cả đã đọc
              </button>
            </div>
            
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div 
                  key={alert.id} 
                  className={`card bg-white shadow-md rounded-xl p-6 border border-gray-100 cursor-pointer transition-all hover:shadow-lg slide-up ${
                    !alert.isRead ? 'ring-2 ring-blue-200' : ''
                  }`}
                  onClick={() => markAlertAsRead(alert.id)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start space-x-4">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">{alert.title}</h3>
                        {!alert.isRead && (
                          <div className="w-2 h-2 bg-red-500 rounded-full pulse"></div>
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
          <div className="space-y-6 fade-in">
            <h2 className="text-xl font-semibold text-gray-900">Cài đặt hệ thống</h2>
            
            <div className="card bg-white shadow-md rounded-xl p-6 border border-gray-100 slide-up">
              <div className="text-center py-12">
                <Settings className="w-12 h-12 text-blue-600 mx-auto mb-4 bounce-gentle" />
                <p className="text-gray-600">Cài đặt hệ thống YOU ARE HEARD sẽ được triển khai sớm</p>
                <p className="text-sm text-gray-500">Bao gồm cấu hình thông báo, sao lưu dữ liệu, và quản lý người dùng</p>
              </div>
            </div>
          </div>
        )}

        {/* Client Detail Modal */}
        {selectedClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 fade-in">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-96 overflow-y-auto p-6 shadow-2xl slide-up">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedClient.name}</h3>
                  <p className="text-gray-600">Chi tiết khách hàng</p>
                </div>
                <button
                  onClick={() => setSelectedClient(null)}
                  className="text-gray-400 hover:text-gray-600 transition-all"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Thông tin cá nhân</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Email:</span> {selectedClient.email}</p>
                      <p><span className="font-medium">Điện thoại:</span> {selectedClient.phone}</p>
                      <p><span className="font-medium">Ngày sinh:</span> {format(new Date(selectedClient.dateOfBirth), 'dd/MM/yyyy', { locale: vi })}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Thông tin trị liệu</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Ngày đánh giá ban đầu:</span> {format(new Date(selectedClient.initialAssessmentDate), 'dd/MM/yyyy', { locale: vi })}</p>
                      <p><span className="font-medium">Loại liệu pháp hiện tại:</span> {selectedClient.currentTherapyType}</p>
                      <p><span className="font-medium">Nhà trị liệu phụ trách:</span> {selectedClient.assignedTherapist}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Lịch hẹn</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Lần tư vấn cuối:</span> {format(new Date(selectedClient.lastSession), 'dd/MM/yyyy', { locale: vi })}</p>
                      {selectedClient.nextSession && (
                        <p><span className="font-medium">Lịch hẹn tiếp theo:</span> {format(new Date(selectedClient.nextSession), 'dd/MM/yyyy', { locale: vi })}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Hoàn thành hoạt động</h4>
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl font-bold text-gray-900">{selectedClient.activityCompletionRate}%</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${
                            selectedClient.activityCompletionRate >= 95 ? 'bg-green-600' :
                            selectedClient.activityCompletionRate >= 85 ? 'bg-yellow-600' : 'bg-red-600'
                          }`}
                          style={{ width: `${selectedClient.activityCompletionRate}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className={`text-sm mt-1 ${
                      selectedClient.activityCompletionRate >= 95 ? 'text-green-600' :
                      selectedClient.activityCompletionRate >= 85 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {selectedClient.activityCompletionRate >= 95 ? 'Tuyệt vời' :
                       selectedClient.activityCompletionRate >= 85 ? 'Tốt' : 'Cần cải thiện'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Trạng thái</h4>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedClient.status)}`}>
                      {getStatusText(selectedClient.status)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedClient(null)}
                  className="btn btn-secondary bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-all"
                >
                  Đóng
                </button>
                <button className="btn btn-primary bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-4 rounded-lg transition-all">
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
