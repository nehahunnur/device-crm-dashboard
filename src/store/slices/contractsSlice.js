import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import { addDays, isAfter, isBefore, differenceInDays } from 'date-fns'

const initialState = {
  contracts: [
    {
      id: uuidv4(),
      contractNumber: 'AMC-2024-001',
      type: 'AMC', // AMC or CMC
      deviceId: 'MD-001',
      deviceType: 'Ventilator',
      facilityId: 'FAC-001',
      facilityName: 'City General Hospital',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'Active',
      value: 15000,
      currency: 'USD',
      serviceFrequency: 'Quarterly', // Monthly, Quarterly, Semi-Annual, Annual
      nextServiceDate: '2024-04-01',
      servicesIncluded: [
        'Preventive Maintenance',
        'Emergency Repairs',
        'Parts Replacement',
        'Software Updates',
        'Training',
      ],
      contactPerson: 'Dr. Sarah Johnson',
      contactEmail: 'sarah.johnson@cityhospital.com',
      contactPhone: '+1-555-0123',
      vendor: 'MedTech Solutions',
      vendorContact: 'support@medtechsolutions.com',
      notes: 'Standard AMC contract with quarterly maintenance',
      documents: [
        {
          id: uuidv4(),
          filename: 'amc_contract_2024.pdf',
          description: 'Signed AMC contract',
          uploadDate: '2024-01-01',
        },
      ],
      renewalNotified: false,
      autoRenewal: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: uuidv4(),
      contractNumber: 'CMC-2024-002',
      type: 'CMC',
      deviceId: 'MD-002',
      deviceType: 'Patient Monitor',
      facilityId: 'FAC-002',
      facilityName: 'Regional Medical Center',
      startDate: '2024-02-01',
      endDate: '2024-07-31',
      status: 'Expiring Soon',
      value: 8000,
      currency: 'USD',
      serviceFrequency: 'Monthly',
      nextServiceDate: '2024-02-01',
      servicesIncluded: [
        'Comprehensive Maintenance',
        'Parts & Labor',
        'Technical Support',
      ],
      contactPerson: 'Nurse Mary Wilson',
      contactEmail: 'mary.wilson@regionalmed.com',
      contactPhone: '+1-555-0456',
      vendor: 'HealthTech Inc',
      vendorContact: 'service@healthtech.com',
      notes: 'CMC contract expiring soon - renewal required',
      documents: [],
      renewalNotified: true,
      autoRenewal: false,
      createdAt: '2024-02-01',
      updatedAt: '2024-01-20',
    },
  ],
  loading: false,
  error: null,
}

const contractsSlice = createSlice({
  name: 'contracts',
  initialState,
  reducers: {
    addContract: (state, action) => {
      const newContract = {
        id: uuidv4(),
        ...action.payload,
        status: 'Active',
        renewalNotified: false,
        documents: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      state.contracts.push(newContract)
    },
    updateContract: (state, action) => {
      const { id, ...updates } = action.payload
      const contractIndex = state.contracts.findIndex(contract => contract.id === id)
      if (contractIndex !== -1) {
        state.contracts[contractIndex] = {
          ...state.contracts[contractIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      }
    },
    renewContract: (state, action) => {
      const { id, newEndDate, newValue } = action.payload
      const contract = state.contracts.find(contract => contract.id === id)
      if (contract) {
        contract.endDate = newEndDate
        if (newValue) contract.value = newValue
        contract.status = 'Active'
        contract.renewalNotified = false
        contract.updatedAt = new Date().toISOString()
      }
    },
    markRenewalNotified: (state, action) => {
      const contract = state.contracts.find(contract => contract.id === action.payload)
      if (contract) {
        contract.renewalNotified = true
        contract.updatedAt = new Date().toISOString()
      }
    },
    addContractDocument: (state, action) => {
      const { contractId, document } = action.payload
      const contract = state.contracts.find(contract => contract.id === contractId)
      if (contract) {
        const newDocument = {
          id: uuidv4(),
          ...document,
          uploadDate: new Date().toISOString(),
        }
        contract.documents.push(newDocument)
        contract.updatedAt = new Date().toISOString()
      }
    },
    removeContractDocument: (state, action) => {
      const { contractId, documentId } = action.payload
      const contract = state.contracts.find(contract => contract.id === contractId)
      if (contract) {
        contract.documents = contract.documents.filter(doc => doc.id !== documentId)
        contract.updatedAt = new Date().toISOString()
      }
    },
    updateContractStatus: (state, action) => {
      const { id, status } = action.payload
      const contract = state.contracts.find(contract => contract.id === id)
      if (contract) {
        contract.status = status
        contract.updatedAt = new Date().toISOString()
      }
    },
    deleteContract: (state, action) => {
      state.contracts = state.contracts.filter(contract => contract.id !== action.payload)
    },
    updateContractStatuses: (state) => {
      const today = new Date()
      state.contracts.forEach(contract => {
        const endDate = new Date(contract.endDate)
        const daysUntilExpiry = differenceInDays(endDate, today)
        
        if (daysUntilExpiry < 0) {
          contract.status = 'Expired'
        } else if (daysUntilExpiry <= 30) {
          contract.status = 'Expiring Soon'
        } else if (contract.status === 'Expiring Soon' && daysUntilExpiry > 30) {
          contract.status = 'Active'
        }
      })
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
  addContract,
  updateContract,
  renewContract,
  markRenewalNotified,
  addContractDocument,
  removeContractDocument,
  updateContractStatus,
  deleteContract,
  updateContractStatuses,
  setLoading,
  setError,
} = contractsSlice.actions

// Selectors
export const selectAllContracts = (state) => state.contracts?.contracts || []
export const selectContractsLoading = (state) => state.contracts?.loading || false
export const selectContractsError = (state) => state.contracts?.error || null
export const selectContractById = (state, contractId) =>
  state.contracts?.contracts?.find(contract => contract.id === contractId) || null

export const selectContractsByDevice = (state, deviceId) =>
  state.contracts?.contracts?.filter(contract => contract.deviceId === deviceId) || []

export const selectActiveContracts = (state) =>
  state.contracts?.contracts?.filter(contract => contract.status === 'Active') || []

export const selectExpiringContracts = (state) =>
  state.contracts?.contracts?.filter(contract => contract.status === 'Expiring Soon') || []

export const selectExpiredContracts = (state) =>
  state.contracts?.contracts?.filter(contract => contract.status === 'Expired') || []

export const selectContractsByType = (state, type) =>
  state.contracts?.contracts?.filter(contract => contract.type === type) || []

export const selectContractsNeedingRenewal = (state) =>
  state.contracts?.contracts?.filter(contract =>
    (contract.status === 'Expiring Soon' || contract.status === 'Expired') &&
    !contract.renewalNotified
  ) || []

export default contractsSlice.reducer
