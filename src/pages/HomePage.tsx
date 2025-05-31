import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Calendar, 
  FileText, 
  Pill, 
  Shield, 
  Users, 
  Heart,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Đặt lịch hẹn trực tuyến',
      description: 'Dễ dàng đặt lịch khám với bác sĩ chuyên khoa HIV/AIDS',
      color: 'text-blue-600'
    },
    {
      icon: Pill,
      title: 'Quản lý thuốc ARV',
      description: 'Theo dõi lịch uống thuốc, nhắc nhở và quản lý phác đồ điều trị',
      color: 'text-green-600'
    },
    {
      icon: FileText,
      title: 'Báo cáo sức khỏe',
      description: 'Xem kết quả xét nghiệm CD4, viral load và lịch sử điều trị',
      color: 'text-purple-600'
    },
    {
      icon: Shield,
      title: 'Bảo mật thông tin',
      description: 'Thông tin y tế được mã hóa và bảo vệ tuyệt đối',
      color: 'text-red-600'
    },
    {
      icon: Users,
      title: 'Hỗ trợ đa chuyên khoa',
      description: 'Kết nối với đội ngũ bác sĩ và chuyên gia tư vấn',
      color: 'text-yellow-600'
    },
    {
      icon: Heart,
      title: 'Chăm sóc toàn diện',
      description: 'Theo dõi sức khỏe tổng thể và hỗ trợ tâm lý',
      color: 'text-pink-600'
    }
  ]

  const stats = [
    { label: 'Bệnh nhân được hỗ trợ', value: '10,000+' },
    { label: 'Bác sĩ chuyên khoa', value: '200+' },
    { label: 'Cơ sở y tế', value: '50+' },
    { label: 'Tỷ lệ hài lòng', value: '98%' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-medical-600 to-medical-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Tăng cường tiếp cận
                <span className="text-medical-200 block">dịch vụ y tế HIV</span>
              </h1>
              <p className="text-xl text-medical-100 mb-8 leading-relaxed">
                Nền tảng kỹ thuật số hỗ trợ bệnh nhân HIV quản lý sức khỏe, 
                theo dõi điều trị và kết nối với đội ngũ y tế chuyên nghiệp.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="bg-white text-medical-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center">
                  Đăng ký ngay
                </Link>
                <Link to="/blog" className="border border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-medical-600 transition-colors text-center">
                  Tìm hiểu thêm
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">Tính năng nổi bật</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                    <span>Nhắc nhở uống thuốc thông minh</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                    <span>Theo dõi CD4 và viral load</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                    <span>Đặt lịch hẹn trực tuyến</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                    <span>Tư vấn từ chuyên gia</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Tính năng toàn diện
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hệ thống được thiết kế để hỗ trợ bệnh nhân HIV trong việc quản lý sức khỏe 
              và duy trì chất lượng cuộc sống tốt nhất.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="card hover:shadow-xl transition-shadow">
                  <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-medical-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Được tin tướng bởi cộng đồng
            </h2>
            <p className="text-xl text-medical-100">
              Con số ấn tượng về tác động tích cực của hệ thống
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-medical-100">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Bắt đầu hành trình chăm sóc sức khỏe của bạn
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Tham gia cộng đồng và nhận được sự hỗ trợ toàn diện từ đội ngũ y tế chuyên nghiệp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/signup" 
              className="btn-primary inline-flex items-center justify-center"
            >
              Đăng ký tài khoản
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              to="/signin" 
              className="btn-secondary inline-flex items-center justify-center"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
