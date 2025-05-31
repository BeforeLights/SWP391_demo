import React, { useState } from 'react'
import { 
  Plus, Search, Edit, Trash2, Eye, Calendar, Clock, 
  Phone, Mail, MapPin, Star, Filter, Download,
  User, Stethoscope, Award, BookOpen
} from 'lucide-react'
import { useNotifications } from '../../contexts/NotificationContext'

interface Doctor {
  id: string
  name: string
  email: string
  phone: string
  specialty: string
  experience: number
  education: string
  licenses: string[]
  rating: number
  totalPatients: number
  activePatients: number
  availableDays: string[]
  timeSlots: string[]
  location: string
  status: 'active' | 'inactive' | 'on-leave'
  joinDate: string
  arvProtocols: string[]
}

interface ARVProtocol {
  id: string
  name: string
  drugs: string[]
  indications: string[]
  contraindications: string[]
  monitoringSchedule: string[]
}

const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'BS. Nguyễn Văn Minh',
    email: 'bs.minh@hospital.vn',
    phone: '0123-456-789',
    specialty: 'Bác sĩ Nhiễm Khuẩn',
    experience: 15,
    education: 'Đại học Y Hà Nội, Thạc sĩ Nhiễm Khuẩn',
    licenses: ['Chứng chỉ hành nghề', 'Chuyên khoa I Nhiễm Khuẩn'],
    rating: 4.9,
    totalPatients: 245,
    activePatients: 89,
    availableDays: ['Thứ 2', 'Thứ 4', 'Thứ 6'],
    timeSlots: ['08:00-12:00', '14:00-17:00'],
    location: 'Phòng khám 201',
    status: 'active',
    joinDate: '2018-03-15',
    arvProtocols: ['TDF/3TC/EFV', 'ABC/3TC/DTG', 'TAF/FTC/BIC']
  },
  {
    id: '2',
    name: 'BS. Trần Thị Lan',
    email: 'bs.lan@hospital.vn',
    phone: '0123-456-790',
    specialty: 'Bác sĩ HIV/AIDS',
    experience: 12,
    education: 'Đại học Y TP.HCM, Chuyên khoa II HIV/AIDS',
    licenses: ['Chứng chỉ hành nghề', 'Chuyên khoa II HIV/AIDS'],
    rating: 4.8,
    totalPatients: 198,
    activePatients: 76,
    availableDays: ['Thứ 3', 'Thứ 5', 'Thứ 7'],
    timeSlots: ['08:30-12:30', '13:30-16:30'],
    location: 'Phòng khám 203',
    status: 'active',
    joinDate: '2020-06-20',
    arvProtocols: ['TDF/3TC/EFV', 'ABC/3TC/DTG', 'TAF/FTC/BIC', 'DTG/3TC']
  },
  {
    id: '3',
    name: 'BS. Lê Hoàng Nam',
    email: 'bs.nam@hospital.vn',
    phone: '0123-456-791',
    specialty: 'Bác sĩ Nội Khoa',
    experience: 18,
    education: 'Đại học Y Huế, Tiến sĩ Y học',
    licenses: ['Chứng chỉ hành nghề', 'Chuyên khoa I Nội Khoa', 'Tiến sĩ Y học'],
    rating: 4.7,
    totalPatients: 320,
    activePatients: 124,
    availableDays: ['Thứ 2', 'Thứ 3', 'Thứ 5'],
    timeSlots: ['09:00-12:00', '14:00-17:00'],
    location: 'Phòng khám 205',
    status: 'active',
    joinDate: '2015-09-10',
    arvProtocols: ['TDF/3TC/EFV', 'ABC/3TC/DTG']
  }
]

const arvProtocols: ARVProtocol[] = [
  {
    id: '1',
    name: 'TDF/3TC/EFV',
    drugs: ['Tenofovir disoproxil fumarate', 'Lamivudine', 'Efavirenz'],
    indications: ['Điều trị khởi đầu', 'Bệnh nhân chưa có kháng thuốc'],
    contraindications: ['Suy thận nặng', 'Rối loạn tâm thần'],
    monitoringSchedule: ['Tháng 1, 3, 6, 12', 'Theo dõi chức năng thận', 'Theo dõi tác dụng phụ CNS']
  },
  {
    id: '2',
    name: 'ABC/3TC/DTG',
    drugs: ['Abacavir', 'Lamivudine', 'Dolutegravir'],
    indications: ['Điều trị khởi đầu', 'Thay thế TDF khi có vấn đề thận'],
    contraindications: ['HLA-B*5701 dương tính', 'Bệnh gan nặng'],
    monitoringSchedule: ['Tháng 1, 3, 6, 12', 'Kiểm tra HLA-B*5701', 'Theo dõi chức năng gan']
  },
  {
    id: '3',
    name: 'TAF/FTC/BIC',
    drugs: ['Tenofovir alafenamide', 'Emtricitabine', 'Bictegravir'],
    indications: ['Điều trị khởi đầu', 'Bệnh nhân có vấn đề thận với TDF'],
    contraindications: ['Không có chống chỉ định tuyệt đối'],
    monitoringSchedule: ['Tháng 1, 3, 6, 12', 'Theo dõi chức năng thận và gan']
  },
  {
    id: '4',
    name: 'DTG/3TC',
    drugs: ['Dolutegravir', 'Lamivudine'],
    indications: ['Phác đồ 2 thuốc', 'Viral load thấp ổn định'],
    contraindications: ['Kháng thuốc NRTI cao'],
    monitoringSchedule: ['Tháng 1, 3, 6, 12', 'Theo dõi viral load chặt chẽ']
  }
]

const DoctorManagement: React.FC = () => {
  const { addNotification } = useNotifications()
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors)
  const [activeTab, setActiveTab] = useState<'doctors' | 'protocols'>('doctors')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')

  // Placeholder functions for future modal implementations
  const handleAddDoctor = () => {
    addNotification({
      type: 'info',
      title: 'Chức năng đang phát triển',
      message: 'Modal thêm bác sĩ sẽ được triển khai sớm'
    })
  }

  const handleAddProtocol = () => {
    addNotification({
      type: 'info',
      title: 'Chức năng đang phát triển',
      message: 'Modal thêm phác đồ sẽ được triển khai sớm'
    })
  }

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || doctor.status === filterStatus
    return matchesSearch && matchesStatus
  })
  const handleDeleteDoctor = (doctorId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bác sĩ này?')) {
      setDoctors(doctors.filter(d => d.id !== doctorId))
      addNotification({
        type: 'info',
        title: 'Thành công',
        message: 'Đã xóa bác sĩ thành công'
      })
    }
  }

  const handleStatusChange = (doctorId: string, newStatus: 'active' | 'inactive' | 'on-leave') => {
    setDoctors(doctors.map(d => 
      d.id === doctorId ? { ...d, status: newStatus } : d
    ))
    addNotification({
      type: 'info',
      title: 'Thành công',
      message: 'Đã cập nhật trạng thái bác sĩ'
    })
  }
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'on-leave': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý bác sĩ</h1>
            <p className="mt-2 text-gray-600">Quản lý thông tin bác sĩ và phác đồ điều trị ARV</p>
          </div>          <div className="mt-4 sm:mt-0">
            <button
              onClick={handleAddDoctor}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm bác sĩ
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('doctors')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'doctors'
                  ? 'border-medical-500 text-medical-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <User className="w-4 h-4 mr-2 inline" />
              Danh sách bác sĩ
            </button>
            <button
              onClick={() => setActiveTab('protocols')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'protocols'
                  ? 'border-medical-500 text-medical-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Stethoscope className="w-4 h-4 mr-2 inline" />
              Phác đồ ARV
            </button>
          </nav>
        </div>

        {/* Doctors Tab */}
        {activeTab === 'doctors' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm bác sĩ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent"
                  />
                </div>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
                <option value="on-leave">Nghỉ phép</option>
              </select>
              <button className="btn btn-secondary">
                <Filter className="w-4 h-4 mr-2" />
                Lọc
              </button>
              <button className="btn btn-secondary">
                <Download className="w-4 h-4 mr-2" />
                Xuất Excel
              </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card text-center">
                <h3 className="text-2xl font-bold text-medical-600">{doctors.length}</h3>
                <p className="text-gray-600">Tổng bác sĩ</p>
              </div>
              <div className="card text-center">
                <h3 className="text-2xl font-bold text-green-600">
                  {doctors.filter(d => d.status === 'active').length}
                </h3>
                <p className="text-gray-600">Đang hoạt động</p>
              </div>
              <div className="card text-center">
                <h3 className="text-2xl font-bold text-medical-600">
                  {doctors.reduce((sum, d) => sum + d.activePatients, 0)}
                </h3>
                <p className="text-gray-600">Bệnh nhân đang điều trị</p>
              </div>
              <div className="card text-center">
                <h3 className="text-2xl font-bold text-yellow-600">
                  {(doctors.reduce((sum, d) => sum + d.rating, 0) / doctors.length).toFixed(1)}
                </h3>
                <p className="text-gray-600">Đánh giá trung bình</p>
              </div>
            </div>

            {/* Doctors List */}
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bác sĩ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Chuyên khoa
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bệnh nhân
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Đánh giá
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDoctors.map((doctor) => (
                      <tr key={doctor.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-medical-100 flex items-center justify-center">
                                <User className="h-6 w-6 text-medical-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                              <div className="text-sm text-gray-500">{doctor.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{doctor.specialty}</div>
                          <div className="text-sm text-gray-500">{doctor.experience} năm kinh nghiệm</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            Đang điều trị: {doctor.activePatients}
                          </div>
                          <div className="text-sm text-gray-500">
                            Tổng: {doctor.totalPatients}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="text-sm text-gray-900">{doctor.rating}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={doctor.status}
                            onChange={(e) => handleStatusChange(doctor.id, e.target.value as any)}
                            className={`text-xs font-medium px-2 py-1 rounded-full border-0 ${getStatusColor(doctor.status)}`}
                          >
                            <option value="active">Hoạt động</option>
                            <option value="inactive">Không hoạt động</option>
                            <option value="on-leave">Nghỉ phép</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedDoctor(doctor)}
                              className="text-medical-600 hover:text-medical-900"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-blue-600 hover:text-blue-900">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteDoctor(doctor.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
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

        {/* ARV Protocols Tab */}
        {activeTab === 'protocols' && (
          <div className="space-y-6">            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Phác đồ điều trị ARV</h2>
              <button
                onClick={handleAddProtocol}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm phác đồ
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {arvProtocols.map((protocol) => (
                <div key={protocol.id} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{protocol.name}</h3>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Thuốc trong phác đồ:</h4>
                      <div className="flex flex-wrap gap-1">
                        {protocol.drugs.map((drug, index) => (
                          <span key={index} className="inline-block bg-medical-100 text-medical-800 text-xs px-2 py-1 rounded">
                            {drug}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Chỉ định:</h4>
                      <ul className="text-sm text-gray-600">
                        {protocol.indications.map((indication, index) => (
                          <li key={index}>• {indication}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Chống chỉ định:</h4>
                      <ul className="text-sm text-gray-600">
                        {protocol.contraindications.map((contraindication, index) => (
                          <li key={index}>• {contraindication}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Lịch theo dõi:</h4>
                      <ul className="text-sm text-gray-600">
                        {protocol.monitoringSchedule.map((schedule, index) => (
                          <li key={index}>• {schedule}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Doctor Detail Modal */}
        {selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-96 overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Chi tiết bác sĩ</h2>
                  <button
                    onClick={() => setSelectedDoctor(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Thông tin cá nhân</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-900">{selectedDoctor.name}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-900">{selectedDoctor.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-900">{selectedDoctor.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-900">{selectedDoctor.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Học vấn & Bằng cấp</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <BookOpen className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-900">{selectedDoctor.education}</span>
                        </div>
                        <div className="mt-2">
                          {selectedDoctor.licenses.map((license, index) => (
                            <div key={index} className="flex items-center">
                              <Award className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-gray-900">{license}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Lịch làm việc</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-900">
                            Ngày làm việc: {selectedDoctor.availableDays.join(', ')}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-900">
                            Giờ làm việc: {selectedDoctor.timeSlots.join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Phác đồ ARV chuyên môn</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedDoctor.arvProtocols.map((protocol, index) => (
                          <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            {protocol}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-medical-600">{selectedDoctor.activePatients}</p>
                        <p className="text-sm text-gray-600">Bệnh nhân đang điều trị</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">{selectedDoctor.rating}</p>
                        <p className="text-sm text-gray-600">Đánh giá trung bình</p>
                      </div>
                    </div>
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

export default DoctorManagement
