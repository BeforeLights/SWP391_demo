// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: string[]
}

// User Types
export interface User {
  id: string
  email: string
  name: string
  role: 'patient' | 'doctor' | 'admin'
  phone?: string
  dateOfBirth?: string
  createdAt: string
  updatedAt: string
}

export interface PatientInfo {
  userId: string
  address: string
  emergencyContact: string
  hivStatus: 'positive' | 'negative' | 'unknown'
  diagnosisDate?: string
  cd4Count?: number
  viralLoad?: number
  currentARV?: string[]
  allergies?: string[]
  comorbidities?: string[]
}

export interface DoctorInfo {
  userId: string
  specialization: string
  licenseNumber: string
  experience: number
  education: string[]
  certifications: string[]
  schedule: DoctorSchedule
  bio?: string
}

export interface DoctorSchedule {
  [day: string]: TimeSlot[]
}

export interface TimeSlot {
  start: string
  end: string
  isAvailable: boolean
}

// Medication Types
export interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  instructions: string
  startDate: string
  endDate?: string
  isActive: boolean
}

export interface MedicationLog {
  id: string
  medicationId: string
  patientId: string
  takenAt: string
  dosage: string
  notes?: string
}

export interface ARVProtocol {
  id: string
  name: string
  drugs: string[]
  indication: string
  contraindications: string[]
  sideEffects: string[]
  dosage: string
  frequency: string
  isForPregnant?: boolean
  isForChildren?: boolean
  ageGroup?: string
}

// Appointment Types
export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  dateTime: string
  duration: number
  type: 'consultation' | 'followup' | 'emergency' | 'counseling'
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show'
  notes?: string
  symptoms?: string[]
  diagnosis?: string
  prescription?: string[]
  nextAppointment?: string
}

// Test Results Types
export interface TestResult {
  id: string
  patientId: string
  testType: 'cd4' | 'viralLoad' | 'bloodWork' | 'other'
  testName: string
  value: string | number
  unit: string
  referenceRange: string
  status: 'normal' | 'abnormal' | 'critical'
  testDate: string
  orderedBy: string
  notes?: string
}

export interface LabReport {
  id: string
  patientId: string
  reportDate: string
  tests: TestResult[]
  summary: string
  recommendations: string[]
  doctorId: string
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  type: 'medication' | 'appointment' | 'test' | 'system' | 'emergency'
  title: string
  message: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  isRead: boolean
  createdAt: string
  scheduledFor?: string
  actionUrl?: string
  metadata?: Record<string, any>
}

// Blog Types
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  author: {
    id: string
    name: string
    title: string
    avatar?: string
  }
  publishedAt: string
  updatedAt: string
  readTime: number
  isPublished: boolean
  featuredImage?: string
  views: number
}

export interface BlogCategory {
  id: string
  name: string
  description: string
  slug: string
  postCount: number
}

// System Types
export interface SystemStats {
  totalPatients: number
  totalDoctors: number
  totalAppointments: number
  totalMedications: number
  adherenceRate: number
  avgCD4Count: number
  avgViralLoad: number
}

// Form Types
export interface LoginForm {
  email: string
  password: string
  rememberMe: boolean
}

export interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  dateOfBirth: string
  userType: 'patient' | 'doctor'
  agreeToTerms: boolean
}

export interface AppointmentBookingForm {
  doctorId: string
  dateTime: string
  type: Appointment['type']
  symptoms?: string[]
  notes?: string
}

// API Endpoints
export interface ApiEndpoints {
  auth: {
    login: string
    register: string
    logout: string
    refresh: string
    forgotPassword: string
    resetPassword: string
  }
  users: {
    profile: string
    updateProfile: string
    changePassword: string
  }
  patients: {
    list: string
    create: string
    update: string
    delete: string
    profile: string
  }
  doctors: {
    list: string
    create: string
    update: string
    delete: string
    schedule: string
  }
  appointments: {
    list: string
    create: string
    update: string
    delete: string
    upcoming: string
    history: string
  }
  medications: {
    list: string
    create: string
    update: string
    delete: string
    logs: string
    protocols: string
  }
  tests: {
    results: string
    reports: string
    schedule: string
  }
  notifications: {
    list: string
    markRead: string
    create: string
    delete: string
  }
  blog: {
    posts: string
    categories: string
    post: string
  }
}
