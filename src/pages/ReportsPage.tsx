import React, { useState, useRef, useEffect } from 'react'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'
import { 
  Download, Calendar, TrendingUp, TrendingDown, 
  Activity, FileText, Brain, HeartPulse, Sparkles,
  SmilePlus, Frown, Sun, MoonStar, CloudRain
} from 'lucide-react'

// Mock data for charts
const anxietyData = [
  { month: 'T1', anxiety: 75, target: 40 },
  { month: 'T2', anxiety: 68, target: 40 },
  { month: 'T3', anxiety: 62, target: 40 },
  { month: 'T4', anxiety: 55, target: 40 },
  { month: 'T5', anxiety: 48, target: 40 },
  { month: 'T6', anxiety: 42, target: 40 },
  { month: 'T7', anxiety: 38, target: 40 },
  { month: 'T8', anxiety: 35, target: 40 },
]

const depressionData = [
  { month: 'T1', depression: 65, threshold: 40 },
  { month: 'T2', depression: 60, threshold: 40 },
  { month: 'T3', depression: 58, threshold: 40 },
  { month: 'T4', depression: 52, threshold: 40 },
  { month: 'T5', depression: 47, threshold: 40 },
  { month: 'T6', depression: 45, threshold: 40 },
  { month: 'T7', depression: 40, threshold: 40 },
  { month: 'T8', depression: 38, threshold: 40 },
]

const activityCompletionData = [
  { month: 'T1', completion: 85 },
  { month: 'T2', completion: 88 },
  { month: 'T3', completion: 92 },
  { month: 'T4', completion: 95 },
  { month: 'T5', completion: 97 },
  { month: 'T6', completion: 98 },
  { month: 'T7', completion: 96 },
  { month: 'T8', completion: 99 },
]

const moodData = [
  { month: 'T1', mood: 4 },
  { month: 'T2', mood: 4.5 },
  { month: 'T3', mood: 5 },
  { month: 'T4', mood: 5.5 },
  { month: 'T5', mood: 6 },
  { month: 'T6', mood: 6.8 },
  { month: 'T7', mood: 7.2 },
  { month: 'T8', mood: 7.5 },
]

const appointmentData = [
  { type: 'Tư vấn cá nhân', count: 8, color: '#0284c7' },
  { type: 'Trị liệu nhóm', count: 6, color: '#10b981' },
  { type: 'Đánh giá định kỳ', count: 4, color: '#f59e0b' },
  { type: 'Hỗ trợ khẩn cấp', count: 2, color: '#dc2626' },
]

const COLORS = ['#0284c7', '#10b981', '#f59e0b', '#dc2626']

const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6months')
  const [activeTab, setActiveTab] = useState('overview')
  const reportRef = useRef<HTMLDivElement>(null)
  const [animationVisible, setAnimationVisible] = useState(false)

  useEffect(() => {
    setAnimationVisible(true)
  }, [])

  const handleExportPDF = () => {
    // PDF export functionality would be implemented here
    alert('Tính năng xuất PDF sẽ được triển khai')
  }

  const StatCard = ({ 
    title, 
    value, 
    change, 
    changeType, 
    icon: Icon,
    animationDelay = 0
  }: { 
    title: string
    value: string
    change: string
    changeType: 'positive' | 'negative' | 'neutral'
    icon: any,
    animationDelay?: number
  }) => (
    <div className={`card fade-in slide-up`} style={{ animationDelay: `${animationDelay}ms` }}>
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
        <div className="p-3 bg-gradient-to-br from-[#0284c7] to-[#0ea5e9] rounded-lg">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  const getMoodEmoji = (mood: number) => {
    if (mood >= 7) return <SmilePlus className="w-8 h-8 text-green-500" />;
    if (mood >= 5) return <Sun className="w-8 h-8 text-yellow-500" />;
    if (mood >= 4) return <MoonStar className="w-8 h-8 text-blue-500" />;
    return <CloudRain className="w-8 h-8 text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="fade-in slide-up">
            <h1 className="text-3xl font-bold text-gray-900">Báo cáo sức khỏe tinh thần</h1>
            <p className="mt-2 text-gray-600">Theo dõi tiến trình phục hồi và trạng thái cảm xúc</p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3 fade-in slide-up" style={{ animationDelay: '200ms' }}>
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0284c7] focus:border-transparent"
            >
              <option value="3months">3 tháng</option>
              <option value="6months">6 tháng</option>
              <option value="1year">1 năm</option>
              <option value="2years">2 năm</option>
            </select>
            <button 
              onClick={handleExportPDF}
              className="btn btn-primary inline-flex items-center bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] hover:from-[#0369a1] hover:to-[#0284c7] text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Xuất PDF
            </button>
          </div>
        </div>

        {/* Tabs */}        <div className="border-b border-gray-200 mb-8 fade-in" style={{ animationDelay: '300ms' }}>
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Tổng quan', icon: Activity },
              { id: 'anxiety', name: 'Mức độ lo âu', icon: Brain },
              { id: 'depression', name: 'Mức độ trầm cảm', icon: HeartPulse },
              { id: 'activities', name: 'Hoạt động', icon: Sparkles },
              { id: 'appointments', name: 'Lịch hẹn', icon: Calendar },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'border-[#0284c7] text-[#0284c7]'
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
                  title="Mức độ lo âu hiện tại"
                  value="35/100"
                  change="-8% so với tháng trước"
                  changeType="positive"
                  icon={Brain}
                  animationDelay={100}
                />
                <StatCard
                  title="Mức độ trầm cảm"
                  value="38/100"
                  change="-5% so với tháng trước"
                  changeType="positive"
                  icon={HeartPulse}
                  animationDelay={200}
                />
                <StatCard
                  title="Hoàn thành hoạt động"
                  value="99%"
                  change="+3% so với tháng trước"
                  changeType="positive"
                  icon={Sparkles}
                  animationDelay={300}
                />
                <StatCard
                  title="Lần trị liệu gần nhất"
                  value="15/11/2024"
                  change="Kết quả tốt"
                  changeType="positive"
                  icon={Calendar}
                  animationDelay={400}
                />
              </div>

              {/* Combined Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card fade-in" style={{ animationDelay: '500ms' }}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Cảm xúc theo thời gian</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={moodData}>
                      <defs>
                        <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#0284c7" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="mood" stroke="#0284c7" fillOpacity={1} fill="url(#moodGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="card fade-in" style={{ animationDelay: '600ms' }}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoàn thành hoạt động</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={activityCompletionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="completion" fill="#0284c7" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Anxiety Tab */}
          {activeTab === 'anxiety' && (
            <div className="space-y-6">
              <div className="card fade-in">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Biểu đồ mức độ lo âu</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={anxietyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="anxiety" stroke="#dc2626" strokeWidth={3} />
                    <Line type="monotone" dataKey="target" stroke="#0284c7" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card text-center fade-in">
                  <h4 className="font-semibold text-gray-900">Mức độ lo âu hiện tại</h4>
                  <p className="text-3xl font-bold text-green-600 mt-2">35</p>
                  <p className="text-sm text-gray-600 mt-1">thấp (0-100)</p>
                </div>
                <div className="card text-center fade-in" style={{ animationDelay: '100ms' }}>
                  <h4 className="font-semibold text-gray-900">Mục tiêu</h4>
                  <p className="text-3xl font-bold text-[#0284c7] mt-2">40 hoặc thấp hơn</p>
                  <p className="text-sm text-gray-600 mt-1">Mức độ quản lý tốt</p>
                </div>
                <div className="card text-center fade-in" style={{ animationDelay: '200ms' }}>
                  <h4 className="font-semibold text-gray-900">Xu hướng</h4>
                  <div className="flex items-center justify-center mt-2">
                    <TrendingDown className="w-8 h-8 text-green-500" />
                  </div>
                  <p className="text-sm text-green-600 mt-1">Giảm đều</p>
                </div>
              </div>
            </div>
          )}

          {/* Depression Tab */}
          {activeTab === 'depression' && (
            <div className="space-y-6">
              <div className="card fade-in">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Biểu đồ mức độ trầm cảm</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={depressionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="depression" stroke="#dc2626" strokeWidth={3} />
                    <Line type="monotone" dataKey="threshold" stroke="#0284c7" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card text-center fade-in">
                  <h4 className="font-semibold text-gray-900">Mức độ trầm cảm hiện tại</h4>
                  <p className="text-3xl font-bold text-green-600 mt-2">38</p>
                  <p className="text-sm text-gray-600 mt-1">thấp (0-100)</p>
                </div>
                <div className="card text-center fade-in" style={{ animationDelay: '100ms' }}>
                  <h4 className="font-semibold text-gray-900">Mục tiêu</h4>
                  <p className="text-3xl font-bold text-[#0284c7] mt-2">40 hoặc thấp hơn</p>
                  <p className="text-sm text-gray-600 mt-1">Mức độ quản lý tốt</p>
                </div>
                <div className="card text-center fade-in" style={{ animationDelay: '200ms' }}>
                  <h4 className="font-semibold text-gray-900">Xu hướng</h4>
                  <div className="flex items-center justify-center mt-2">
                    <TrendingDown className="w-8 h-8 text-green-500" />
                  </div>
                  <p className="text-sm text-green-600 mt-1">Giảm đều</p>
                </div>
              </div>
            </div>
          )}

          {/* Activities Tab */}
          {activeTab === 'activities' && (
            <div className="space-y-6">
              <div className="card fade-in">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoàn thành hoạt động theo thời gian</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={activityCompletionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="completion" fill="#0284c7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card text-center fade-in">
                  <h4 className="font-semibold text-gray-900">Tỉ lệ hoàn thành trung bình</h4>
                  <p className="text-3xl font-bold text-green-600 mt-2">94%</p>
                </div>
                <div className="card text-center fade-in" style={{ animationDelay: '100ms' }}>
                  <h4 className="font-semibold text-gray-900">Tháng này</h4>
                  <p className="text-3xl font-bold text-[#0284c7] mt-2">99%</p>
                </div>
                <div className="card text-center fade-in" style={{ animationDelay: '200ms' }}>
                  <h4 className="font-semibold text-gray-900">Hoạt động bỏ lỡ</h4>
                  <p className="text-3xl font-bold text-orange-600 mt-2">2</p>
                </div>
                <div className="card text-center fade-in" style={{ animationDelay: '300ms' }}>
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
                <div className="card fade-in">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố loại cuộc hẹn</h3>
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

                <div className="card fade-in" style={{ animationDelay: '100ms' }}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Lịch hẹn sắp tới</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg transition-transform hover:scale-102 hover:shadow-md">
                      <div>
                        <p className="font-medium text-gray-900">Tư vấn cá nhân</p>
                        <p className="text-sm text-gray-600">Ths. Nguyễn Văn A</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-[#0284c7]">20/12/2024</p>
                        <p className="text-sm text-gray-600">09:00</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg transition-transform hover:scale-102 hover:shadow-md">
                      <div>
                        <p className="font-medium text-gray-900">Trị liệu nhóm</p>
                        <p className="text-sm text-gray-600">Phòng sinh hoạt</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">25/12/2024</p>
                        <p className="text-sm text-gray-600">15:30</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg transition-transform hover:scale-102 hover:shadow-md">
                      <div>
                        <p className="font-medium text-gray-900">Đánh giá tâm lý</p>
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

              <div className="card fade-in" style={{ animationDelay: '200ms' }}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê lịch hẹn</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#0284c7]">20</p>
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
                    <p className="text-2xl font-bold text-[#dc2626]">1</p>
                    <p className="text-sm text-gray-600">Bỏ lỡ</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div className="mt-8 card fade-in" style={{ animationDelay: '300ms' }}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Ghi chú từ chuyên gia tâm lý
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:shadow-md transition-all duration-300">
              <p className="text-sm font-medium text-gray-900">15/11/2024 - Ths. Nguyễn Văn A</p>
              <p className="text-sm text-gray-700 mt-1">
                Khách hàng đã có tiến bộ đáng kể trong việc quản lý lo âu. Các bài tập thở và thiền đang 
                phát huy hiệu quả. Tiếp tục áp dụng phương pháp trị liệu nhận thức hành vi (CBT).
              </p>
            </div>
            <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:shadow-md transition-all duration-300">
              <p className="text-sm font-medium text-gray-900">15/08/2024 - Ths. Trần Thị B</p>
              <p className="text-sm text-gray-700 mt-1">
                Mức độ trầm cảm đã giảm. Khách hàng tích cực tham gia các hoạt động xã hội và 
                thực hành các kỹ thuật đối phó. Khuyến khích duy trì lịch sinh hoạt đều đặn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportsPage
