import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

const initialState = {
  devices: [
    {
      id: uuidv4(),
      deviceId: 'MD-001',
      type: 'Ventilator',
      model: 'VentMax Pro',
      serialNumber: 'VM001234',
      facilityId: 'FAC-001',
      facilityName: 'City General Hospital',
      status: 'Online',
      batteryLevel: 85,
      lastServiceDate: '2024-01-15',
      lastInstallationDate: '2023-12-01',
      amcStatus: 'Active',
      cmcStatus: 'Active',
      location: 'ICU Ward 1',
      manufacturer: 'MedTech Solutions',
      purchaseDate: '2023-11-15',
      warrantyExpiry: '2025-11-15',
      notes: 'Regular maintenance completed',
    },
    {
      id: uuidv4(),
      deviceId: 'MD-002',
      type: 'Patient Monitor',
      model: 'MonitorPro X1',
      serialNumber: 'MP002345',
      facilityId: 'FAC-002',
      facilityName: 'Regional Medical Center',
      status: 'Maintenance',
      batteryLevel: 45,
      lastServiceDate: '2024-01-10',
      lastInstallationDate: '2023-11-20',
      amcStatus: 'Expiring Soon',
      cmcStatus: 'Active',
      location: 'Emergency Room',
      manufacturer: 'HealthTech Inc',
      purchaseDate: '2023-10-20',
      warrantyExpiry: '2025-10-20',
      notes: 'Battery replacement needed',
    },
  ],
  loading: false,
  error: null,
  searchTerm: '',
  filterStatus: 'All',
  filterFacility: 'All',
}

const devicesSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    addDevice: (state, action) => {
      const newDevice = {
        id: uuidv4(),
        ...action.payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      state.devices.push(newDevice)
    },
    updateDevice: (state, action) => {
      const { id, ...updates } = action.payload
      const deviceIndex = state.devices.findIndex(device => device.id === id)
      if (deviceIndex !== -1) {
        state.devices[deviceIndex] = {
          ...state.devices[deviceIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      }
    },
    deleteDevice: (state, action) => {
      state.devices = state.devices.filter(device => device.id !== action.payload)
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload
    },
    setFilterStatus: (state, action) => {
      state.filterStatus = action.payload
    },
    setFilterFacility: (state, action) => {
      state.filterFacility = action.payload
    },
    updateDeviceStatus: (state, action) => {
      const { id, status } = action.payload
      const device = state.devices.find(device => device.id === id)
      if (device) {
        device.status = status
        device.updatedAt = new Date().toISOString()
      }
    },
    updateBatteryLevel: (state, action) => {
      const { id, batteryLevel } = action.payload
      const device = state.devices.find(device => device.id === id)
      if (device) {
        device.batteryLevel = batteryLevel
        device.updatedAt = new Date().toISOString()
      }
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
  addDevice,
  updateDevice,
  deleteDevice,
  setSearchTerm,
  setFilterStatus,
  setFilterFacility,
  updateDeviceStatus,
  updateBatteryLevel,
  setLoading,
  setError,
} = devicesSlice.actions

// Selectors
export const selectAllDevices = (state) => state.devices?.devices || []
export const selectDevicesLoading = (state) => state.devices?.loading || false
export const selectDevicesError = (state) => state.devices?.error || null
export const selectSearchTerm = (state) => state.devices?.searchTerm || ''
export const selectFilterStatus = (state) => state.devices?.filterStatus || 'All'
export const selectFilterFacility = (state) => state.devices?.filterFacility || 'All'

export const selectFilteredDevices = (state) => {
  const devices = state.devices?.devices || []
  const searchTerm = state.devices?.searchTerm || ''
  const filterStatus = state.devices?.filterStatus || 'All'
  const filterFacility = state.devices?.filterFacility || 'All'

  return devices.filter(device => {
    const matchesSearch = searchTerm === '' ||
      device.deviceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.facilityName?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'All' || device.status === filterStatus
    const matchesFacility = filterFacility === 'All' || device.facilityName === filterFacility

    return matchesSearch && matchesStatus && matchesFacility
  })
}

export const selectDeviceById = (state, deviceId) =>
  state.devices?.devices?.find(device => device.id === deviceId) || null

export default devicesSlice.reducer
