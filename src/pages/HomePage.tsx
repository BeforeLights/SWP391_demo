import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Calendar, 
  FileText, 
  Pill, 
  Shield, 
  Users, 
  Brain,
  CheckCircle,
  ArrowRight,
  MessageCircle,
  HeartHandshake,
  Phone,
  Video
} from 'lucide-react'

const HomePage: React.FC = () => {
  const features = [
    {
      icon: MessageCircle,
      title: 'Tư vấn tâm lý trực tuyến',
      description: 'Kết nối với chuyên gia tâm lý qua chat, video call hoặc gọi điện',
      color: 'text-ocean-600',
      gradient: 'from-ocean-500 to-ocean-600'
    },
    {
      icon: Brain,
      title: 'Chăm sóc sức khỏe tinh thần',
      description: 'Theo dõi tâm trạng, stress và cung cấp các công cụ hỗ trợ tinh thần',
      color: 'text-brand-600',
      gradient: 'from-brand-500 to-brand-600'
    },
    {
      icon: Calendar,
      title: 'Đặt lịch hẹn linh hoạt',
      description: 'Dễ dàng đặt lịch với bác sĩ tâm lý và chuyên gia sức khỏe tinh thần',
      color: 'text-ocean-600',
      gradient: 'from-ocean-500 to-ocean-600'
    },
    {
      icon: Shield,
      title: 'Bảo mật tuyệt đối',
      description: 'Thông tin sức khỏe tinh thần được bảo vệ nghiêm ngặt và bảo mật',
      color: 'text-slate-600',
      gradient: 'from-slate-500 to-slate-600'
    },
    {
      icon: Users,
      title: 'Cộng đồng hỗ trợ',
      description: 'Tham gia các nhóm hỗ trợ và chia sẻ kinh nghiệm với cộng đồng',
      color: 'text-ocean-600',
      gradient: 'from-ocean-500 to-ocean-600'
    },
    {
      icon: HeartHandshake,
      title: 'Chăm sóc toàn diện',
      description: 'Hỗ trợ tâm lý toàn diện từ trầm cảm, lo âu đến phát triển bản thân',
      color: 'text-brand-600',
      gradient: 'from-brand-500 to-brand-600'
    }  ]

  const stats = [
    { label: 'Người được hỗ trợ tâm lý', value: '15,000+' },
    { label: 'Chuyên gia tâm lý', value: '300+' },
    { label: 'Phiên tư vấn thành công', value: '50,000+' },
    { label: 'Mức độ cải thiện', value: '95%' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-bg relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/90 via-ocean-600/90 to-slate-800/90"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-brand-500/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-ocean-500/20 rounded-full animate-bounce-gentle"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-brand-500/30 rounded-full animate-pulse-slow"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <div className="flex items-center space-x-3 mb-4">
                <Brain className="h-12 w-12 text-brand-500" />
                <MessageCircle className="h-8 w-8 text-ocean-500" />
                <div className="w-4 h-4 bg-brand-600 rounded-full animate-pulse"></div>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight text-white">
                <span className="gradient-text block">YOU ARE HEARD</span>
                <span className="text-white/90 block text-3xl lg:text-4xl mt-2">
                  Nơi tâm hồn được lắng nghe
                </span>
              </h1>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Nền tảng hỗ trợ sức khỏe tinh thần toàn diện. Kết nối với chuyên gia tâm lý, 
                tham gia cộng đồng hỗ trợ và tìm lại sự cân bằng trong cuộc sống.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="btn-primary text-center animate-bounce-gentle">
                  Bắt đầu hành trình
                </Link>
                <Link to="/blog" className="btn-outline text-center">
                  Tìm hiểu thêm
                </Link>
              </div>
            </div>
            <div className="relative animate-slide-in-right">
              <div className="card-glow bg-white/10 backdrop-blur-lg p-8">
                <h3 className="text-2xl font-bold mb-6 text-white flex items-center">
                  <HeartHandshake className="h-6 w-6 mr-2 text-brand-500" />
                  Dịch vụ của chúng tôi
                </h3>
                <div className="space-y-4">                  <div className="flex items-center space-x-3 stagger-item">
                    <CheckCircle className="h-6 w-6 text-ocean-400" />
                    <span className="text-white/90">Tư vấn tâm lý 1-1 với chuyên gia</span>
                  </div>
                  <div className="flex items-center space-x-3 stagger-item">
                    <CheckCircle className="h-6 w-6 text-brand-400" />
                    <span className="text-white/90">Nhóm hỗ trợ cộng đồng</span>
                  </div>
                  <div className="flex items-center space-x-3 stagger-item">
                    <CheckCircle className="h-6 w-6 text-ocean-400" />
                    <span className="text-white/90">Đánh giá tâm lý định kỳ</span>
                  </div>
                  <div className="flex items-center space-x-3 stagger-item">
                    <CheckCircle className="h-6 w-6 text-brand-400" />
                    <span className="text-white/90">Công cụ quản lý cảm xúc</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              <span className="gradient-text">Dịch vụ hỗ trợ tâm lý</span> toàn diện
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Chúng tôi cung cấp những dịch vụ chăm sóc sức khỏe tinh thần chuyên nghiệp, 
              giúp bạn vượt qua khó khăn và tìm lại sự cân bằng trong cuộc sống.
            </p>
          </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="card-glow stagger-item hover:-translate-y-2 transition-all duration-500">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-4 flex items-center text-ocean-600 font-medium">
                    <span>Tìm hiểu thêm</span>
                    <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-brand-600 via-brand-700 to-ocean-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Được tin tưởng bởi cộng đồng
            </h2>
            <p className="text-xl text-white/80">
              Những con số ấn tượng về tác động tích cực trong lĩnh vực sức khỏe tinh thần
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="text-4xl lg:text-5xl font-bold mb-2 gradient-text bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-white/70 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <Brain className="h-12 w-12 text-brand-600 mr-3" />
              <MessageCircle className="h-8 w-8 text-ocean-600" />
              <div className="w-4 h-4 bg-brand-600 rounded-full animate-pulse ml-2"></div>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              Bắt đầu hành trình <span className="gradient-text">chăm sóc tâm lý</span> của bạn
            </h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Tham gia cộng đồng "YOU ARE HEARD" và nhận được sự hỗ trợ chuyên nghiệp 
              từ đội ngũ chuyên gia tâm lý hàng đầu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/signup" 
                className="btn-primary inline-flex items-center justify-center group"
              >
                Tham gia ngay hôm nay
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link 
                to="/signin" 
                className="btn-secondary inline-flex items-center justify-center"
              >
                Đăng nhập
              </Link>
            </div>
            <div className="mt-8 text-sm text-slate-500">
              🔒 Thông tin của bạn được bảo mật tuyệt đối
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
