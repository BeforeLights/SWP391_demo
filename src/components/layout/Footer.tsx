import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Phone, Mail, MapPin, Facebook, Twitter, Youtube } from 'lucide-react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-medical-500" />
              <span className="text-xl font-bold">HIV Care Connect</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Phần mềm tăng cường tiếp cận dịch vụ y tế và điều trị HIV, hỗ trợ bệnh nhân 
              quản lý sức khỏe và kết nối với đội ngũ y tế chuyên nghiệp.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-medical-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-medical-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-medical-500 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/appointments" className="text-gray-300 hover:text-white transition-colors">
                  Đặt lịch hẹn
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                  Bảng điều khiển
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-medical-500" />
                <span className="text-gray-300">1900 1234</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-medical-500" />
                <span className="text-gray-300">support@hivcareconnect.vn</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-medical-500" />
                <span className="text-gray-300">Hà Nội, Việt Nam</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2024 HIV Care Connect. Bảo lưu mọi quyền.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                Điều khoản sử dụng
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                Chính sách bảo mật
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                Hỗ trợ
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
