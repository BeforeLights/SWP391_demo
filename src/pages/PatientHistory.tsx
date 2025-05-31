import React, { useState } from 'react'
import {
  Calendar, Clock, Activity, TrendingUp, FileText,
  User, Heart, TestTube, Pill, MessageSquare,
  ChevronLeft, ChevronRight, Download,
  Eye, Edit, Trash2, Plus
} from 'lucide-react'
import { format, subMonths, addMonths } from 'date-fns'
import { vi } from 'date-fns/locale'

interface MedicalRecord {
  id: string
  date: string
  type: 'appointment' | 'test' | 'medication' | 'symptom' | 'note'
  title: string
  description: string
  doctor?: string
  result?: string
  value?: number
  unit?: string
  status?: 'normal' | 'abnormal' | 'critical'
  attachments?: string[]
}

interface HealthMetric {
  id: string
  name: string
  value: number
  unit: string
  date: string
  status: 'normal' | 'low' | 'high' | 'critical'
  referenceRange: string
}

interface Appointment {
  id: string
  date: string
  time: string
  doctor: string
  specialty: string
  status: 'completed' | 'cancelled' | 'upcoming'
  notes?: string
}

interface MedicationHistory {
  id: string
  name: string
  startDate: string
  endDate?: string
  dosage: string
  frequency: string
  prescribedBy: string
  reason: string
  status: 'active' | 'completed' | 'discontinued'
}

// Mock data
const mockMedicalRecords: MedicalRecord[] = [
  {
    id: '1',
    date: '2024-01-15',
    type: 'test',
    title: 'Xét nghiệm CD4',
    description: 'Đếm tế bào CD4 định kỳ',
    result: '450 cells/μL',
    value: 450,
    unit: 'cells/μL',
    status: 'normal',
    doctor: 'BS. Nguyễn Văn A'
  },
  {
    id: '2',
    date: '2024-01-15',
    type: 'test',
    title: 'Xét nghiệm Viral Load',
    description: 'Đo tải lượng virus HIV',
    result: 'Không phát hiện (<50 copies/mL)',
    value: 50,
    unit: 'copies/mL',
    status: 'normal',
    doctor: 'BS. Nguyễn Văn A'
  },
  {
    id: '3',
    date: '2024-01-10',
    type: 'appointment',
    title: 'Khám định kỳ',
    description: 'Tái khám theo dõi điều trị ARV',
    doctor: 'BS. Nguyễn Văn A'
  },
  {
    id: '4',
    date: '2024-01-08',
    type: 'medication',
    title: 'Bắt đầu thuốc ARV mới',
    description: 'Chuyển sang phác đồ Efavirenz/Emtricitabine/Tenofovir',
    doctor: 'BS. Nguyễn Văn A'
  },
  {
    id: '5',
    date: '2024-01-05',
    type: 'symptom',
    title: 'Báo cáo triệu chứng',
    description: 'Chóng mặt nhẹ sau khi uống thuốc, đã hết sau 1 tuần',
    status: 'normal'
  }
]

const mockHealthMetrics: HealthMetric[] = [
  {
    id: '1',
    name: 'CD4 Count',
    value: 450,
    unit: 'cells/μL',
    date: '2024-01-15',
    status: 'normal',
    referenceRange: '>350 cells/μL'
  },
  {
    id: '2',
    name: 'Viral Load',
    value: 0,
    unit: 'copies/mL',
    date: '2024-01-15',
    status: 'normal',
    referenceRange: '<50 copies/mL'
  },
  {
    id: '3',
    name: 'BMI',
    value: 22.5,
    unit: 'kg/m²',
    date: '2024-01-10',
    status: 'normal',
    referenceRange: '18.5-24.9'
  },
  {
    id: '4',
    name: 'Blood Pressure',
    value: 120,
    unit: 'mmHg',
    date: '2024-01-10',
    status: 'normal',
    referenceRange: '<140/90'
  }
]

const mockAppointments: Appointment[] = [
  {
    id: '1',
    date: '2024-02-15',
    time: '09:00',
    doctor: 'BS. Nguyễn Văn A',
    specialty: 'HIV/AIDS',
    status: 'upcoming'
  },
  {
    id: '2',
    date: '2024-01-10',
    time: '14:00',
    doctor: 'BS. Nguyễn Văn A',
    specialty: 'HIV/AIDS',
    status: 'completed',
    notes: 'Tái khám định kỳ, bệnh nhân tuân thủ điều trị tốt'
  },
  {
    id: '3',
    date: '2023-12-15',
    time: '10:30',
    doctor: 'BS. Trần Thị B',
    specialty: 'Tâm lý',
    status: 'completed',
    notes: 'Tư vấn tâm lý hỗ trợ'
  }
]

const mockMedicationHistory: MedicationHistory[] = [
  {
    id: '1',
    name: 'Efavirenz/Emtricitabine/Tenofovir (Atripla)',
    startDate: '2024-01-08',
    dosage: '600mg/200mg/300mg',
    frequency: 'Một lần/ngày',
    prescribedBy: 'BS. Nguyễn Văn A',
    reason: 'Điều trị HIV',
    status: 'active'
  },
  {
    id: '2',
    name: 'Lopinavir/Ritonavir (Kaletra)',
    startDate: '2023-06-01',
    endDate: '2024-01-07',
    dosage: '400mg/100mg',
    frequency: 'Hai lần/ngày',
    prescribedBy: 'BS. Nguyễn Văn A',
    reason: 'Điều trị HIV (phác đồ cũ)',
    status: 'discontinued'
  },
  {
    id: '3',
    name: 'Vitamin D3',
    startDate: '2024-01-15',
    dosage: '1000 IU',
    frequency: 'Một lần/ngày',
    prescribedBy: 'BS. Nguyễn Văn A',
    reason: 'Bổ sung vitamin',
    status: 'active'
  }
]

const PatientHistory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'metrics' | 'appointments' | 'medications'>('timeline')
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null)
  const [filterType, setFilterType] = useState<string>('all')
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <Calendar className="w-5 h-5 text-blue-600" />
      case 'test': return <TestTube className="w-5 h-5 text-green-600" />
      case 'medication': return <Pill className="w-5 h-5 text-purple-600" />
      case 'symptom': return <Heart className="w-5 h-5 text-red-600" />
      case 'note': return <MessageSquare className="w-5 h-5 text-gray-600" />
      default: return <FileText className="w-5 h-5 text-gray-600" />
    }
  }

  const getRecordTypeText = (type: string) => {
    switch (type) {
      case 'appointment': return 'Cuộc hẹn'
      case 'test': return 'Xét nghiệm'
      case 'medication': return 'Thuốc'
      case 'symptom': return 'Triệu chứng'
      case 'note': return 'Ghi chú'
      default: return 'Khác'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-100'
      case 'abnormal': return 'text-yellow-600 bg-yellow-100'
      case 'critical': return 'text-red-600 bg-red-100'
      case 'low': return 'text-blue-600 bg-blue-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'active': return 'text-green-600 bg-green-100'
      case 'completed': return 'text-blue-600 bg-blue-100'
      case 'discontinued': return 'text-gray-600 bg-gray-100'
      case 'upcoming': return 'text-purple-600 bg-purple-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal': return 'Bình thường'
      case 'abnormal': return 'Bất thường'
      case 'critical': return 'Nguy hiểm'
      case 'low': return 'Thấp'
      case 'high': return 'Cao'
      case 'active': return 'Đang dùng'
      case 'completed': return 'Hoàn thành'
      case 'discontinued': return 'Ngừng dùng'
      case 'upcoming': return 'Sắp tới'
      case 'cancelled': return 'Đã hủy'
      default: return status
    }
  }

  const filteredRecords = mockMedicalRecords.filter(record => 
    filterType === 'all' || record.type === filterType
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hồ sơ bệnh án</h1>
          <p className="mt-2 text-gray-600">Theo dõi lịch sử điều trị và sức khỏe</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'timeline', label: 'Dòng thời gian', icon: Clock },
              { id: 'metrics', label: 'Chỉ số sức khỏe', icon: Activity },
              { id: 'appointments', label: 'Lịch hẹn', icon: Calendar },
              { id: 'medications', label: 'Lịch sử thuốc', icon: Pill }
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

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Dòng thời gian điều trị</h2>
              <div className="flex space-x-4">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="form-select"
                >
                  <option value="all">Tất cả</option>
                  <option value="appointment">Cuộc hẹn</option>
                  <option value="test">Xét nghiệm</option>
                  <option value="medication">Thuốc</option>
                  <option value="symptom">Triệu chứng</option>
                  <option value="note">Ghi chú</option>
                </select>
                <button className="btn btn-secondary">
                  <Download className="w-4 h-4 mr-2" />
                  Xuất báo cáo
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredRecords.map(record => (
                <div key={record.id} className="card">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getRecordIcon(record.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{record.title}</h3>
                          <p className="text-sm text-gray-600">{getRecordTypeText(record.type)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">{format(new Date(record.date), 'dd/MM/yyyy', { locale: vi })}</p>
                          {record.status && (
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                              {getStatusText(record.status)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="mt-2 text-gray-700">{record.description}</p>
                      
                      {record.result && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Kết quả:</h4>
                          <p className="text-sm text-gray-900">{record.result}</p>
                        </div>
                      )}
                      
                      {record.doctor && (
                        <div className="mt-3 flex items-center text-sm text-gray-600">
                          <User className="w-4 h-4 mr-1" />
                          {record.doctor}
                        </div>
                      )}
                      
                      <div className="mt-4 flex space-x-3">
                        <button
                          onClick={() => setSelectedRecord(record)}
                          className="text-medical-600 hover:text-medical-800 text-sm flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Xem chi tiết
                        </button>
                        <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                          <Edit className="w-4 h-4 mr-1" />
                          Chỉnh sửa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Health Metrics Tab */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Chỉ số sức khỏe</h2>
              <button className="btn btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Thêm chỉ số
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockHealthMetrics.map(metric => (
                <div key={metric.id} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{metric.name}</h3>
                      <p className="text-sm text-gray-600">
                        Cập nhật: {format(new Date(metric.date), 'dd/MM/yyyy', { locale: vi })}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                      {getStatusText(metric.status)}
                    </span>
                  </div>
                  
                  <div className="text-center py-4">
                    <p className="text-3xl font-bold text-gray-900">
                      {metric.value} <span className="text-lg text-gray-600">{metric.unit}</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Khoảng bình thường: {metric.referenceRange}
                    </p>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button className="btn btn-secondary btn-sm flex-1">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Xem xu hướng
                    </button>
                    <button className="btn btn-primary btn-sm flex-1">
                      <Plus className="w-4 h-4 mr-1" />
                      Thêm giá trị
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Lịch hẹn</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="font-medium text-gray-900">
                    {format(currentMonth, 'MMMM yyyy', { locale: vi })}
                  </span>
                  <button
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <button className="btn btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Đặt lịch hẹn
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {mockAppointments.map(appointment => (
                <div key={appointment.id} className="card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-medical-600">
                          {format(new Date(appointment.date), 'dd')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {format(new Date(appointment.date), 'MMM', { locale: vi })}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {appointment.doctor}
                        </h3>
                        <p className="text-gray-600">{appointment.specialty}</p>
                        <div className="flex items-center mt-1">
                          <Clock className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-600">{appointment.time}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                        {getStatusText(appointment.status)}
                      </span>
                      <div className="mt-2 flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          <Edit className="w-4 h-4" />
                        </button>
                        {appointment.status === 'upcoming' && (
                          <button className="text-red-600 hover:text-red-800 text-sm">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {appointment.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{appointment.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Medications History Tab */}
        {activeTab === 'medications' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Lịch sử thuốc</h2>
              <button className="btn btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Thêm thuốc
              </button>
            </div>

            <div className="space-y-4">
              {mockMedicationHistory.map(medication => (
                <div key={medication.id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{medication.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(medication.status)}`}>
                          {getStatusText(medication.status)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Liều dùng:</p>
                          <p className="font-medium">{medication.dosage}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Tần suất:</p>
                          <p className="font-medium">{medication.frequency}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Bắt đầu:</p>
                          <p className="font-medium">
                            {format(new Date(medication.startDate), 'dd/MM/yyyy', { locale: vi })}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Kết thúc:</p>
                          <p className="font-medium">
                            {medication.endDate ? 
                              format(new Date(medication.endDate), 'dd/MM/yyyy', { locale: vi }) : 
                              'Đang tiếp tục'
                            }
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3 space-y-2">
                        <div>
                          <p className="text-sm text-gray-600">Lý do kê đơn:</p>
                          <p className="text-sm font-medium">{medication.reason}</p>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="w-4 h-4 mr-1" />
                          Kê đơn bởi: {medication.prescribedBy}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {selectedRecord && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedRecord.title}</h3>
                  <p className="text-gray-600">{getRecordTypeText(selectedRecord.type)}</p>
                </div>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Ngày:</h4>
                  <p className="text-gray-900">
                    {format(new Date(selectedRecord.date), 'dd/MM/yyyy', { locale: vi })}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Mô tả:</h4>
                  <p className="text-gray-900">{selectedRecord.description}</p>
                </div>
                
                {selectedRecord.result && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Kết quả:</h4>
                    <p className="text-gray-900">{selectedRecord.result}</p>
                  </div>
                )}
                
                {selectedRecord.doctor && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Bác sĩ:</h4>
                    <p className="text-gray-900">{selectedRecord.doctor}</p>
                  </div>
                )}
                
                {selectedRecord.status && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Trạng thái:</h4>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedRecord.status)}`}>
                      {getStatusText(selectedRecord.status)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PatientHistory
