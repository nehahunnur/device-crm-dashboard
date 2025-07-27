import { configureStore } from '@reduxjs/toolkit'
import devicesReducer from './slices/devicesSlice'
import installationsReducer from './slices/installationsSlice'
import serviceVisitsReducer from './slices/serviceVisitsSlice'
import contractsReducer from './slices/contractsSlice'
import photoLogsReducer from './slices/photoLogsSlice'
import facilitiesReducer from './slices/facilitiesSlice'

// Load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('medicalDeviceState')
    if (serializedState === null) {
      return undefined
    }
    return JSON.parse(serializedState)
  } catch (err) {
    return undefined
  }
}

// Save state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('medicalDeviceState', serializedState)
  } catch (err) {
    // Ignore write errors
  }
}

const preloadedState = loadState()

export const store = configureStore({
  reducer: {
    devices: devicesReducer,
    installations: installationsReducer,
    serviceVisits: serviceVisitsReducer,
    contracts: contractsReducer,
    photoLogs: photoLogsReducer,
    facilities: facilitiesReducer,
  },
  preloadedState,
})

// Subscribe to store changes and save to localStorage
store.subscribe(() => {
  saveState(store.getState())
})

export default store
