import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

const initialState = {
  serviceVisits: [
    {
      id: uuidv4(),
      deviceId: 'MD-001',
      deviceType: 'Ventilator',
      facilityId: 'FAC-001',
      facilityName: 'City General Hospital',
      visitDate: '2024-01-15',
      engineerId: 'ENG-002',
      engineerName: 'Mike Johnson',
      purpose: 'Preventive',
      status: 'Completed',
      description: 'Routine maintenance and calibration',
      workPerformed: [
        'Filter replacement',
        'Calibration check',
        'Software update',
        'Battery test',
      ],
      partsUsed: [
        { name: 'Air Filter', partNumber: 'AF-001', quantity: 2 },
        { name: 'O-Ring Seal', partNumber: 'OR-005', quantity: 1 },
      ],
      timeSpent: 120, // minutes
      nextServiceDate: '2024-07-15',
      photos: [
        {
          id: uuidv4(),
          filename: 'before_service.jpg',
          description: 'Device condition before service',
          uploadDate: '2024-01-15',
        },
        {
          id: uuidv4(),
          filename: 'after_service.jpg',
          description: 'Device condition after service',
          uploadDate: '2024-01-15',
        },
      ],
      attachments: [
        {
          id: uuidv4(),
          filename: 'service_report.pdf',
          description: 'Detailed service report',
          uploadDate: '2024-01-15',
        },
      ],
      notes: 'All systems functioning normally. Recommended next service in 6 months.',
      customerSignature: 'Dr. Sarah Johnson',
      completionDate: '2024-01-15',
    },
    {
      id: uuidv4(),
      deviceId: 'MD-002',
      deviceType: 'Patient Monitor',
      facilityId: 'FAC-002',
      facilityName: 'Regional Medical Center',
      visitDate: '2024-01-10',
      engineerId: 'ENG-001',
      engineerName: 'John Smith',
      purpose: 'Breakdown',
      status: 'In Progress',
      description: 'Display flickering issue reported',
      workPerformed: [
        'Display diagnostics',
        'Cable inspection',
      ],
      partsUsed: [],
      timeSpent: 45,
      nextServiceDate: null,
      photos: [],
      attachments: [],
      notes: 'Issue identified - display cable needs replacement. Parts ordered.',
      customerSignature: null,
      completionDate: null,
    },
  ],
  loading: false,
  error: null,
}

const serviceVisitsSlice = createSlice({
  name: 'serviceVisits',
  initialState,
  reducers: {
    addServiceVisit: (state, action) => {
      const newServiceVisit = {
        id: uuidv4(),
        ...action.payload,
        status: 'Scheduled',
        workPerformed: [],
        partsUsed: [],
        timeSpent: 0,
        photos: [],
        attachments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      state.serviceVisits.push(newServiceVisit)
    },
    updateServiceVisit: (state, action) => {
      const { id, ...updates } = action.payload
      const visitIndex = state.serviceVisits.findIndex(visit => visit.id === id)
      if (visitIndex !== -1) {
        state.serviceVisits[visitIndex] = {
          ...state.serviceVisits[visitIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      }
    },
    addWorkPerformed: (state, action) => {
      const { visitId, work } = action.payload
      const visit = state.serviceVisits.find(visit => visit.id === visitId)
      if (visit) {
        visit.workPerformed.push(work)
        visit.updatedAt = new Date().toISOString()
      }
    },
    removeWorkPerformed: (state, action) => {
      const { visitId, index } = action.payload
      const visit = state.serviceVisits.find(visit => visit.id === visitId)
      if (visit) {
        visit.workPerformed.splice(index, 1)
        visit.updatedAt = new Date().toISOString()
      }
    },
    addPartUsed: (state, action) => {
      const { visitId, part } = action.payload
      const visit = state.serviceVisits.find(visit => visit.id === visitId)
      if (visit) {
        visit.partsUsed.push(part)
        visit.updatedAt = new Date().toISOString()
      }
    },
    removePartUsed: (state, action) => {
      const { visitId, index } = action.payload
      const visit = state.serviceVisits.find(visit => visit.id === visitId)
      if (visit) {
        visit.partsUsed.splice(index, 1)
        visit.updatedAt = new Date().toISOString()
      }
    },
    addServicePhoto: (state, action) => {
      const { visitId, photo } = action.payload
      const visit = state.serviceVisits.find(visit => visit.id === visitId)
      if (visit) {
        const newPhoto = {
          id: uuidv4(),
          ...photo,
          uploadDate: new Date().toISOString(),
        }
        visit.photos.push(newPhoto)
        visit.updatedAt = new Date().toISOString()
      }
    },
    removeServicePhoto: (state, action) => {
      const { visitId, photoId } = action.payload
      const visit = state.serviceVisits.find(visit => visit.id === visitId)
      if (visit) {
        visit.photos = visit.photos.filter(photo => photo.id !== photoId)
        visit.updatedAt = new Date().toISOString()
      }
    },
    addServiceAttachment: (state, action) => {
      const { visitId, attachment } = action.payload
      const visit = state.serviceVisits.find(visit => visit.id === visitId)
      if (visit) {
        const newAttachment = {
          id: uuidv4(),
          ...attachment,
          uploadDate: new Date().toISOString(),
        }
        visit.attachments.push(newAttachment)
        visit.updatedAt = new Date().toISOString()
      }
    },
    removeServiceAttachment: (state, action) => {
      const { visitId, attachmentId } = action.payload
      const visit = state.serviceVisits.find(visit => visit.id === visitId)
      if (visit) {
        visit.attachments = visit.attachments.filter(attachment => attachment.id !== attachmentId)
        visit.updatedAt = new Date().toISOString()
      }
    },
    completeServiceVisit: (state, action) => {
      const { visitId, customerSignature, completionNotes } = action.payload
      const visit = state.serviceVisits.find(visit => visit.id === visitId)
      if (visit) {
        visit.status = 'Completed'
        visit.customerSignature = customerSignature
        visit.completionDate = new Date().toISOString()
        if (completionNotes) visit.notes = completionNotes
        visit.updatedAt = new Date().toISOString()
      }
    },
    deleteServiceVisit: (state, action) => {
      state.serviceVisits = state.serviceVisits.filter(visit => visit.id !== action.payload)
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
  addServiceVisit,
  updateServiceVisit,
  addWorkPerformed,
  removeWorkPerformed,
  addPartUsed,
  removePartUsed,
  addServicePhoto,
  removeServicePhoto,
  addServiceAttachment,
  removeServiceAttachment,
  completeServiceVisit,
  deleteServiceVisit,
  setLoading,
  setError,
} = serviceVisitsSlice.actions

// Selectors
export const selectAllServiceVisits = (state) => state.serviceVisits?.serviceVisits || []
export const selectServiceVisitsLoading = (state) => state.serviceVisits?.loading || false
export const selectServiceVisitsError = (state) => state.serviceVisits?.error || null
export const selectServiceVisitById = (state, visitId) =>
  state.serviceVisits?.serviceVisits?.find(visit => visit.id === visitId) || null

export const selectServiceVisitsByDevice = (state, deviceId) =>
  state.serviceVisits?.serviceVisits?.filter(visit => visit.deviceId === deviceId) || []

export const selectPendingServiceVisits = (state) =>
  state.serviceVisits?.serviceVisits?.filter(visit => visit.status !== 'Completed') || []

export const selectServiceVisitsByPurpose = (state, purpose) =>
  state.serviceVisits?.serviceVisits?.filter(visit => visit.purpose === purpose) || []

export default serviceVisitsSlice.reducer
