import { apiService } from './api'

export interface MedicalRecord {
  id: string
  patientId: string
  doctorId: string
  date: string
  diagnosis: string
  symptoms: string[]
  treatment: string
  medications: Medication[]
  testResults: TestResult[]
  notes: string
  followUpDate?: string
}

export interface TestResult {
  id: string
  type: 'cd4' | 'viral_load' | 'blood' | 'urine' | 'other'
  name: string
  value: number | string
  unit: string
  referenceRange: string
  status: 'normal' | 'abnormal' | 'critical'
  date: string
  notes?: string
}

export interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
  startDate: string
  endDate?: string
  isActive: boolean
}

export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  date: string
  time: string
  type: 'routine' | 'consultation' | 'test' | 'emergency'
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show'
  reason: string
  notes?: string
  location: string
  duration: number
}

export interface Doctor {
  id: string
  name: string
  email: string
  phone: string
  specialty: string
  experience: number
  education: string
  licenses: string[]
  rating: number
  totalPatients: number
  activePatients: number
  availableDays: string[]
  timeSlots: string[]
  location: string
  status: 'active' | 'inactive' | 'on-leave'
  joinDate: string
  arvProtocols: string[]
}

export class MedicalService {
  // Patient Medical Records
  static async getPatientRecords(patientId: string): Promise<MedicalRecord[]> {
    const response = await apiService.get<MedicalRecord[]>(`/medical/patients/${patientId}/records`)
    return response.data
  }

  static async createMedicalRecord(record: Omit<MedicalRecord, 'id'>): Promise<MedicalRecord> {
    const response = await apiService.post<MedicalRecord>('/medical/records', record)
    return response.data
  }

  static async updateMedicalRecord(recordId: string, record: Partial<MedicalRecord>): Promise<MedicalRecord> {
    const response = await apiService.put<MedicalRecord>(`/medical/records/${recordId}`, record)
    return response.data
  }

  // Test Results
  static async getTestResults(patientId: string): Promise<TestResult[]> {
    const response = await apiService.get<TestResult[]>(`/medical/patients/${patientId}/tests`)
    return response.data
  }

  static async addTestResult(testResult: Omit<TestResult, 'id'>): Promise<TestResult> {
    const response = await apiService.post<TestResult>('/medical/tests', testResult)
    return response.data
  }

  static async getCD4History(patientId: string): Promise<TestResult[]> {
    const response = await apiService.get<TestResult[]>(`/medical/patients/${patientId}/tests/cd4`)
    return response.data
  }

  static async getViralLoadHistory(patientId: string): Promise<TestResult[]> {
    const response = await apiService.get<TestResult[]>(`/medical/patients/${patientId}/tests/viral-load`)
    return response.data
  }

  // Medications
  static async getPatientMedications(patientId: string): Promise<Medication[]> {
    const response = await apiService.get<Medication[]>(`/medical/patients/${patientId}/medications`)
    return response.data
  }

  static async prescribeMedication(medication: Omit<Medication, 'id'>): Promise<Medication> {
    const response = await apiService.post<Medication>('/medical/medications', medication)
    return response.data
  }

  static async updateMedication(medicationId: string, medication: Partial<Medication>): Promise<Medication> {
    const response = await apiService.put<Medication>(`/medical/medications/${medicationId}`, medication)
    return response.data
  }

  static async stopMedication(medicationId: string): Promise<void> {
    await apiService.patch(`/medical/medications/${medicationId}/stop`)
  }

  // Medication Adherence
  static async recordMedicationTaken(medicationId: string, date: string): Promise<void> {
    await apiService.post(`/medical/medications/${medicationId}/taken`, { date })
  }

  static async getMedicationAdherence(patientId: string, startDate?: string, endDate?: string): Promise<any> {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)
    
    const response = await apiService.get(`/medical/patients/${patientId}/adherence?${params}`)
    return response.data
  }

  // Appointments
  static async getPatientAppointments(patientId: string): Promise<Appointment[]> {
    const response = await apiService.get<Appointment[]>(`/medical/patients/${patientId}/appointments`)
    return response.data
  }

  static async getDoctorAppointments(doctorId: string, date?: string): Promise<Appointment[]> {
    const params = date ? `?date=${date}` : ''
    const response = await apiService.get<Appointment[]>(`/medical/doctors/${doctorId}/appointments${params}`)
    return response.data
  }

  static async bookAppointment(appointment: Omit<Appointment, 'id' | 'status'>): Promise<Appointment> {
    const response = await apiService.post<Appointment>('/medical/appointments', {
      ...appointment,
      status: 'scheduled'
    })
    return response.data
  }

  static async updateAppointment(appointmentId: string, appointment: Partial<Appointment>): Promise<Appointment> {
    const response = await apiService.put<Appointment>(`/medical/appointments/${appointmentId}`, appointment)
    return response.data
  }

  static async cancelAppointment(appointmentId: string, reason?: string): Promise<void> {
    await apiService.patch(`/medical/appointments/${appointmentId}/cancel`, { reason })
  }

  // Doctors
  static async getDoctors(): Promise<Doctor[]> {
    const response = await apiService.get<Doctor[]>('/medical/doctors')
    return response.data
  }

  static async getDoctorById(doctorId: string): Promise<Doctor> {
    const response = await apiService.get<Doctor>(`/medical/doctors/${doctorId}`)
    return response.data
  }

  static async getDoctorAvailability(doctorId: string, date: string): Promise<string[]> {
    const response = await apiService.get<string[]>(`/medical/doctors/${doctorId}/availability?date=${date}`)
    return response.data
  }

  static async createDoctor(doctor: Omit<Doctor, 'id' | 'rating' | 'totalPatients' | 'activePatients'>): Promise<Doctor> {
    const response = await apiService.post<Doctor>('/medical/doctors', doctor)
    return response.data
  }

  static async updateDoctor(doctorId: string, doctor: Partial<Doctor>): Promise<Doctor> {
    const response = await apiService.put<Doctor>(`/medical/doctors/${doctorId}`, doctor)
    return response.data
  }

  static async deleteDoctor(doctorId: string): Promise<void> {
    await apiService.delete(`/medical/doctors/${doctorId}`)
  }

  // Reports
  static async getPatientReport(patientId: string, startDate?: string, endDate?: string): Promise<any> {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)
    
    const response = await apiService.get(`/medical/patients/${patientId}/reports?${params}`)
    return response.data
  }  static async exportPatientReport(patientId: string, format: 'pdf' | 'excel' = 'pdf'): Promise<Blob> {
    // Note: In real implementation, this would use a specialized blob endpoint
    const response = await apiService.get<any>(`/medical/patients/${patientId}/reports/export?format=${format}`)
    // For now, return a mock blob since we don't have a real API
    return new Blob([JSON.stringify(response.data)], { type: 'application/json' })
  }
  // ARV Protocols
  static async getARVProtocols(): Promise<any[]> {
    const response = await apiService.get<any[]>('/medical/arv-protocols')
    return response.data
  }

  static async createARVProtocol(protocol: any): Promise<any> {
    const response = await apiService.post('/medical/arv-protocols', protocol)
    return response.data
  }

  static async updateARVProtocol(protocolId: string, protocol: any): Promise<any> {
    const response = await apiService.put(`/medical/arv-protocols/${protocolId}`, protocol)
    return response.data
  }

  static async deleteARVProtocol(protocolId: string): Promise<void> {
    await apiService.delete(`/medical/arv-protocols/${protocolId}`)
  }
}

export default MedicalService
