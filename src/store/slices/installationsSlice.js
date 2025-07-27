import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

const initialState = {
  installations: [
    {
      id: uuidv4(),
      deviceId: 'MD-001',
      deviceType: 'Ventilator',
      facilityId: 'FAC-001',
      facilityName: 'City General Hospital',
      installationDate: '2023-12-01',
      engineerId: 'ENG-001',
      engineerName: 'John Smith',
      status: 'Completed',
      checklist: {
        unboxingPhotos: true,
        deviceInspection: true,
        powerConnection: true,
        networkSetup: true,
        calibration: true,
        userTraining: true,
        documentation: true,
        finalTesting: true,
      },
      trainingCompleted: true,
      trainingDate: '2023-12-01',
      trainedPersonnel: ['Dr. Sarah Johnson', 'Nurse Mary Wilson'],
      photos: [
        {
          id: uuidv4(),
          filename: 'unboxing_1.jpg',
          description: 'Device unboxing',
          uploadDate: '2023-12-01',
        },
        {
          id: uuidv4(),
          filename: 'installation_complete.jpg',
          description: 'Installation completed',
          uploadDate: '2023-12-01',
        },
      ],
      notes: 'Installation completed successfully. All staff trained.',
      completionDate: '2023-12-01',
    },
  ],
  loading: false,
  error: null,
}

const installationsSlice = createSlice({
  name: 'installations',
  initialState,
  reducers: {
    addInstallation: (state, action) => {
      const newInstallation = {
        id: uuidv4(),
        ...action.payload,
        status: 'In Progress',
        checklist: {
          unboxingPhotos: false,
          deviceInspection: false,
          powerConnection: false,
          networkSetup: false,
          calibration: false,
          userTraining: false,
          documentation: false,
          finalTesting: false,
        },
        trainingCompleted: false,
        photos: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      state.installations.push(newInstallation)
    },
    updateInstallation: (state, action) => {
      const { id, ...updates } = action.payload
      const installationIndex = state.installations.findIndex(installation => installation.id === id)
      if (installationIndex !== -1) {
        state.installations[installationIndex] = {
          ...state.installations[installationIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      }
    },
    updateChecklist: (state, action) => {
      const { id, checklistItem, value } = action.payload
      const installation = state.installations.find(installation => installation.id === id)
      if (installation) {
        installation.checklist[checklistItem] = value
        installation.updatedAt = new Date().toISOString()
        
        // Check if all checklist items are completed
        const allCompleted = Object.values(installation.checklist).every(item => item === true)
        if (allCompleted && installation.trainingCompleted) {
          installation.status = 'Completed'
          installation.completionDate = new Date().toISOString()
        }
      }
    },
    updateTrainingStatus: (state, action) => {
      const { id, trainingCompleted, trainingDate, trainedPersonnel } = action.payload
      const installation = state.installations.find(installation => installation.id === id)
      if (installation) {
        installation.trainingCompleted = trainingCompleted
        if (trainingDate) installation.trainingDate = trainingDate
        if (trainedPersonnel) installation.trainedPersonnel = trainedPersonnel
        installation.updatedAt = new Date().toISOString()
        
        // Check if all checklist items are completed
        const allCompleted = Object.values(installation.checklist).every(item => item === true)
        if (allCompleted && trainingCompleted) {
          installation.status = 'Completed'
          installation.completionDate = new Date().toISOString()
        }
      }
    },
    addInstallationPhoto: (state, action) => {
      const { installationId, photo } = action.payload
      const installation = state.installations.find(installation => installation.id === installationId)
      if (installation) {
        const newPhoto = {
          id: uuidv4(),
          ...photo,
          uploadDate: new Date().toISOString(),
        }
        installation.photos.push(newPhoto)
        installation.updatedAt = new Date().toISOString()
      }
    },
    removeInstallationPhoto: (state, action) => {
      const { installationId, photoId } = action.payload
      const installation = state.installations.find(installation => installation.id === installationId)
      if (installation) {
        installation.photos = installation.photos.filter(photo => photo.id !== photoId)
        installation.updatedAt = new Date().toISOString()
      }
    },
    deleteInstallation: (state, action) => {
      state.installations = state.installations.filter(installation => installation.id !== action.payload)
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
  addInstallation,
  updateInstallation,
  updateChecklist,
  updateTrainingStatus,
  addInstallationPhoto,
  removeInstallationPhoto,
  deleteInstallation,
  setLoading,
  setError,
} = installationsSlice.actions

// Selectors
export const selectAllInstallations = (state) => state.installations?.installations || []
export const selectInstallationsLoading = (state) => state.installations?.loading || false
export const selectInstallationsError = (state) => state.installations?.error || null
export const selectInstallationById = (state, installationId) =>
  state.installations?.installations?.find(installation => installation.id === installationId) || null

export const selectInstallationsByDevice = (state, deviceId) =>
  state.installations?.installations?.filter(installation => installation.deviceId === deviceId) || []

export const selectPendingInstallations = (state) =>
  state.installations?.installations?.filter(installation => installation.status !== 'Completed') || []

export default installationsSlice.reducer
