import React from 'react'
import { Link } from 'react-router-dom'
import { Brain, Phone, Mail, MapPin, Facebook, Twitter, Instagram, HeartPulse, MessageCircle } from 'lucide-react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white overflow-hidden">
      <div className="absolute w-full h-full opacity-5">
        <div className="absolute top-0 left-0 w-48 h-48 bg-brand-600 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-ocean-600 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and description */}
          <div className="col-span-1 md:col-span-2 animate-fade-in">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center space-x-2 animate-float">
                <Brain className="h-8 w-8 text-ocean-500" />
                <HeartPulse className="h-8 w-8 text-brand-500" />
                <MessageCircle className="h-7 w-7 text-ocean-400" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-brand-500 to-ocean-500 bg-clip-text text-transparent">YOU ARE HEARD</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Chúng tôi cung cấp nền tảng hỗ trợ sức khỏe tâm thần, kết nối bạn với các chuyên gia tư vấn tâm lý
              và cộng đồng những người hiểu và lắng nghe bạn.
            </p>
            <div className="flex space-x-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <a href="#" className="text-gray-300 hover:text-brand-500 transition-colors transform hover:scale-110">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-brand-500 transition-colors transform hover:scale-110">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-brand-500 transition-colors transform hover:scale-110">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-brand-400 to-ocean-400 bg-clip-text text-transparent">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 inline-block">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 inline-block">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/appointments" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 inline-block">
                  Đặt lịch tư vấn
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 inline-block">
                  Bảng điều khiển
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 inline-block">
                  Tài nguyên hỗ trợ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-brand-400 to-ocean-400 bg-clip-text text-transparent">Liên hệ</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 group">
                <Phone className="h-4 w-4 text-brand-500 group-hover:text-white transition-colors" />
                <span className="text-gray-300 group-hover:text-white transition-colors">1900 1234</span>
              </div>
              <div className="flex items-center space-x-2 group">
                <Mail className="h-4 w-4 text-ocean-500 group-hover:text-white transition-colors" />
                <span className="text-gray-300 group-hover:text-white transition-colors">support@youareheard.vn</span>
              </div>
              <div className="flex items-center space-x-2 group">
                <MapPin className="h-4 w-4 text-brand-500 group-hover:text-white transition-colors" />
                <span className="text-gray-300 group-hover:text-white transition-colors">Hà Nội, Việt Nam</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 mt-8 pt-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2024 YOU ARE HEARD. Bảo lưu mọi quyền.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors relative group">
                Điều khoản sử dụng
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-500 to-ocean-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors relative group">
                Chính sách bảo mật
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-500 to-ocean-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors relative group">
                Hỗ trợ
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-500 to-ocean-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>
          </div>
        </div>
      </div>    </footer>
  )
}

export default Footer
