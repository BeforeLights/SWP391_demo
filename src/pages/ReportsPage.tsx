import React, { useState, useRef } from 'react'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell 
} from 'recharts'
import { 
  Download, Calendar, TrendingUp, TrendingDown, 
  Activity, FileText, Heart, Pill
} from 'lucide-react'

// Mock data for charts
const cd4Data = [
  { month: 'T1', cd4: 350, target: 500 },
  { month: 'T2', cd4: 380, target: 500 },
  { month: 'T3', cd4: 420, target: 500 },
  { month: 'T4', cd4: 465, target: 500 },
  { month: 'T5', cd4: 510, target: 500 },
  { month: 'T6', cd4: 545, target: 500 },
  { month: 'T7', cd4: 580, target: 500 },
  { month: 'T8', cd4: 595, target: 500 },
]

const viralLoadData = [
  { month: 'T1', viralLoad: 45000, detectable: 50 },
  { month: 'T2', viralLoad: 25000, detectable: 50 },
  { month: 'T3', viralLoad: 8500, detectable: 50 },
  { month: 'T4', viralLoad: 1200, detectable: 50 },
  { month: 'T5', viralLoad: 150, detectable: 50 },
  { month: 'T6', viralLoad: 25, detectable: 50 },
  { month: 'T7', viralLoad: 0, detectable: 50 },
  { month: 'T8', viralLoad: 0, detectable: 50 },
]

const medicationAdherence = [
  { month: 'T1', adherence: 85 },
  { month: 'T2', adherence: 88 },
  { month: 'T3', adherence: 92 },
  { month: 'T4', adherence: 95 },
  { month: 'T5', adherence: 97 },
  { month: 'T6', adherence: 98 },
  { month: 'T7', adherence: 96 },
  { month: 'T8', adherence: 99 },
]

const appointmentData = [
  { type: 'Khám định kỳ', count: 8, color: '#0ea5e9' },
  { type: 'Xét nghiệm', count: 6, color: '#10b981' },
  { type: 'Tư vấn', count: 4, color: '#f59e0b' },
  { type: 'Khẩn cấp', count: 2, color: '#ef4444' },
]

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444']

const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6months')
  const [activeTab, setActiveTab] = useState('overview')
  const reportRef = useRef<HTMLDivElement>(null)

  const handleExportPDF = () => {
    // PDF export functionality would be implemented here
    alert('Tính năng xuất PDF sẽ được triển khai')
  }

  const StatCard = ({ 
    title, 
    value, 
    change, 
    changeType, 
    icon: Icon 
  }: { 
    title: string
    value: string
    change: string
    changeType: 'positive' | 'negative' | 'neutral'
    icon: any 
  }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <div className="flex items-center mt-1">
            {changeType === 'positive' && <TrendingUp className="w-4 h-4 text-green-500 mr-1" />}
            {changeType === 'negative' && <TrendingDown className="w-4 h-4 text-red-500 mr-1" />}
            <span className={`text-sm ${
              changeType === 'positive' ? 'text-green-600' : 
              changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {change}
            </span>
          </div>
        </div>
        <div className="p-3 bg-medical-50 rounded-lg">
          <Icon className="w-6 h-6 text-medical-600" />
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Báo cáo sức khỏe</h1>
            <p className="mt-2 text-gray-600">Theo dõi tiến trình điều trị và sức khỏe tổng thể</p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent"
            >
              <option value="3months">3 tháng</option>
              <option value="6months">6 tháng</option>
              <option value="1year">1 năm</option>
              <option value="2years">2 năm</option>
            </select>
            <button 
              onClick={handleExportPDF}
              className="btn btn-primary inline-flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Xuất PDF
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Tổng quan', icon: Activity },
              { id: 'cd4', name: 'CD4 Count', icon: TrendingUp },
              { id: 'viral', name: 'Viral Load', icon: Heart },
              { id: 'medication', name: 'Tuân thủ thuốc', icon: Pill },
              { id: 'appointments', name: 'Lịch hẹn', icon: Calendar },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-medical-500 text-medical-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div ref={reportRef}>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="CD4 Count hiện tại"
                  value="595"
                  change="+2.8% so với tháng trước"
                  changeType="positive"
                  icon={TrendingUp}
                />
                <StatCard
                  title="Viral Load"
                  value="Không phát hiện"
                  change="Ổn định 4 tháng"
                  changeType="positive"
                  icon={Heart}
                />
                <StatCard
                  title="Tuân thủ điều trị"
                  value="99%"
                  change="+3% so với tháng trước"
                  changeType="positive"
                  icon={Pill}
                />
                <StatCard
                  title="Lần khám gần nhất"
                  value="15/11/2024"
                  change="Kết quả tốt"
                  changeType="positive"
                  icon={Calendar}
                />
              </div>

              {/* Combined Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">CD4 Count theo thời gian</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={cd4Data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="cd4" stroke="#0ea5e9" strokeWidth={2} />
                      <Line type="monotone" dataKey="target" stroke="#ef4444" strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tuân thủ điều trị</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={medicationAdherence}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="adherence" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* CD4 Tab */}
          {activeTab === 'cd4' && (
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Biểu đồ CD4 Count</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={cd4Data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="cd4" stroke="#0ea5e9" strokeWidth={3} />
                    <Line type="monotone" dataKey="target" stroke="#ef4444" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card text-center">
                  <h4 className="font-semibold text-gray-900">CD4 hiện tại</h4>
                  <p className="text-3xl font-bold text-medical-600 mt-2">595</p>
                  <p className="text-sm text-gray-600 mt-1">cells/µL</p>
                </div>
                <div className="card text-center">
                  <h4 className="font-semibold text-gray-900">Mục tiêu</h4>
                  <p className="text-3xl font-bold text-green-600 mt-2">500+</p>
                  <p className="text-sm text-gray-600 mt-1">cells/µL</p>
                </div>
                <div className="card text-center">
                  <h4 className="font-semibold text-gray-900">Xu hướng</h4>
                  <div className="flex items-center justify-center mt-2">
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  </div>
                  <p className="text-sm text-green-600 mt-1">Tăng đều</p>
                </div>
              </div>
            </div>
          )}

          {/* Viral Load Tab */}
          {activeTab === 'viral' && (
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Biểu đồ Viral Load</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={viralLoadData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis scale="log" domain={[1, 100000]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="viralLoad" stroke="#ef4444" strokeWidth={3} />
                    <Line type="monotone" dataKey="detectable" stroke="#f59e0b" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card text-center">
                  <h4 className="font-semibold text-gray-900">Viral Load hiện tại</h4>
                  <p className="text-3xl font-bold text-green-600 mt-2">Không phát hiện</p>
                  <p className="text-sm text-gray-600 mt-1">&lt;50 copies/mL</p>
                </div>
                <div className="card text-center">
                  <h4 className="font-semibold text-gray-900">Thời gian đạt được</h4>
                  <p className="text-3xl font-bold text-medical-600 mt-2">4</p>
                  <p className="text-sm text-gray-600 mt-1">tháng liên tiếp</p>
                </div>
                <div className="card text-center">
                  <h4 className="font-semibold text-gray-900">Trạng thái</h4>
                  <div className="flex items-center justify-center mt-2">
                    <Heart className="w-8 h-8 text-green-500" />
                  </div>
                  <p className="text-sm text-green-600 mt-1">Kiểm soát tốt</p>
                </div>
              </div>
            </div>
          )}

          {/* Medication Tab */}
          {activeTab === 'medication' && (
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tuân thủ điều trị theo thời gian</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={medicationAdherence}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="adherence" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card text-center">
                  <h4 className="font-semibold text-gray-900">Tuân thủ trung bình</h4>
                  <p className="text-3xl font-bold text-green-600 mt-2">94%</p>
                </div>
                <div className="card text-center">
                  <h4 className="font-semibold text-gray-900">Tháng này</h4>
                  <p className="text-3xl font-bold text-medical-600 mt-2">99%</p>
                </div>
                <div className="card text-center">
                  <h4 className="font-semibold text-gray-900">Liều bỏ lỡ</h4>
                  <p className="text-3xl font-bold text-orange-600 mt-2">2</p>
                </div>
                <div className="card text-center">
                  <h4 className="font-semibold text-gray-900">Xu hướng</h4>
                  <div className="flex items-center justify-center mt-2">
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố loại lịch hẹn</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={appointmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >                        {appointmentData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Lịch hẹn sắp tới</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Khám định kỳ</p>
                        <p className="text-sm text-gray-600">BS. Nguyễn Văn A</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-medical-600">20/12/2024</p>
                        <p className="text-sm text-gray-600">09:00</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Xét nghiệm máu</p>
                        <p className="text-sm text-gray-600">Phòng Lab</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">25/12/2024</p>
                        <p className="text-sm text-gray-600">07:30</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Tư vấn dinh dưỡng</p>
                        <p className="text-sm text-gray-600">Phòng tư vấn</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-yellow-600">30/12/2024</p>
                        <p className="text-sm text-gray-600">14:00</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê lịch hẹn</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-medical-600">20</p>
                    <p className="text-sm text-gray-600">Tổng lịch hẹn</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">18</p>
                    <p className="text-sm text-gray-600">Đã hoàn thành</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">1</p>
                    <p className="text-sm text-gray-600">Đã hủy</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">1</p>
                    <p className="text-sm text-gray-600">Bỏ lỡ</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div className="mt-8 card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Ghi chú từ bác sĩ
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">15/11/2024 - BS. Nguyễn Văn A</p>
              <p className="text-sm text-gray-700 mt-1">
                Bệnh nhân tuân thủ điều trị tốt. CD4 count tăng ổn định. Tiếp tục phác đồ hiện tại.
                Tái khám sau 3 tháng.
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">15/08/2024 - BS. Trần Thị B</p>
              <p className="text-sm text-gray-700 mt-1">
                Viral load không phát hiện. Kết quả xét nghiệm gan, thận bình thường. 
                Khuyến khích duy trì lối sống lành mạnh.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportsPage
