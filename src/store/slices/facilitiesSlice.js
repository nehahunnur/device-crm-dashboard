import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

const initialState = {
  facilities: [
    {
      id: 'FAC-001',
      name: 'City General Hospital',
      type: 'Hospital',
      address: {
        street: '123 Medical Center Drive',
        city: 'Metropolitan City',
        state: 'State',
        zipCode: '12345',
        country: 'USA',
      },
      contactInfo: {
        phone: '+1-555-0123',
        email: 'info@cityhospital.com',
        website: 'www.cityhospital.com',
      },
      primaryContact: {
        name: 'Dr. Sarah Johnson',
        title: 'Chief Medical Officer',
        phone: '+1-555-0124',
        email: 'sarah.johnson@cityhospital.com',
      },
      technicalContact: {
        name: 'Mark Thompson',
        title: 'Biomedical Engineer',
        phone: '+1-555-0125',
        email: 'mark.thompson@cityhospital.com',
      },
      departments: [
        'ICU',
        'Emergency Room',
        'Surgery',
        'Cardiology',
        'Radiology',
      ],
      operatingHours: {
        weekdays: '24/7',
        weekends: '24/7',
        holidays: '24/7',
      },
      notes: 'Major teaching hospital with 500+ beds',
      status: 'Active',
      contractStartDate: '2023-01-01',
      contractEndDate: '2025-12-31',
      deviceCount: 15,
      lastVisitDate: '2024-01-15',
      createdAt: '2023-01-01',
      updatedAt: '2024-01-15',
    },
    {
      id: 'FAC-002',
      name: 'Regional Medical Center',
      type: 'Medical Center',
      address: {
        street: '456 Healthcare Boulevard',
        city: 'Regional City',
        state: 'State',
        zipCode: '67890',
        country: 'USA',
      },
      contactInfo: {
        phone: '+1-555-0456',
        email: 'contact@regionalmed.com',
        website: 'www.regionalmed.com',
      },
      primaryContact: {
        name: 'Dr. Michael Davis',
        title: 'Medical Director',
        phone: '+1-555-0457',
        email: 'michael.davis@regionalmed.com',
      },
      technicalContact: {
        name: 'Lisa Chen',
        title: 'Clinical Engineer',
        phone: '+1-555-0458',
        email: 'lisa.chen@regionalmed.com',
      },
      departments: [
        'Emergency Room',
        'Outpatient',
        'Laboratory',
        'Imaging',
      ],
      operatingHours: {
        weekdays: '6:00 AM - 10:00 PM',
        weekends: '8:00 AM - 8:00 PM',
        holidays: '8:00 AM - 6:00 PM',
      },
      notes: 'Regional facility serving rural communities',
      status: 'Active',
      contractStartDate: '2023-06-01',
      contractEndDate: '2024-05-31',
      deviceCount: 8,
      lastVisitDate: '2024-01-10',
      createdAt: '2023-06-01',
      updatedAt: '2024-01-10',
    },
  ],
  loading: false,
  error: null,
}

const facilitiesSlice = createSlice({
  name: 'facilities',
  initialState,
  reducers: {
    addFacility: (state, action) => {
      const newFacility = {
        id: `FAC-${String(state.facilities.length + 1).padStart(3, '0')}`,
        ...action.payload,
        status: 'Active',
        deviceCount: 0,
        lastVisitDate: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      state.facilities.push(newFacility)
    },
    updateFacility: (state, action) => {
      const { id, ...updates } = action.payload
      const facilityIndex = state.facilities.findIndex(facility => facility.id === id)
      if (facilityIndex !== -1) {
        state.facilities[facilityIndex] = {
          ...state.facilities[facilityIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      }
    },
    updateFacilityDeviceCount: (state, action) => {
      const { facilityId, count } = action.payload
      const facility = state.facilities.find(facility => facility.id === facilityId)
      if (facility) {
        facility.deviceCount = count
        facility.updatedAt = new Date().toISOString()
      }
    },
    updateFacilityLastVisit: (state, action) => {
      const { facilityId, visitDate } = action.payload
      const facility = state.facilities.find(facility => facility.id === facilityId)
      if (facility) {
        facility.lastVisitDate = visitDate
        facility.updatedAt = new Date().toISOString()
      }
    },
    addFacilityDepartment: (state, action) => {
      const { facilityId, department } = action.payload
      const facility = state.facilities.find(facility => facility.id === facilityId)
      if (facility && !facility.departments.includes(department)) {
        facility.departments.push(department)
        facility.updatedAt = new Date().toISOString()
      }
    },
    removeFacilityDepartment: (state, action) => {
      const { facilityId, department } = action.payload
      const facility = state.facilities.find(facility => facility.id === facilityId)
      if (facility) {
        facility.departments = facility.departments.filter(dept => dept !== department)
        facility.updatedAt = new Date().toISOString()
      }
    },
    updateFacilityStatus: (state, action) => {
      const { facilityId, status } = action.payload
      const facility = state.facilities.find(facility => facility.id === facilityId)
      if (facility) {
        facility.status = status
        facility.updatedAt = new Date().toISOString()
      }
    },
    deleteFacility: (state, action) => {
      state.facilities = state.facilities.filter(facility => facility.id !== action.payload)
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const {
  addFacility,
  updateFacility,
  updateFacilityDeviceCount,
  updateFacilityLastVisit,
  addFacilityDepartment,
  removeFacilityDepartment,
  updateFacilityStatus,
  deleteFacility,
  setLoading,
  setError,
} = facilitiesSlice.actions

// Selectors
export const selectAllFacilities = (state) => state.facilities?.facilities || []
export const selectFacilitiesLoading = (state) => state.facilities?.loading || false
export const selectFacilitiesError = (state) => state.facilities?.error || null
export const selectFacilityById = (state, facilityId) =>
  state.facilities?.facilities?.find(facility => facility.id === facilityId) || null

export const selectActiveFacilities = (state) =>
  state.facilities?.facilities?.filter(facility => facility.status === 'Active') || []

export const selectFacilitiesByType = (state, type) =>
  state.facilities?.facilities?.filter(facility => facility.type === type) || []

export const selectFacilitiesWithExpiredContracts = (state) => {
  const today = new Date()
  return state.facilities?.facilities?.filter(facility => {
    if (!facility.contractEndDate) return false
    return new Date(facility.contractEndDate) < today
  }) || []
}

export const selectFacilitiesWithExpiringContracts = (state, daysAhead = 30) => {
  const today = new Date()
  const futureDate = new Date(today.getTime() + (daysAhead * 24 * 60 * 60 * 1000))

  return state.facilities?.facilities?.filter(facility => {
    if (!facility.contractEndDate) return false
    const endDate = new Date(facility.contractEndDate)
    return endDate >= today && endDate <= futureDate
  }) || []
}

export const selectFacilityOptions = (state) =>
  state.facilities?.facilities?.map(facility => ({
    value: facility.id,
    label: facility.name,
  })) || []

export default facilitiesSlice.reducer
