import React, { useState } from 'react'
import {
  Calendar, Clock, Activity, TrendingUp, FileText,
  User, Heart, Brain, Smile, MessageSquare,
  ChevronLeft, ChevronRight, Download,
  Eye, Edit, Trash2, Plus, Sparkles, Sun, Frown, Meh,
  CheckCircle, X
} from 'lucide-react'
import { format, subMonths, addMonths } from 'date-fns'
import { vi } from 'date-fns/locale'

interface MentalHealthRecord {
  id: string
  date: string
  type: 'appointment' | 'assessment' | 'activity' | 'symptom' | 'note'
  title: string
  description: string
  specialist?: string
  result?: string
  value?: number
  unit?: string
  status?: 'improved' | 'unchanged' | 'worsened'
  attachments?: string[]
}

interface MoodMetric {
  id: string
  name: string
  value: number
  unit: string
  date: string
  status: 'good' | 'moderate' | 'poor' | 'critical'
  referenceRange: string
}

interface TherapySession {
  id: string
  date: string
  time: string
  specialist: string
  specialty: string
  status: 'completed' | 'cancelled' | 'upcoming'
  notes?: string
}

interface MentalHealthActivity {
  id: string
  name: string
  startDate: string
  endDate?: string
  frequency: string
  recommendedBy: string
  purpose: string
  status: 'active' | 'completed' | 'discontinued'
}

// Mock data
const mockMentalHealthRecords: MentalHealthRecord[] = [
  {
    id: '1',
    date: '2024-01-15',
    type: 'assessment',
    title: 'Đánh giá Mức độ Lo âu',
    description: 'Thang đo GAD-7 cho lo âu',
    result: '5 điểm - Lo âu nhẹ',
    value: 5,
    unit: 'điểm',
    status: 'improved',
    specialist: 'ThS. Nguyễn Văn Minh'
  },
  {
    id: '2',
    date: '2024-01-15',
    type: 'assessment',
    title: 'Đánh giá Trầm cảm',
    description: 'Thang đo PHQ-9 cho trầm cảm',
    result: '3 điểm - Bình thường',
    value: 3,
    unit: 'điểm',
    status: 'improved',
    specialist: 'ThS. Nguyễn Văn Minh'
  },
  {
    id: '3',
    date: '2024-01-10',
    type: 'appointment',
    title: 'Buổi trị liệu tâm lý',
    description: 'Liệu pháp nhận thức hành vi (CBT)',
    specialist: 'ThS. Nguyễn Văn Minh',
    status: 'improved'
  },
  {
    id: '4',
    date: '2024-01-08',
    type: 'activity',
    title: 'Thiền Mindfulness',
    description: 'Bắt đầu thực hành thiền 15 phút mỗi ngày',
    specialist: 'ThS. Nguyễn Văn Minh',
    status: 'improved'
  },
  {
    id: '5',
    date: '2024-01-05',
    type: 'symptom',
    title: 'Báo cáo cảm xúc',
    description: 'Cảm thấy lo âu khi gặp tình huống xã hội đông người',
    status: 'unchanged'
  }
]

const mockMoodMetrics: MoodMetric[] = [
  {
    id: '1',
    name: 'Mức độ Lo âu',
    value: 5,
    unit: 'điểm',
    date: '2024-01-15',
    status: 'moderate',
    referenceRange: '<5 điểm: Bình thường'
  },
  {
    id: '2',
    name: 'Mức độ Trầm cảm',
    value: 3,
    unit: 'điểm',
    date: '2024-01-15',
    status: 'good',
    referenceRange: '<5 điểm: Bình thường'
  },
  {
    id: '3',
    name: 'Chất lượng Giấc ngủ',
    value: 7,
    unit: 'điểm',
    date: '2024-01-10',
    status: 'good',
    referenceRange: '>7: Tốt'
  },
  {
    id: '4',
    name: 'Mức độ Stress',
    value: 6,
    unit: 'điểm',
    date: '2024-01-10',
    status: 'moderate',
    referenceRange: '<5: Thấp'
  }
]

const mockTherapySessions: TherapySession[] = [
  {
    id: '1',
    date: '2024-02-15',
    time: '09:00',
    specialist: 'ThS. Nguyễn Văn Minh',
    specialty: 'Tâm lý trị liệu',
    status: 'upcoming'
  },
  {
    id: '2',
    date: '2024-01-10',
    time: '14:00',
    specialist: 'ThS. Nguyễn Văn Minh',
    specialty: 'Tâm lý trị liệu',
    status: 'completed',
    notes: 'Tiến triển tốt với kỹ thuật thư giãn và thiền định'
  },
  {
    id: '3',
    date: '2023-12-15',
    time: '10:30',
    specialist: 'TS. Trần Thị Lan',
    specialty: 'Tâm lý lâm sàng',
    status: 'completed',
    notes: 'Đánh giá ban đầu và thiết lập kế hoạch điều trị'
  }
]

const mockMentalHealthActivities: MentalHealthActivity[] = [
  {
    id: '1',
    name: 'Thiền Mindfulness',
    startDate: '2024-01-08',
    frequency: 'Mỗi ngày, 15 phút',
    recommendedBy: 'ThS. Nguyễn Văn Minh',
    purpose: 'Giảm lo âu và cải thiện tập trung',
    status: 'active'
  },
  {
    id: '2',
    name: 'Nhật ký Cảm xúc',
    startDate: '2024-01-10',
    frequency: 'Mỗi tối',
    recommendedBy: 'ThS. Nguyễn Văn Minh',
    purpose: 'Theo dõi và nhận diện cảm xúc',
    status: 'active'
  },
  {
    id: '3',
    name: 'Tập thể dục nhẹ',
    startDate: '2024-01-15',
    frequency: '3 lần/tuần, 30 phút',
    recommendedBy: 'ThS. Nguyễn Văn Minh',
    purpose: 'Cải thiện tâm trạng và sức khỏe thể chất',
    status: 'active'
  }
]

const MentalHealthHistory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'metrics' | 'sessions' | 'activities'>('timeline')
  const [selectedRecord, setSelectedRecord] = useState<MentalHealthRecord | null>(null)
  const [filterType, setFilterType] = useState<string>('all')
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <Calendar className="w-5 h-5 text-ocean-600" />
      case 'assessment': return <Brain className="w-5 h-5 text-brand-600" />
      case 'activity': return <Sparkles className="w-5 h-5 text-purple-600" />
      case 'symptom': return <Heart className="w-5 h-5 text-red-600" />
      case 'note': return <MessageSquare className="w-5 h-5 text-slate-600" />
      default: return <FileText className="w-5 h-5 text-slate-600" />
    }
  }

  const getRecordTypeText = (type: string) => {
    switch (type) {
      case 'appointment': return 'Buổi trị liệu'
      case 'assessment': return 'Đánh giá'
      case 'activity': return 'Hoạt động'
      case 'symptom': return 'Triệu chứng'
      case 'note': return 'Ghi chú'
      default: return 'Khác'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'improved': return 'text-green-600 bg-green-100'
      case 'unchanged': return 'text-yellow-600 bg-yellow-100'
      case 'worsened': return 'text-red-600 bg-red-100'
      case 'good': return 'text-green-600 bg-green-100'
      case 'moderate': return 'text-yellow-600 bg-yellow-100'
      case 'poor': return 'text-orange-600 bg-orange-100'
      case 'critical': return 'text-red-600 bg-red-100'
      case 'active': return 'text-green-600 bg-green-100'
      case 'completed': return 'text-blue-600 bg-blue-100'
      case 'discontinued': return 'text-slate-600 bg-slate-100'
      case 'upcoming': return 'text-ocean-600 bg-ocean-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-slate-600 bg-slate-100'
    }
  }

  const filteredRecords = filterType === 'all' 
    ? mockMentalHealthRecords 
    : mockMentalHealthRecords.filter(record => record.type === filterType)

  const handlePreviousMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center mb-8 animate-fade-in">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-brand-600 to-ocean-600 rounded-xl flex items-center justify-center text-white shadow-lg mr-4 animate-float">
              <Brain className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-600 to-ocean-600 bg-clip-text text-transparent">
                Lịch sử Sức khỏe Tinh thần
              </h1>
              <p className="text-slate-600">
                Theo dõi quá trình và lịch sử sức khỏe tinh thần của bạn
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-fade-in" style={{animationDelay: '0.1s'}}>
          <div className="card bg-gradient-to-br from-brand-50 to-brand-100 border-brand-200">
            <div className="flex items-center">
              <div className="bg-brand-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-brand-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Số buổi trị liệu</p>
                <p className="text-2xl font-bold text-slate-900">{mockTherapySessions.length}</p>
              </div>
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-ocean-50 to-ocean-100 border-ocean-200">
            <div className="flex items-center">
              <div className="bg-ocean-100 p-3 rounded-full">
                <Brain className="h-6 w-6 text-ocean-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Mức độ Lo âu</p>
                <p className="text-2xl font-bold text-slate-900">
                  {mockMoodMetrics.find(m => m.name === 'Mức độ Lo âu')?.value || 0}/10
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
                <p className="text-sm font-medium text-slate-600">Tâm trạng</p>
                <p className="text-2xl font-bold text-slate-900">Tích cực</p>
              </div>
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
            <div className="flex items-center">
              <div className="bg-slate-100 p-3 rounded-full">
                <Activity className="h-6 w-6 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Hoạt động</p>
                <p className="text-2xl font-bold text-slate-900">{mockMentalHealthActivities.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 border-b border-gray-200 mb-6 animate-fade-in rounded-t-xl bg-gradient-to-r from-slate-50 to-white p-1" style={{animationDelay: '0.2s'}}>
          {[
            { id: 'timeline', label: 'Dòng thời gian', icon: Clock },
            { id: 'metrics', label: 'Chỉ số', icon: Activity },
            { id: 'sessions', label: 'Buổi trị liệu', icon: Calendar },
            { id: 'activities', label: 'Hoạt động', icon: Sparkles }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-all duration-300 flex items-center ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-brand-500 to-ocean-600 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-ocean-600'
              }`}
            >
              {React.createElement(tab.icon, { 
                className: `h-4 w-4 mr-2 ${activeTab === tab.id ? 'animate-pulse' : ''}` 
              })}
              {tab.label}
            </button>
          ))}
          
          <div className="ml-auto">
            <button
              onClick={() => {
                // Handle add new record
              }}
              className="bg-gradient-to-r from-brand-600 to-ocean-600 hover:from-brand-700 hover:to-ocean-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-all transform hover:scale-[1.02]"
            >
              <Plus className="h-4 w-4 mr-1" />
              Thêm mục mới
            </button>
          </div>
        </div>

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className="space-y-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    filterType === 'all'
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setFilterType('assessment')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    filterType === 'assessment'
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Đánh giá
                </button>
                <button
                  onClick={() => setFilterType('appointment')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    filterType === 'appointment'
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Buổi trị liệu
                </button>
                <button
                  onClick={() => setFilterType('activity')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    filterType === 'activity'
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Hoạt động
                </button>
                <button
                  onClick={() => setFilterType('symptom')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    filterType === 'symptom'
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Triệu chứng
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button 
                  onClick={handlePreviousMonth}
                  className="p-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-600" />
                </button>
                <span className="text-sm font-medium">
                  {format(currentMonth, 'MMMM yyyy', { locale: vi })}
                </span>
                <button 
                  onClick={handleNextMonth}
                  className="p-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="space-y-4 animate-stagger">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record, index) => (
                  <div 
                    key={record.id} 
                    className="card border-l-4 border-l-ocean-500 stagger-item" 
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex">
                        <div className="flex flex-col items-center mr-4">
                          <div className="p-2 bg-ocean-100 rounded-full">
                            {getRecordIcon(record.type)}
                          </div>
                          <div className="w-px h-full bg-gray-200 my-2"></div>
                        </div>
                        <div>
                          <div className="flex items-center mb-1">
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                              {getRecordTypeText(record.type)}
                            </span>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-xs text-gray-500">
                              {format(new Date(record.date), 'dd/MM/yyyy')}
                            </span>
                            {record.status && (
                              <>
                                <span className="mx-2 text-gray-300">•</span>
                                <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(record.status)}`}>
                                  {record.status === 'improved' ? 'Cải thiện' : 
                                   record.status === 'unchanged' ? 'Không đổi' : 'Xấu đi'}
                                </span>
                              </>
                            )}
                          </div>
                          <h3 className="text-lg font-medium text-gray-900">{record.title}</h3>
                          <p className="text-gray-600 mt-1">{record.description}</p>
                          
                          {record.result && (
                            <div className="mt-2 px-3 py-2 bg-gray-50 rounded-md">
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Kết quả:</span> {record.result}
                              </p>
                            </div>
                          )}
                          
                          {record.specialist && (
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <User className="h-4 w-4 mr-1" />
                              <span>{record.specialist}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-1">
                        <button
                          onClick={() => setSelectedRecord(record)}
                          className="p-1.5 text-gray-400 hover:text-ocean-600 hover:bg-ocean-50 rounded-md"
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-md"
                          title="Chỉnh sửa"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card text-center py-12 animate-float">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-r from-brand-100 to-ocean-100 rounded-full flex items-center justify-center mb-6 shadow-lg animate-pulse">
                    <FileText className="h-10 w-10 text-ocean-600" />
                  </div>
                  <h3 className="text-xl font-medium text-slate-900 mb-3">Không có dữ liệu</h3>
                  <p className="text-slate-600 mb-6 max-w-md mx-auto">Chưa có dữ liệu nào trong khoảng thời gian này hoặc với bộ lọc đã chọn.</p>
                  <button
                    className="bg-gradient-to-r from-brand-600 to-ocean-600 hover:from-brand-700 hover:to-ocean-700 text-white px-6 py-3 rounded-xl font-medium inline-flex items-center transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <Plus className="h-5 w-5 mr-2 animate-bounce-gentle" />
                    Thêm mục mới
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Metrics Tab */}
        {activeTab === 'metrics' && (
          <div className="space-y-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-900">Chỉ số Sức khỏe Tinh thần</h2>
              <button className="btn-secondary inline-flex items-center">
                <Plus className="h-4 w-4 mr-1" />
                Thêm chỉ số
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockMoodMetrics.map((metric) => (
                <div key={metric.id} className="card animate-slide-up">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{metric.name}</h3>
                      <p className="text-sm text-gray-500">{format(new Date(metric.date), 'dd/MM/yyyy')}</p>
                      
                      <div className="mt-4 flex items-end">
                        <span className="text-3xl font-bold text-gray-900">{metric.value}</span>
                        <span className="ml-1 text-gray-500">{metric.unit}</span>
                        <span className={`ml-3 px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(metric.status)}`}>
                          {metric.status === 'good' ? 'Tốt' : 
                           metric.status === 'moderate' ? 'Trung bình' : 
                           metric.status === 'poor' ? 'Kém' : 'Nguy hiểm'}
                        </span>
                      </div>
                      
                      <div className="mt-3">
                        <p className="text-xs text-gray-500">Phạm vi tham chiếu</p>
                        <p className="text-sm text-gray-700">{metric.referenceRange}</p>
                      </div>
                    </div>
                    
                    <div>
                      {metric.name === 'Mức độ Lo âu' && (
                        <div className="w-20 h-20 relative">
                          <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                            {metric.value <= 4 ? (
                              <Smile className="h-10 w-10 text-green-500" />
                            ) : metric.value <= 7 ? (
                              <Meh className="h-10 w-10 text-yellow-500" />
                            ) : (
                              <Frown className="h-10 w-10 text-red-500" />
                            )}
                          </div>
                          <div 
                            className="absolute inset-0 rounded-full border-4 border-transparent"
                            style={{
                              backgroundImage: `conic-gradient(${
                                metric.value <= 4 ? '#22c55e' : 
                                metric.value <= 7 ? '#eab308' : '#ef4444'
                              } ${metric.value * 10}%, transparent 0)`,
                              maskImage: 'radial-gradient(transparent 60%, black 60%)',
                              WebkitMaskImage: 'radial-gradient(transparent 60%, black 60%)'
                            }}
                          ></div>
                        </div>
                      )}
                      
                      {metric.name === 'Mức độ Trầm cảm' && (
                        <div className="w-20 h-20 relative">
                          <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                            {metric.value <= 4 ? (
                              <Smile className="h-10 w-10 text-green-500" />
                            ) : metric.value <= 7 ? (
                              <Meh className="h-10 w-10 text-yellow-500" />
                            ) : (
                              <Frown className="h-10 w-10 text-red-500" />
                            )}
                          </div>
                          <div 
                            className="absolute inset-0 rounded-full border-4 border-transparent"
                            style={{
                              backgroundImage: `conic-gradient(${
                                metric.value <= 4 ? '#22c55e' : 
                                metric.value <= 7 ? '#eab308' : '#ef4444'
                              } ${metric.value * 10}%, transparent 0)`,
                              maskImage: 'radial-gradient(transparent 60%, black 60%)',
                              WebkitMaskImage: 'radial-gradient(transparent 60%, black 60%)'
                            }}
                          ></div>
                        </div>
                      )}
                      
                      {metric.name === 'Chất lượng Giấc ngủ' && (
                        <div className="w-20 h-20 relative">
                          <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                            {metric.value >= 7 ? (
                              <Smile className="h-10 w-10 text-green-500" />
                            ) : metric.value >= 5 ? (
                              <Meh className="h-10 w-10 text-yellow-500" />
                            ) : (
                              <Frown className="h-10 w-10 text-red-500" />
                            )}
                          </div>
                          <div 
                            className="absolute inset-0 rounded-full border-4 border-transparent"
                            style={{
                              backgroundImage: `conic-gradient(${
                                metric.value >= 7 ? '#22c55e' : 
                                metric.value >= 5 ? '#eab308' : '#ef4444'
                              } ${metric.value * 10}%, transparent 0)`,
                              maskImage: 'radial-gradient(transparent 60%, black 60%)',
                              WebkitMaskImage: 'radial-gradient(transparent 60%, black 60%)'
                            }}
                          ></div>
                        </div>
                      )}
                      
                      {metric.name === 'Mức độ Stress' && (
                        <div className="w-20 h-20 relative">
                          <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                            {metric.value <= 4 ? (
                              <Smile className="h-10 w-10 text-green-500" />
                            ) : metric.value <= 7 ? (
                              <Meh className="h-10 w-10 text-yellow-500" />
                            ) : (
                              <Frown className="h-10 w-10 text-red-500" />
                            )}
                          </div>
                          <div 
                            className="absolute inset-0 rounded-full border-4 border-transparent"
                            style={{
                              backgroundImage: `conic-gradient(${
                                metric.value <= 4 ? '#22c55e' : 
                                metric.value <= 7 ? '#eab308' : '#ef4444'
                              } ${metric.value * 10}%, transparent 0)`,
                              maskImage: 'radial-gradient(transparent 60%, black 60%)',
                              WebkitMaskImage: 'radial-gradient(transparent 60%, black 60%)'
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Therapy Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="space-y-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-900">Buổi trị liệu</h2>
              <button className="btn-secondary inline-flex items-center">
                <Plus className="h-4 w-4 mr-1" />
                Đặt lịch mới
              </button>
            </div>
            
            <div className="space-y-4">
              {mockTherapySessions.map((session) => (
                <div 
                  key={session.id} 
                  className={`card ${
                    session.status === 'upcoming' 
                      ? 'border-l-4 border-l-ocean-500' 
                      : session.status === 'completed'
                      ? 'border-l-4 border-l-green-500'
                      : 'border-l-4 border-l-red-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex">
                      <div className="mr-4">
                        {session.status === 'upcoming' ? (
                          <div className="p-3 bg-ocean-100 rounded-full">
                            <Calendar className="h-5 w-5 text-ocean-600" />
                          </div>
                        ) : session.status === 'completed' ? (
                          <div className="p-3 bg-green-100 rounded-full">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                        ) : (
                          <div className="p-3 bg-red-100 rounded-full">
                            <X className="h-5 w-5 text-red-600" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${getStatusColor(session.status)}`}>
                            {session.status === 'upcoming' ? 'Sắp tới' : 
                             session.status === 'completed' ? 'Đã hoàn thành' : 'Đã hủy'}
                          </span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-xs text-gray-500">
                            {format(new Date(session.date), 'dd/MM/yyyy')}
                          </span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-xs text-gray-500">
                            {session.time}
                          </span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Buổi trị liệu với {session.specialist}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Chuyên khoa: {session.specialty}
                        </p>
                        
                        {session.notes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-md">
                            <p className="text-sm text-gray-700">{session.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {session.status === 'upcoming' && (
                        <>
                          <button className="px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white rounded-md text-sm">
                            Đổi lịch
                          </button>
                          <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm">
                            Hủy
                          </button>
                        </>
                      )}
                      {session.status === 'completed' && (
                        <button className="px-3 py-1 bg-ocean-600 hover:bg-ocean-700 text-white rounded-md text-sm">
                          Xem ghi chú
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activities Tab */}
        {activeTab === 'activities' && (
          <div className="space-y-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-900">Hoạt động sức khỏe tinh thần</h2>
              <button className="btn-secondary inline-flex items-center">
                <Plus className="h-4 w-4 mr-1" />
                Thêm hoạt động
              </button>
            </div>
            
            <div className="space-y-4">
              {mockMentalHealthActivities.map((activity) => (
                <div 
                  key={activity.id}
                  className={`card ${
                    activity.status === 'active' 
                      ? 'border-l-4 border-l-green-500' 
                      : activity.status === 'completed'
                      ? 'border-l-4 border-l-blue-500'
                      : 'border-l-4 border-l-gray-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex">
                      <div className="mr-4">
                        <div className="p-3 bg-purple-100 rounded-full">
                          <Sparkles className="h-5 w-5 text-purple-600" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${getStatusColor(activity.status)}`}>
                            {activity.status === 'active' ? 'Đang thực hiện' : 
                             activity.status === 'completed' ? 'Đã hoàn thành' : 'Đã ngừng'}
                          </span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-xs text-gray-500">
                            Bắt đầu: {format(new Date(activity.startDate), 'dd/MM/yyyy')}
                          </span>
                          {activity.endDate && (
                            <>
                              <span className="mx-2 text-gray-300">•</span>
                              <span className="text-xs text-gray-500">
                                Kết thúc: {format(new Date(activity.endDate), 'dd/MM/yyyy')}
                              </span>
                            </>
                          )}
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">{activity.name}</h3>
                        <p className="text-sm text-gray-600">
                          Tần suất: {activity.frequency}
                        </p>
                        
                        <div className="mt-3 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Mục đích</p>
                            <p className="text-sm text-gray-700">{activity.purpose}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Được đề xuất bởi</p>
                            <p className="text-sm text-gray-700">{activity.recommendedBy}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-ocean-600 hover:bg-ocean-50 rounded-full">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Record Detail Modal */}
        {selectedRecord && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl p-6 animate-slide-up">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-ocean-100 rounded-full mr-3">
                    {getRecordIcon(selectedRecord.type)}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {getRecordTypeText(selectedRecord.type)}
                      </span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-xs text-gray-500">
                        {format(new Date(selectedRecord.date), 'dd/MM/yyyy')}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mt-1">{selectedRecord.title}</h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="border-t border-gray-200 pt-4 pb-1">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Mô tả</h4>
                  <p className="text-gray-600">{selectedRecord.description}</p>
                </div>
                
                {selectedRecord.result && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Kết quả</h4>
                    <div className="px-4 py-3 bg-gray-50 rounded-md">
                      <p className="text-gray-700">{selectedRecord.result}</p>
                      {selectedRecord.value !== undefined && (
                        <div className="mt-2 flex items-center">
                          <div className="w-full h-2 bg-gray-200 rounded-full">
                            <div 
                              className={`h-2 rounded-full ${
                                selectedRecord.status === 'improved' ? 'bg-green-500' : 
                                selectedRecord.status === 'unchanged' ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(selectedRecord.value * 10, 100)}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm font-medium">
                            {selectedRecord.value} {selectedRecord.unit}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {selectedRecord.specialist && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Chuyên gia</h4>
                    <p className="text-gray-600 flex items-center">
                      <User className="h-4 w-4 mr-1 text-gray-400" />
                      {selectedRecord.specialist}
                    </p>
                  </div>
                )}
                
                {selectedRecord.attachments && selectedRecord.attachments.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Tài liệu đính kèm</h4>
                    <div className="space-y-2">
                      {selectedRecord.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm text-gray-600">{attachment}</span>
                          <button className="text-ocean-600 hover:text-ocean-800">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end mt-4 space-x-3">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Đóng
                </button>
                <button className="px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700">
                  Tải xuống
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MentalHealthHistory
