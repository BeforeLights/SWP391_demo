import React, { useState } from 'react'
import { Search, Calendar, User, ArrowRight, Heart, Shield, Users } from 'lucide-react'

const BlogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'treatment', name: 'Điều trị' },
    { id: 'lifestyle', name: 'Lối sống' },
    { id: 'prevention', name: 'Phòng ngừa' },
    { id: 'nutrition', name: 'Dinh dưỡng' },
    { id: 'mental-health', name: 'Sức khỏe tâm thần' }
  ]

  const blogPosts = [
    {
      id: '1',
      title: 'Hiểu về thuốc ARV: Cách thức hoạt động và tác dụng phụ',
      excerpt: 'Tìm hiểu chi tiết về cơ chế hoạt động của thuốc kháng retrovirus (ARV) và cách quản lý tác dụng phụ hiệu quả.',
      category: 'treatment',
      author: 'BS. Nguyễn Thị Hương',
      date: '2024-11-20',
      readTime: '8 phút đọc',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: true
    },
    {
      id: '2',
      title: 'Chế độ dinh dưỡng hỗ trợ điều trị HIV hiệu quả',
      excerpt: 'Hướng dẫn xây dựng chế độ ăn uống khoa học để tăng cường hệ miễn dịch và hỗ trợ quá trình điều trị.',
      category: 'nutrition',
      author: 'ThS. Lê Văn Nam',
      date: '2024-11-18',
      readTime: '6 phút đọc',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false
    },
    {
      id: '3',
      title: 'Sức khỏe tâm thần và HIV: Tầm quan trọng của hỗ trợ tâm lý',
      excerpt: 'Khám phá mối quan hệ giữa sức khỏe tâm thần và HIV, cùng các phương pháp hỗ trợ tâm lý hiệu quả.',
      category: 'mental-health',
      author: 'ThS. Trần Thị Mai',
      date: '2024-11-15',
      readTime: '10 phút đọc',
      image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: true
    },
    {
      id: '4',
      title: 'Phòng ngừa lây truyền HIV: Những điều cần biết',
      excerpt: 'Thông tin cập nhật về các phương pháp phòng ngừa lây truyền HIV hiệu quả nhất hiện nay.',
      category: 'prevention',
      author: 'BS. Phạm Văn Đức',
      date: '2024-11-12',
      readTime: '7 phút đọc',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false
    },
    {
      id: '5',
      title: 'Tập thể dục và HIV: Lợi ích và lưu ý quan trọng',
      excerpt: 'Hướng dẫn cách tập thể dục an toàn và hiệu quả cho người nhiễm HIV.',
      category: 'lifestyle',
      author: 'HLV. Nguyễn Thành Long',
      date: '2024-11-10',
      readTime: '5 phút đọc',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false
    },
    {
      id: '6',
      title: 'U=U: Không phát hiện = Không lây truyền',
      excerpt: 'Tìm hiểu về khái niệm U=U và tầm quan trọng của việc duy trì viral load không phát hiện được.',
      category: 'treatment',
      author: 'GS.TS. Hoàng Thị Lan',
      date: '2024-11-08',
      readTime: '9 phút đọc',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: true
    }
  ]

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredPosts = filteredPosts.filter(post => post.featured)
  const regularPosts = filteredPosts.filter(post => !post.featured)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'treatment': return <Heart className="h-4 w-4" />
      case 'prevention': return <Shield className="h-4 w-4" />
      case 'mental-health': return <Users className="h-4 w-4" />
      default: return <Heart className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Blog Y Tế HIV
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Thông tin, kiến thức và hướng dẫn từ các chuyên gia y tế về HIV/AIDS, 
              điều trị và chăm sóc sức khỏe toàn diện.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-medical-500"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-medical-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Bài viết nổi bật</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <article key={post.id} className="card overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-medical-100 text-medical-800`}>
                        {getCategoryIcon(post.category)}
                        <span className="ml-1">
                          {categories.find(c => c.id === post.category)?.name}
                        </span>
                      </span>
                      <span className="text-xs text-gray-500">{post.readTime}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{post.author}</span>
                        <span className="text-gray-400">•</span>
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {new Date(post.date).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      
                      <button className="text-medical-600 hover:text-medical-700 font-medium text-sm flex items-center space-x-1">
                        <span>Đọc thêm</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Regular Posts */}
        {regularPosts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tất cả bài viết</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <article key={post.id} className="card overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-40 object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-medical-100 text-medical-800`}>
                        {getCategoryIcon(post.category)}
                        <span className="ml-1">
                          {categories.find(c => c.id === post.category)?.name}
                        </span>
                      </span>
                      <span className="text-xs text-gray-500">{post.readTime}</span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">{post.author}</span>
                      </div>
                      
                      <span className="text-xs text-gray-500">
                        {new Date(post.date).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    
                    <button className="w-full mt-4 text-medical-600 hover:text-medical-700 font-medium text-sm flex items-center justify-center space-x-1 py-2 border border-medical-600 rounded-md hover:bg-medical-50 transition-colors">
                      <span>Đọc bài viết</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Không tìm thấy bài viết nào phù hợp với từ khóa tìm kiếm.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogPage
