import React, { useState } from 'react'
import { 
  Plus, Search, Edit, Trash2, Eye, Calendar, Clock, 
  Phone, Mail, MapPin, Star, Filter, Download,
  User, Brain, Award, BookOpen, Heart
} from 'lucide-react'
import { useNotifications } from '../../contexts/NotificationContext'

interface Therapist {
  id: string
  name: string
  email: string
  phone: string
  specialty: string
  experience: number
  education: string
  licenses: string[]
  rating: number
  totalClients: number
  activeClients: number
  availableDays: string[]
  timeSlots: string[]
  location: string
  status: 'active' | 'inactive' | 'on-leave'
  joinDate: string
  therapyMethods: string[]
}

interface TherapyMethod {
  id: string
  name: string
  techniques: string[]
  indications: string[]
  contraindications: string[]
  sessionStructure: string[]
}

const mockTherapists: Therapist[] = [
  {
    id: '1',
    name: 'ThS. Nguyễn Văn Minh',
    email: 'ths.minh@youareheard.vn',
    phone: '0123-456-789',
    specialty: 'Chuyên gia Tâm lý Lâm sàng',
    experience: 15,
    education: 'Đại học Y Hà Nội, Thạc sĩ Tâm lý học Lâm sàng',
    licenses: ['Chứng chỉ hành nghề Tâm lý', 'Chứng nhận Liệu pháp CBT'],
    rating: 4.9,
    totalClients: 245,
    activeClients: 89,
    availableDays: ['Thứ 2', 'Thứ 4', 'Thứ 6'],
    timeSlots: ['08:00-12:00', '14:00-17:00'],
    location: 'Phòng tư vấn 201',
    status: 'active',
    joinDate: '2018-03-15',
    therapyMethods: ['Liệu pháp nhận thức hành vi (CBT)', 'Liệu pháp chấp nhận và cam kết (ACT)', 'Chánh niệm (Mindfulness)']
  },
  {
    id: '2',
    name: 'ThS. Trần Thị Lan',
    email: 'ths.lan@youareheard.vn',
    phone: '0123-456-790',
    specialty: 'Chuyên gia Tâm lý Tư vấn',
    experience: 12,
    education: 'Đại học KHXH&NV TP.HCM, Thạc sĩ Tư vấn Tâm lý',
    licenses: ['Chứng chỉ hành nghề Tâm lý', 'Chứng nhận Liệu pháp SFBT'],
    rating: 4.8,
    totalClients: 198,
    activeClients: 76,
    availableDays: ['Thứ 3', 'Thứ 5', 'Thứ 7'],
    timeSlots: ['08:30-12:30', '13:30-16:30'],
    location: 'Phòng tư vấn 203',
    status: 'active',
    joinDate: '2020-06-20',
    therapyMethods: ['Liệu pháp tâm lý động (Psychodynamic)', 'Liệu pháp giải pháp tập trung ngắn hạn (SFBT)', 'Liệu pháp biện chứng hành vi (DBT)']
  },
  {
    id: '3',
    name: 'ThS. Lê Hoàng Nam',
    email: 'ths.nam@youareheard.vn',
    phone: '0123-456-791',
    specialty: 'Chuyên gia Tâm lý Trị liệu',
    experience: 18,
    education: 'Đại học Y Huế, Tiến sĩ Tâm lý học',
    licenses: ['Chứng chỉ hành nghề Tâm lý', 'Chứng nhận Liệu pháp EMDR', 'Tiến sĩ Tâm lý học'],
    rating: 4.7,
    totalClients: 320,
    activeClients: 124,
    availableDays: ['Thứ 2', 'Thứ 3', 'Thứ 5'],
    timeSlots: ['09:00-12:00', '14:00-17:00'],
    location: 'Phòng tư vấn 205',
    status: 'active',
    joinDate: '2015-09-10',
    therapyMethods: ['Liệu pháp nhận thức hành vi (CBT)', 'Khử mẫn cảm và tái xử lý qua chuyển động mắt (EMDR)', 'Liệu pháp hệ thống gia đình']
  }
]

const therapyMethods: TherapyMethod[] = [
  {
    id: '1',
    name: 'Liệu pháp nhận thức hành vi (CBT)',
    techniques: ['Tái cấu trúc nhận thức', 'Kỹ thuật thư giãn', 'Biểu đồ suy nghĩ'],
    indications: ['Rối loạn lo âu', 'Trầm cảm', 'Rối loạn ám ảnh cưỡng chế'],
    contraindications: ['Khó khăn nhận thức nghiêm trọng', 'Không có khả năng phản ánh'],
    sessionStructure: ['Đánh giá ban đầu', 'Xác định suy nghĩ tiêu cực tự động', 'Phát triển chiến lược đối phó', 'Luyện tập kỹ năng']
  },
  {
    id: '2',
    name: 'Liệu pháp biện chứng hành vi (DBT)',
    techniques: ['Kỹ năng chánh niệm', 'Kỹ năng điều hòa cảm xúc', 'Kỹ năng chịu đựng đau khổ'],
    indications: ['Rối loạn nhân cách ranh giới', 'Hành vi tự hại', 'Rối loạn ăn uống'],
    contraindications: ['Không có động lực thay đổi', 'Các hành vi gây tổn hại cho người khác'],
    sessionStructure: ['Điều trị cá nhân hàng tuần', 'Nhóm huấn luyện kỹ năng', 'Hỗ trợ qua điện thoại', 'Nhóm tư vấn cho nhà trị liệu']
  },
  {
    id: '3',
    name: 'Liệu pháp chấp nhận và cam kết (ACT)',
    techniques: ['Phân biệt bản thân với suy nghĩ', 'Chánh niệm', 'Làm rõ giá trị'],
    indications: ['Lo âu và trầm cảm', 'Đau mãn tính', 'Stress liên quan đến công việc'],
    contraindications: ['Khủng hoảng cấp tính', 'Ý tưởng tự tử cao'],
    sessionStructure: ['Phát triển chấp nhận', 'Thực hành chánh niệm', 'Cam kết hành động dựa trên giá trị']
  },
  {
    id: '4',
    name: 'Khử mẫn cảm và tái xử lý qua chuyển động mắt (EMDR)',
    techniques: ['Chuyển động mắt hai bên', 'Thiết lập an toàn', 'Tái xử lý nhận thức'],
    indications: ['Rối loạn stress sau sang chấn (PTSD)', 'Sang chấn thời thơ ấu', 'Lo âu'],
    contraindications: ['Rối loạn tâm thần phân liệt', 'Rối loạn tâm thần nặng'],
    sessionStructure: ['Đánh giá lịch sử', 'Chuẩn bị', 'Khử mẫn cảm', 'Tái xử lý', 'Củng cố']
  }
]

const TherapistManagement: React.FC = () => {
  const { addNotification } = useNotifications()
  const [therapists, setTherapists] = useState<Therapist[]>(mockTherapists)
  const [activeTab, setActiveTab] = useState<'therapists' | 'methods'>('therapists')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')

  // Placeholder functions for future modal implementations
  const handleAddTherapist = () => {
    addNotification({
      type: 'info',
      title: 'Chức năng đang phát triển',
      message: 'Thêm nhà trị liệu sẽ được triển khai sớm'
    })
  }

  const handleAddMethod = () => {
    addNotification({
      type: 'info',
      title: 'Chức năng đang phát triển',
      message: 'Thêm phương pháp trị liệu sẽ được triển khai sớm'
    })
  }

  const filteredTherapists = therapists.filter(therapist => {
    const matchesSearch = therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         therapist.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || therapist.status === filterStatus
    return matchesSearch && matchesStatus
  })
  const handleDeleteTherapist = (therapistId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhà trị liệu này?')) {
      setTherapists(therapists.filter(d => d.id !== therapistId))
      addNotification({
        type: 'info',
        title: 'Thành công',
        message: 'Đã xóa nhà trị liệu thành công'
      })
    }
  }

  const handleStatusChange = (therapistId: string, newStatus: 'active' | 'inactive' | 'on-leave') => {
    setTherapists(therapists.map(d => 
      d.id === therapistId ? { ...d, status: newStatus } : d
    ))
    addNotification({
      type: 'info',
      title: 'Thành công',
      message: 'Đã cập nhật trạng thái nhà trị liệu'
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 fade-in">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">Quản lý nhà trị liệu</span>
              <span className="ml-2 text-sm bg-gradient-to-r from-red-600 to-blue-600 text-white px-2 py-1 rounded-full">
                YOU ARE HEARD
              </span>
            </h1>
            <p className="mt-2 text-gray-600">Quản lý thông tin nhà trị liệu và phương pháp trị liệu tâm lý</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={handleAddTherapist}
              className="btn btn-primary bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-4 rounded-lg transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm nhà trị liệu
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6 slide-up">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('therapists')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center transition-all duration-300 ${
                activeTab === 'therapists'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <User className={`w-4 h-4 mr-2 ${activeTab === 'therapists' ? 'text-blue-600' : 'text-gray-400'}`} />
              Danh sách nhà trị liệu
            </button>
            <button
              onClick={() => setActiveTab('methods')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center transition-all duration-300 ${
                activeTab === 'methods'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Brain className={`w-4 h-4 mr-2 ${activeTab === 'methods' ? 'text-blue-600' : 'text-gray-400'}`} />
              Phương pháp trị liệu
            </button>
          </nav>
        </div>

        {/* Therapists Tab */}
        {activeTab === 'therapists' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 slide-up">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm nhà trị liệu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
                <option value="on-leave">Nghỉ phép</option>
              </select>
              <button className="btn btn-secondary bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-all">
                <Filter className="w-4 h-4 mr-2" />
                Lọc
              </button>
              <button className="btn btn-secondary bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-all">
                <Download className="w-4 h-4 mr-2" />
                Xuất Excel
              </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 slide-up" style={{ animationDelay: '100ms' }}>
              <div className="card text-center bg-white shadow-md rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all">
                <h3 className="text-2xl font-bold text-blue-600">{therapists.length}</h3>
                <p className="text-gray-600">Tổng nhà trị liệu</p>
              </div>
              <div className="card text-center bg-white shadow-md rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all">
                <h3 className="text-2xl font-bold text-green-600">
                  {therapists.filter(d => d.status === 'active').length}
                </h3>
                <p className="text-gray-600">Đang hoạt động</p>
              </div>
              <div className="card text-center bg-white shadow-md rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all">
                <h3 className="text-2xl font-bold text-blue-600">
                  {therapists.reduce((sum, d) => sum + d.activeClients, 0)}
                </h3>
                <p className="text-gray-600">Khách hàng đang trị liệu</p>
              </div>
              <div className="card text-center bg-white shadow-md rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all">
                <h3 className="text-2xl font-bold text-red-600">
                  {(therapists.reduce((sum, d) => sum + d.rating, 0) / therapists.length).toFixed(1)}
                </h3>
                <p className="text-gray-600">Đánh giá trung bình</p>
              </div>
            </div>

            {/* Therapists List */}
            <div className="card bg-white shadow-md rounded-xl overflow-hidden border border-gray-100 slide-up" style={{ animationDelay: '200ms' }}>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nhà trị liệu
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Chuyên môn
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Khách hàng
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
                    {filteredTherapists.map((therapist, index) => (
                      <tr key={therapist.id} className="hover:bg-blue-50 transition-all slide-up" style={{ animationDelay: `${300 + index * 100}ms` }}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
                                <User className="h-6 w-6 text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{therapist.name}</div>
                              <div className="text-sm text-gray-500">{therapist.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{therapist.specialty}</div>
                          <div className="text-sm text-gray-500">{therapist.experience} năm kinh nghiệm</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            Đang trị liệu: {therapist.activeClients}
                          </div>
                          <div className="text-sm text-gray-500">
                            Tổng: {therapist.totalClients}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="text-sm text-gray-900">{therapist.rating}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={therapist.status}
                            onChange={(e) => handleStatusChange(therapist.id, e.target.value as any)}
                            className={`text-xs font-medium px-2 py-1 rounded-full border-0 ${getStatusColor(therapist.status)}`}
                          >
                            <option value="active">Hoạt động</option>
                            <option value="inactive">Không hoạt động</option>
                            <option value="on-leave">Nghỉ phép</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedTherapist(therapist)}
                              className="text-blue-600 hover:text-blue-900 transition-all"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-blue-600 hover:text-blue-900 transition-all">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteTherapist(therapist.id)}
                              className="text-red-600 hover:text-red-900 transition-all"
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

        {/* Therapy Methods Tab */}
        {activeTab === 'methods' && (
          <div className="space-y-6">            
            <div className="flex justify-between items-center fade-in">
              <h2 className="text-xl font-semibold text-gray-900">Phương pháp trị liệu tâm lý</h2>
              <button
                onClick={handleAddMethod}
                className="btn btn-primary bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-4 rounded-lg transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm phương pháp
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {therapyMethods.map((method, index) => (
                <div 
                  key={method.id} 
                  className="card bg-white shadow-md rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{method.name}</h3>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 transition-all">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800 transition-all">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Kỹ thuật chính:</h4>
                      <div className="flex flex-wrap gap-1">
                        {method.techniques.map((technique, index) => (
                          <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {technique}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Chỉ định:</h4>
                      <ul className="text-sm text-gray-600">
                        {method.indications.map((indication, index) => (
                          <li key={index}>• {indication}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Chống chỉ định:</h4>
                      <ul className="text-sm text-gray-600">
                        {method.contraindications.map((contraindication, index) => (
                          <li key={index}>• {contraindication}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Cấu trúc buổi trị liệu:</h4>
                      <ul className="text-sm text-gray-600">
                        {method.sessionStructure.map((structure, index) => (
                          <li key={index}>• {structure}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Therapist Detail Modal */}
        {selectedTherapist && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 fade-in">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-96 overflow-y-auto p-6 shadow-2xl slide-up">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Chi tiết nhà trị liệu</h2>
                <button
                  onClick={() => setSelectedTherapist(null)}
                  className="text-gray-400 hover:text-gray-600 transition-all"
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
                        <User className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-gray-900">{selectedTherapist.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-gray-900">{selectedTherapist.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-gray-900">{selectedTherapist.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-gray-900">{selectedTherapist.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Học vấn & Bằng cấp</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-gray-900">{selectedTherapist.education}</span>
                      </div>
                      <div className="mt-2">
                        {selectedTherapist.licenses.map((license, index) => (
                          <div key={index} className="flex items-center">
                            <Award className="w-4 h-4 text-blue-600 mr-2" />
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
                        <Calendar className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-gray-900">
                          Ngày làm việc: {selectedTherapist.availableDays.join(', ')}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-gray-900">
                          Giờ làm việc: {selectedTherapist.timeSlots.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Phương pháp trị liệu</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTherapist.therapyMethods.map((method, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center bg-gray-50 rounded-lg p-3">
                      <p className="text-2xl font-bold text-blue-600">{selectedTherapist.activeClients}</p>
                      <p className="text-sm text-gray-600">Khách hàng đang trị liệu</p>
                    </div>
                    <div className="text-center bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-center">
                        <p className="text-2xl font-bold text-red-600">{selectedTherapist.rating}</p>
                        <Star className="h-5 w-5 text-yellow-400 ml-1" />
                      </div>
                      <p className="text-sm text-gray-600">Đánh giá</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedTherapist(null)}
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

export default TherapistManagement
