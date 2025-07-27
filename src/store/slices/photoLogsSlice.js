import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

const initialState = {
  photoLogs: [
    {
      id: uuidv4(),
      deviceId: 'MD-001',
      deviceType: 'Ventilator',
      facilityId: 'FAC-001',
      facilityName: 'City General Hospital',
      filename: 'device_condition_jan2024.jpg',
      originalName: 'IMG_20240115_143022.jpg',
      description: 'Monthly condition check - January 2024',
      category: 'Condition Check',
      uploadDate: '2024-01-15T14:30:22.000Z',
      uploadedBy: 'John Smith',
      fileSize: 2048576, // bytes
      mimeType: 'image/jpeg',
      tags: ['monthly-check', 'good-condition', 'routine'],
      location: 'ICU Ward 1',
      notes: 'Device in excellent condition, no visible wear',
      isAlert: false,
      alertLevel: null,
      relatedServiceVisitId: null,
      relatedInstallationId: null,
      metadata: {
        camera: 'iPhone 12',
        timestamp: '2024-01-15T14:30:22.000Z',
        gpsLocation: null,
      },
    },
    {
      id: uuidv4(),
      deviceId: 'MD-002',
      deviceType: 'Patient Monitor',
      facilityId: 'FAC-002',
      facilityName: 'Regional Medical Center',
      filename: 'display_issue_jan2024.jpg',
      originalName: 'IMG_20240110_091545.jpg',
      description: 'Display flickering issue documentation',
      category: 'Issue Documentation',
      uploadDate: '2024-01-10T09:15:45.000Z',
      uploadedBy: 'Mike Johnson',
      fileSize: 1536000,
      mimeType: 'image/jpeg',
      tags: ['issue', 'display-problem', 'urgent'],
      location: 'Emergency Room',
      notes: 'Display showing intermittent flickering, needs immediate attention',
      isAlert: true,
      alertLevel: 'High',
      relatedServiceVisitId: 'SV-002',
      relatedInstallationId: null,
      metadata: {
        camera: 'Samsung Galaxy S21',
        timestamp: '2024-01-10T09:15:45.000Z',
        gpsLocation: null,
      },
    },
  ],
  loading: false,
  error: null,
  filters: {
    deviceId: 'All',
    category: 'All',
    alertLevel: 'All',
    dateRange: {
      start: null,
      end: null,
    },
  },
}

const photoLogsSlice = createSlice({
  name: 'photoLogs',
  initialState,
  reducers: {
    addPhotoLog: (state, action) => {
      const newPhotoLog = {
        id: uuidv4(),
        ...action.payload,
        uploadDate: new Date().toISOString(),
        tags: action.payload.tags || [],
        isAlert: action.payload.isAlert || false,
        alertLevel: action.payload.alertLevel || null,
        metadata: {
          timestamp: new Date().toISOString(),
          ...action.payload.metadata,
        },
      }
      state.photoLogs.unshift(newPhotoLog) // Add to beginning for chronological order
    },
    updatePhotoLog: (state, action) => {
      const { id, ...updates } = action.payload
      const photoIndex = state.photoLogs.findIndex(photo => photo.id === id)
      if (photoIndex !== -1) {
        state.photoLogs[photoIndex] = {
          ...state.photoLogs[photoIndex],
          ...updates,
        }
      }
    },
    deletePhotoLog: (state, action) => {
      state.photoLogs = state.photoLogs.filter(photo => photo.id !== action.payload)
    },
    addPhotoTag: (state, action) => {
      const { photoId, tag } = action.payload
      const photo = state.photoLogs.find(photo => photo.id === photoId)
      if (photo && !photo.tags.includes(tag)) {
        photo.tags.push(tag)
      }
    },
    removePhotoTag: (state, action) => {
      const { photoId, tag } = action.payload
      const photo = state.photoLogs.find(photo => photo.id === photoId)
      if (photo) {
        photo.tags = photo.tags.filter(t => t !== tag)
      }
    },
    updatePhotoAlert: (state, action) => {
      const { photoId, isAlert, alertLevel } = action.payload
      const photo = state.photoLogs.find(photo => photo.id === photoId)
      if (photo) {
        photo.isAlert = isAlert
        photo.alertLevel = isAlert ? alertLevel : null
      }
    },
    setPhotoFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      }
    },
    clearPhotoFilters: (state) => {
      state.filters = {
        deviceId: 'All',
        category: 'All',
        alertLevel: 'All',
        dateRange: {
          start: null,
          end: null,
        },
      }
    },
    bulkDeletePhotos: (state, action) => {
      const photoIds = action.payload
      state.photoLogs = state.photoLogs.filter(photo => !photoIds.includes(photo.id))
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
  addPhotoLog,
  updatePhotoLog,
  deletePhotoLog,
  addPhotoTag,
  removePhotoTag,
  updatePhotoAlert,
  setPhotoFilters,
  clearPhotoFilters,
  bulkDeletePhotos,
  setLoading,
  setError,
} = photoLogsSlice.actions

// Selectors
export const selectAllPhotoLogs = (state) => state.photoLogs?.photoLogs || []
export const selectPhotoLogsLoading = (state) => state.photoLogs?.loading || false
export const selectPhotoLogsError = (state) => state.photoLogs?.error || null
export const selectPhotoFilters = (state) => state.photoLogs?.filters || {}

export const selectFilteredPhotoLogs = (state) => {
  const photoLogs = state.photoLogs?.photoLogs || []
  const filters = state.photoLogs?.filters || {}

  return photoLogs.filter(photo => {
    const matchesDevice = filters.deviceId === 'All' || photo.deviceId === filters.deviceId
    const matchesCategory = filters.category === 'All' || photo.category === filters.category
    const matchesAlertLevel = filters.alertLevel === 'All' || photo.alertLevel === filters.alertLevel

    let matchesDateRange = true
    if (filters.dateRange?.start && filters.dateRange?.end) {
      const photoDate = new Date(photo.uploadDate)
      const startDate = new Date(filters.dateRange.start)
      const endDate = new Date(filters.dateRange.end)
      matchesDateRange = photoDate >= startDate && photoDate <= endDate
    }

    return matchesDevice && matchesCategory && matchesAlertLevel && matchesDateRange
  })
}

export const selectPhotoLogById = (state, photoId) =>
  state.photoLogs?.photoLogs?.find(photo => photo.id === photoId) || null

export const selectPhotoLogsByDevice = (state, deviceId) =>
  state.photoLogs?.photoLogs?.filter(photo => photo.deviceId === deviceId) || []

export const selectAlertPhotos = (state) =>
  state.photoLogs?.photoLogs?.filter(photo => photo.isAlert) || []

export const selectPhotoLogsByCategory = (state, category) =>
  state.photoLogs?.photoLogs?.filter(photo => photo.category === category) || []

export const selectRecentPhotoLogs = (state, limit = 10) =>
  state.photoLogs?.photoLogs?.slice(0, limit) || []

export const selectPhotoLogsByServiceVisit = (state, serviceVisitId) =>
  state.photoLogs?.photoLogs?.filter(photo => photo.relatedServiceVisitId === serviceVisitId) || []

export const selectPhotoLogsByInstallation = (state, installationId) =>
  state.photoLogs?.photoLogs?.filter(photo => photo.relatedInstallationId === installationId) || []

export default photoLogsSlice.reducer
