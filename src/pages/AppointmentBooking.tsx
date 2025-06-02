import React, { useState } from 'react'
import { Calendar, Clock, User, MapPin, Phone, CheckCircle, AlertCircle, Plus, Brain, MessageCircle } from 'lucide-react'
// import { useAuth } from '../contexts/AuthContext'  // Will be used for patient info later
import { useNotifications } from '../contexts/NotificationContext'
import { format, addDays, isSameDay, isBefore, startOfDay } from 'date-fns'
import { vi } from 'date-fns/locale'

interface Doctor {
  id: string
  name: string
  specialty: string
  experience: string
  image: string
  rating: number
  availableDays: string[]
  timeSlots: string[]
  location: string
  phone: string
  email: string
}

interface TimeSlot {
  time: string
  available: boolean
  doctorId?: string
}

const doctors: Doctor[] = [
  {
    id: '1',
    name: 'ThS. Nguyễn Văn Minh',
    specialty: 'Tâm lý trị liệu',
    experience: '15 năm kinh nghiệm',
    image: '/api/placeholder/100/100',
    rating: 4.9,
    availableDays: ['Thứ 2', 'Thứ 4', 'Thứ 6'],
    timeSlots: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
    location: 'Phòng tư vấn 201',
    phone: '0123-456-789',
    email: 'ths.minh@youareheard.vn'
  },
  {
    id: '2',
    name: 'TS. Trần Thị Lan',
    specialty: 'Tâm lý học lâm sàng',
    experience: '12 năm kinh nghiệm',
    image: '/api/placeholder/100/100',
    rating: 4.8,
    availableDays: ['Thứ 3', 'Thứ 5', 'Thứ 7'],
    timeSlots: ['08:30', '09:30', '10:30', '13:30', '14:30', '15:30'],
    location: 'Phòng tư vấn 203',    phone: '0123-456-790',
    email: 'ts.lan@youareheard.vn'
  },
  {
    id: '3',
    name: 'ThS. Lê Hoàng Nam',
    specialty: 'Tâm lý học trẻ em',
    experience: '18 năm kinh nghiệm',
    image: '/api/placeholder/100/100',
    rating: 4.7,
    availableDays: ['Thứ 2', 'Thứ 3', 'Thứ 5'],
    timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00'],
    location: 'Phòng tư vấn 205',
    phone: '0123-456-791',
    email: 'ths.nam@youareheard.vn'
  }
]

const appointmentTypes = [
  { id: 'individual', name: 'Tư vấn cá nhân', duration: '45 phút', color: 'bg-ocean-100 text-ocean-800' },
  { id: 'assessment', name: 'Đánh giá tâm lý', duration: '60 phút', color: 'bg-brand-100 text-brand-800' },
  { id: 'followup', name: 'Tái khám', duration: '30 phút', color: 'bg-green-100 text-green-800' },
  { id: 'emergency', name: 'Khẩn cấp', duration: '60 phút', color: 'bg-red-100 text-red-800' }
]

const AppointmentBooking: React.FC = () => {
  // const { user } = useAuth()  // Will be used for patient info later
  const { addNotification } = useNotifications()
  
  const [step, setStep] = useState(1)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string>('')
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Generate next 30 days for calendar
  const generateCalendarDays = () => {
    const days = []
    const today = startOfDay(new Date())
    for (let i = 0; i < 30; i++) {
      days.push(addDays(today, i))
    }
    return days
  }

  const calendarDays = generateCalendarDays()

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setSelectedDate(null)
    setSelectedTime(null)
    setStep(2)
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setSelectedTime(null)
    setStep(3)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setStep(4)
  }
  const handleSubmit = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !selectedType) {
      addNotification({
        type: 'info',
        title: 'Thông tin thiếu',
        message: 'Vui lòng điền đầy đủ thông tin'
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      addNotification({
        type: 'info',
        title: 'Thành công',
        message: 'Đặt lịch hẹn thành công!'
      })
      setStep(5)
    } catch (error) {
      addNotification({
        type: 'info',
        title: 'Lỗi',
        message: 'Có lỗi xảy ra. Vui lòng thử lại.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  const getAvailableTimeSlots = (): TimeSlot[] => {
    if (!selectedDoctor || !selectedDate) return []
    
    const dayMapping: { [key: string]: string } = {
      'Monday': 'Thứ 2',
      'Tuesday': 'Thứ 3', 
      'Wednesday': 'Thứ 4',
      'Thursday': 'Thứ 5',
      'Friday': 'Thứ 6',
      'Saturday': 'Thứ 7',
      'Sunday': 'Chủ nhật'
    }
    
    const vietnameseDay = dayMapping[format(selectedDate, 'EEEE')]
    
    if (!selectedDoctor.availableDays.includes(vietnameseDay)) {
      return []
    }

    return selectedDoctor.timeSlots.map(time => ({
      time,
      available: Math.random() > 0.3 // Simulate availability
    }))
  }

  const resetBooking = () => {
    setStep(1)
    setSelectedDoctor(null)
    setSelectedDate(null)
    setSelectedTime(null)
    setSelectedType('')
    setReason('')
    setNotes('')
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-slate-900">Đặt lịch tư vấn</h1>
          <p className="mt-2 text-slate-600">Chọn chuyên gia tâm lý và thời gian phù hợp cho buổi tư vấn của bạn</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center justify-center">
            {[
              { step: 1, title: 'Chọn chuyên gia' },
              { step: 2, title: 'Chọn ngày' },
              { step: 3, title: 'Chọn giờ' },
              { step: 4, title: 'Thông tin' },
              { step: 5, title: 'Hoàn tất' }
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  step >= item.step 
                    ? 'bg-brand-600 border-brand-600 text-white shadow-lg' 
                    : 'border-slate-300 text-slate-500'
                }`}>
                  {step > item.step ? (
                    <CheckCircle className="w-6 h-6 animate-bounce-gentle" />
                  ) : (
                    <span className="text-sm font-medium">{item.step}</span>
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step >= item.step ? 'text-brand-600' : 'text-slate-500'
                }`}>
                  {item.title}
                </span>
                {index < 4 && (                  <div className={`w-12 h-0.5 mx-4 ${
                    step > item.step ? 'bg-brand-500' : 'bg-slate-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Doctor Selection */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-slate-900">Chọn chuyên gia tâm lý</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-stagger">
              {doctors.map((doctor, index) => (
                <div
                  key={doctor.id}
                  className="card card-hover overflow-hidden cursor-pointer animate-slide-up"
                  style={{animationDelay: `${index * 0.1}s`}}
                  onClick={() => handleDoctorSelect(doctor)}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-ocean-100 flex items-center justify-center">
                      <Brain className="w-8 h-8 text-ocean-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-slate-900">{doctor.name}</h3>
                      <p className="text-ocean-600">{doctor.specialty}</p>
                      <p className="text-sm text-slate-600">{doctor.experience}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {doctor.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {doctor.phone}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1 text-sm text-gray-600">{doctor.rating}</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        Có sẵn: {doctor.availableDays.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Date Selection */}
        {step === 2 && selectedDoctor && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Chọn ngày hẹn</h2>
              <button
                onClick={() => setStep(1)}
                className="text-ocean-600 hover:text-ocean-700"
              >
                Đổi chuyên gia
              </button>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Đã chọn: {selectedDoctor.name}
              </h3>
              
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-2">                {calendarDays.map((date) => {
                  const dayOfWeek = format(date, 'EEEE');                  const dayMapping: { [key: string]: string } = {
                    'Monday': 'Thứ 2',
                    'Tuesday': 'Thứ 3',
                    'Wednesday': 'Thứ 4',
                    'Thursday': 'Thứ 5',
                    'Friday': 'Thứ 6',
                    'Saturday': 'Thứ 7',
                    'Sunday': 'Chủ nhật'
                  }
                  const vietnameseDay = dayMapping[dayOfWeek]
                  const isAvailable = selectedDoctor.availableDays.includes(vietnameseDay)
                  const isPast = isBefore(date, startOfDay(new Date()))
                  const isSelected = selectedDate && isSameDay(date, selectedDate)
                  
                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => isAvailable && !isPast && handleDateSelect(date)}
                      disabled={!isAvailable || isPast}
                      className={`p-3 text-sm rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-brand-500 text-white shadow-md'
                          : isAvailable && !isPast
                          ? 'bg-white border border-gray-200 hover:bg-ocean-50 text-gray-900'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {format(date, 'd')}
                    </button>
                  )
                })}
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                <p>Chuyên gia {selectedDoctor.name} có sẵn vào: {selectedDoctor.availableDays.join(', ')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Time Selection */}
        {step === 3 && selectedDate && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Chọn giờ hẹn</h2>
              <button
                onClick={() => setStep(2)}
                className="text-ocean-600 hover:text-ocean-700"
              >
                Đổi ngày
              </button>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {format(selectedDate, 'EEEE, dd MMMM yyyy', { locale: vi })}
              </h3>
              
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {getAvailableTimeSlots().map(({ time, available }) => (
                  <button
                    key={time}
                    onClick={() => available && handleTimeSelect(time)}
                    disabled={!available}
                    className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                      selectedTime === time
                        ? 'bg-brand-500 text-white shadow-md'
                        : available
                        ? 'bg-white border border-gray-200 hover:bg-ocean-50 text-gray-900'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
              
              {getAvailableTimeSlots().length === 0 && (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Không có thời gian trống trong ngày này</p>
                  <button
                    onClick={() => setStep(2)}
                    className="mt-2 text-ocean-600 hover:text-ocean-700"
                  >
                    Chọn ngày khác
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Appointment Details */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Thông tin buổi tư vấn</h2>
              <button
                onClick={() => setStep(3)}
                className="text-ocean-600 hover:text-ocean-700"
              >
                Đổi giờ
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Chi tiết buổi tư vấn</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loại buổi tư vấn
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {appointmentTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setSelectedType(type.id)}
                          className={`p-3 rounded-lg border text-left transition-colors ${
                            selectedType === type.id
                              ? 'border-brand-500 bg-brand-50 shadow-md'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-medium text-gray-900">{type.name}</div>
                          <div className="text-sm text-gray-600">{type.duration}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lý do khám
                    </label>
                    <input
                      type="text"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                      placeholder="Nhập lý do cần tư vấn..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ghi chú thêm (tùy chọn)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                      placeholder="Thông tin thêm cho chuyên gia..."
                    />
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Xác nhận thông tin</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-ocean-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{selectedDoctor?.name}</p>
                      <p className="text-sm text-gray-600">{selectedDoctor?.specialty}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-ocean-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedDate && format(selectedDate, 'EEEE, dd MMMM yyyy', { locale: vi })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-ocean-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{selectedTime}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-ocean-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{selectedDoctor?.location}</p>
                    </div>
                  </div>
                  
                  {selectedType && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">Loại cuộc hẹn:</p>
                      <p className="font-medium text-gray-900">
                        {appointmentTypes.find(t => t.id === selectedType)?.name}
                      </p>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleSubmit}
                  disabled={!selectedType || isSubmitting}
                  className="w-full mt-6 bg-gradient-to-r from-brand-600 to-ocean-600 hover:from-brand-700 hover:to-ocean-700 text-white py-3 px-4 rounded-lg font-medium shadow-md transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đặt lịch'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Confirmation */}
        {step === 5 && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="card animate-fade-in">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6 animate-bounce-gentle" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Đặt lịch thành công!</h2>
              <p className="text-gray-600 mb-6">
                Buổi tư vấn của bạn đã được xác nhận. Chúng tôi sẽ gửi thông báo nhắc nhở trước buổi tư vấn.
              </p>
              
              <div className="bg-gradient-to-r from-brand-50 to-ocean-50 rounded-lg p-6 mb-6 shadow-inner animate-fade-in" style={{animationDelay: '0.3s'}}>
                <h3 className="font-semibold text-gray-900 mb-4">Thông tin buổi tư vấn</h3>
                <div className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chuyên gia:</span>
                    <span className="font-medium">{selectedDoctor?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngày:</span>
                    <span className="font-medium">
                      {selectedDate && format(selectedDate, 'dd/MM/yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Giờ:</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Địa điểm:</span>
                    <span className="font-medium">{selectedDoctor?.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in" style={{animationDelay: '0.5s'}}>
                <button
                  onClick={resetBooking}
                  className="btn border border-ocean-600 text-ocean-600 hover:bg-ocean-50 py-3 px-5 rounded-lg font-medium transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Đặt lịch khác
                </button>
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="btn bg-gradient-to-r from-brand-600 to-ocean-600 hover:from-brand-700 hover:to-ocean-700 text-white py-3 px-5 rounded-lg font-medium shadow-md transition-all transform hover:scale-[1.02]"
                >
                  Về trang chủ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AppointmentBooking
