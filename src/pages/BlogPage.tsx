import React, { useState } from 'react'
import { Search, Calendar, User, ArrowRight, Brain, Heart, Users } from 'lucide-react'

const BlogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'therapy', name: 'Liệu pháp' },
    { id: 'wellbeing', name: 'Sức khỏe tinh thần' },
    { id: 'coping', name: 'Kỹ năng đối phó' },
    { id: 'lifestyle', name: 'Lối sống' },
    { id: 'support', name: 'Hỗ trợ cộng đồng' }
  ]

  const blogPosts = [
    {
      id: '1',
      title: 'Hiểu về Trầm cảm: Dấu hiệu, nguyên nhân và phương pháp điều trị',
      excerpt: 'Tìm hiểu chi tiết về các dấu hiệu của trầm cảm, nguyên nhân gây bệnh và các phương pháp điều trị hiệu quả.',
      category: 'therapy',
      author: 'ThS. Nguyễn Thị Hương',
      date: '2024-11-20',
      readTime: '8 phút đọc',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: true
    },
    {
      id: '2',
      title: 'Kỹ thuật thở để giảm căng thẳng và lo âu',
      excerpt: 'Hướng dẫn các kỹ thuật thở đơn giản nhưng hiệu quả để quản lý stress và cải thiện sức khỏe tinh thần.',
      category: 'coping',
      author: 'TS. Lê Văn Nam',
      date: '2024-11-18',
      readTime: '6 phút đọc',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false
    },
    {
      id: '3',
      title: 'Xây dựng thói quen tích cực cho sức khỏe tinh thần',
      excerpt: 'Khám phá cách xây dựng những thói quen hàng ngày giúp cải thiện tâm trạng và nâng cao chất lượng cuộc sống.',
      category: 'wellbeing',
      author: 'ThS. Trần Thị Mai',
      date: '2024-11-15',
      readTime: '10 phút đọc',
      image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: true
    },    {
      id: '4',
      title: 'Mindfulness: Thực hành chánh niệm để cải thiện sức khỏe tinh thần',
      excerpt: 'Hướng dẫn thực hành mindfulness cơ bản để giảm stress, cải thiện tập trung và nâng cao chất lượng cuộc sống.',
      category: 'coping',
      author: 'ThS. Phạm Văn Đức',
      date: '2024-11-12',
      readTime: '7 phút đọc',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false
    },
    {
      id: '5',
      title: 'Tập thể dục và sức khỏe tinh thần: Mối liên hệ khoa học',
      excerpt: 'Khám phá cách vận động ảnh hưởng tích cực đến tâm trạng và sức khỏe tinh thần qua các nghiên cứu khoa học.',
      category: 'lifestyle',
      author: 'ThS. Nguyễn Thành Long',
      date: '2024-11-10',
      readTime: '5 phút đọc',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false
    },
    {
      id: '6',
      title: 'Xây dựng mạng lưới hỗ trợ: Tầm quan trọng của cộng đồng',
      excerpt: 'Tìm hiểu về vai trò quan trọng của mạng lưới hỗ trợ xã hội trong quá trình phục hồi sức khỏe tinh thần.',
      category: 'support',
      author: 'TS. Hoàng Thị Lan',
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
      case 'therapy': return <Brain className="h-4 w-4" />
      case 'wellbeing': return <Heart className="h-4 w-4" />
      case 'support': return <Users className="h-4 w-4" />
      case 'coping': return <Brain className="h-4 w-4" />
      case 'lifestyle': return <Heart className="h-4 w-4" />
      default: return <Brain className="h-4 w-4" />
    }
  }

  return (    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-ocean-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-brand-600 to-ocean-600 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl font-bold text-white mb-4">
              Blog Sức Khỏe Tinh Thần
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Kiến thức chuyên sâu, hướng dẫn thực hành và câu chuyện truyền cảm hứng 
              từ các chuyên gia tâm lý và cộng đồng YOU ARE HEARD.
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-animated w-full pl-10 pr-4 py-3"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category.id
                      ? 'bg-brand-600 text-white shadow-lg'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-300 hover:border-brand-300'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (          <div className="mb-12 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Bài viết nổi bật</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-stagger">
              {featuredPosts.map((post, index) => (
                <article 
                  key={post.id} 
                  className="card card-hover overflow-hidden animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >                  <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  <div className="p-6">                    <div className="flex items-center space-x-2 mb-3">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-ocean-100 text-ocean-800`}>
                        {getCategoryIcon(post.category)}
                        <span className="ml-1">
                          {categories.find(c => c.id === post.category)?.name}
                        </span>
                      </span>
                      <span className="text-xs text-slate-500">{post.readTime}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-ocean-700 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-slate-600 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                      <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600">{post.author}</span>
                        <span className="text-slate-400">•</span>
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600">
                          {new Date(post.date).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      
                      <button className="text-ocean-600 hover:text-ocean-700 font-medium text-sm flex items-center space-x-1 group">
                        <span className="group-hover:underline">Đọc thêm</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}        {/* Regular Posts */}
        {regularPosts.length > 0 && (
          <div className="animate-fade-in" style={{animationDelay: '0.3s'}}>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Tất cả bài viết</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-stagger">
              {regularPosts.map((post, index) => (
                <article 
                  key={post.id} 
                  className="card card-hover overflow-hidden animate-slide-up" 
                  style={{animationDelay: `${0.3 + index * 0.1}s`}}
                >                  <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-40 object-cover transition-transform duration-700 hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-ocean-100 text-ocean-800`}>
                        {getCategoryIcon(post.category)}
                        <span className="ml-1">
                          {categories.find(c => c.id === post.category)?.name}
                        </span>
                      </span>
                      <span className="text-xs text-slate-500">{post.readTime}</span>
                    </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-ocean-700 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-slate-600 mb-4 line-clamp-3 text-sm">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3 text-slate-400" />
                        <span className="text-xs text-slate-600">{post.author}</span>
                      </div>
                      
                      <span className="text-xs text-slate-500">
                        {new Date(post.date).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    
                    <button className="btn-outline w-full mt-4 py-2 px-4 text-sm flex items-center justify-center space-x-1">
                      <span>Đọc bài viết</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}        {filteredPosts.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <p className="text-slate-500 text-lg">
              Không tìm thấy bài viết nào phù hợp với từ khóa tìm kiếm.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogPage
