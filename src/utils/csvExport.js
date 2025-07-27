// CSV Export Utilities

/**
 * Converts an array of objects to CSV format
 * @param {Array} data - Array of objects to convert
 * @param {Array} headers - Array of header objects with key and label properties
 * @param {string} filename - Name of the file to download
 */
export const exportToCSV = (data, headers, filename = 'export.csv') => {
  if (!data || data.length === 0) {
    throw new Error('No data to export')
  }

  // Create CSV headers
  const csvHeaders = headers.map(header => `"${header.label}"`)
  
  // Create CSV rows
  const csvRows = data.map(row => {
    return headers.map(header => {
      let value = getNestedValue(row, header.key)
      
      // Handle different data types
      if (value === null || value === undefined) {
        value = ''
      } else if (typeof value === 'object') {
        value = JSON.stringify(value)
      } else if (typeof value === 'string') {
        // Escape quotes and wrap in quotes if contains comma, newline, or quote
        value = value.replace(/"/g, '""')
        if (value.includes(',') || value.includes('\n') || value.includes('"')) {
          value = `"${value}"`
        }
      }
      
      return value
    })
  })

  // Combine headers and rows
  const csvContent = [csvHeaders, ...csvRows]
    .map(row => row.join(','))
    .join('\n')

  // Create and download file
  downloadCSV(csvContent, filename)
}

/**
 * Downloads CSV content as a file
 * @param {string} csvContent - CSV content string
 * @param {string} filename - Name of the file
 */
const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

/**
 * Gets nested value from object using dot notation
 * @param {Object} obj - Object to get value from
 * @param {string} path - Dot notation path (e.g., 'user.profile.name')
 */
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null
  }, obj)
}

/**
 * Device inventory export configuration
 */
export const deviceExportConfig = {
  headers: [
    { key: 'deviceId', label: 'Device ID' },
    { key: 'type', label: 'Type' },
    { key: 'model', label: 'Model' },
    { key: 'serialNumber', label: 'Serial Number' },
    { key: 'facilityName', label: 'Facility' },
    { key: 'location', label: 'Location' },
    { key: 'status', label: 'Status' },
    { key: 'batteryLevel', label: 'Battery Level (%)' },
    { key: 'manufacturer', label: 'Manufacturer' },
    { key: 'purchaseDate', label: 'Purchase Date' },
    { key: 'warrantyExpiry', label: 'Warranty Expiry' },
    { key: 'lastServiceDate', label: 'Last Service Date' },
    { key: 'lastInstallationDate', label: 'Last Installation Date' },
    { key: 'amcStatus', label: 'AMC Status' },
    { key: 'cmcStatus', label: 'CMC Status' },
    { key: 'notes', label: 'Notes' },
  ],
  filename: `devices_export_${new Date().toISOString().split('T')[0]}.csv`
}

/**
 * Installation export configuration
 */
export const installationExportConfig = {
  headers: [
    { key: 'deviceId', label: 'Device ID' },
    { key: 'deviceType', label: 'Device Type' },
    { key: 'facilityName', label: 'Facility' },
    { key: 'installationDate', label: 'Installation Date' },
    { key: 'engineerName', label: 'Engineer' },
    { key: 'status', label: 'Status' },
    { key: 'trainingCompleted', label: 'Training Completed' },
    { key: 'trainingDate', label: 'Training Date' },
    { key: 'completionDate', label: 'Completion Date' },
    { key: 'notes', label: 'Notes' },
  ],
  filename: `installations_export_${new Date().toISOString().split('T')[0]}.csv`
}

/**
 * Service visits export configuration
 */
export const serviceVisitExportConfig = {
  headers: [
    { key: 'deviceId', label: 'Device ID' },
    { key: 'deviceType', label: 'Device Type' },
    { key: 'facilityName', label: 'Facility' },
    { key: 'visitDate', label: 'Visit Date' },
    { key: 'engineerName', label: 'Engineer' },
    { key: 'purpose', label: 'Purpose' },
    { key: 'status', label: 'Status' },
    { key: 'description', label: 'Description' },
    { key: 'timeSpent', label: 'Time Spent (minutes)' },
    { key: 'nextServiceDate', label: 'Next Service Date' },
    { key: 'customerSignature', label: 'Customer Signature' },
    { key: 'completionDate', label: 'Completion Date' },
    { key: 'notes', label: 'Notes' },
  ],
  filename: `service_visits_export_${new Date().toISOString().split('T')[0]}.csv`
}

/**
 * Contracts export configuration
 */
export const contractExportConfig = {
  headers: [
    { key: 'contractNumber', label: 'Contract Number' },
    { key: 'type', label: 'Type' },
    { key: 'deviceId', label: 'Device ID' },
    { key: 'deviceType', label: 'Device Type' },
    { key: 'facilityName', label: 'Facility' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'status', label: 'Status' },
    { key: 'value', label: 'Value' },
    { key: 'currency', label: 'Currency' },
    { key: 'serviceFrequency', label: 'Service Frequency' },
    { key: 'contactPerson', label: 'Contact Person' },
    { key: 'contactEmail', label: 'Contact Email' },
    { key: 'contactPhone', label: 'Contact Phone' },
    { key: 'vendor', label: 'Vendor' },
    { key: 'vendorContact', label: 'Vendor Contact' },
    { key: 'autoRenewal', label: 'Auto Renewal' },
    { key: 'notes', label: 'Notes' },
  ],
  filename: `contracts_export_${new Date().toISOString().split('T')[0]}.csv`
}

/**
 * Photo logs export configuration
 */
export const photoLogExportConfig = {
  headers: [
    { key: 'filename', label: 'Filename' },
    { key: 'description', label: 'Description' },
    { key: 'deviceId', label: 'Device ID' },
    { key: 'deviceType', label: 'Device Type' },
    { key: 'facilityName', label: 'Facility' },
    { key: 'category', label: 'Category' },
    { key: 'uploadDate', label: 'Upload Date' },
    { key: 'uploadedBy', label: 'Uploaded By' },
    { key: 'location', label: 'Location' },
    { key: 'isAlert', label: 'Is Alert' },
    { key: 'alertLevel', label: 'Alert Level' },
    { key: 'tags', label: 'Tags' },
    { key: 'notes', label: 'Notes' },
  ],
  filename: `photo_logs_export_${new Date().toISOString().split('T')[0]}.csv`
}

/**
 * Facilities export configuration
 */
export const facilityExportConfig = {
  headers: [
    { key: 'id', label: 'Facility ID' },
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'address.street', label: 'Street Address' },
    { key: 'address.city', label: 'City' },
    { key: 'address.state', label: 'State' },
    { key: 'address.zipCode', label: 'ZIP Code' },
    { key: 'address.country', label: 'Country' },
    { key: 'contactInfo.phone', label: 'Phone' },
    { key: 'contactInfo.email', label: 'Email' },
    { key: 'primaryContact.name', label: 'Primary Contact' },
    { key: 'primaryContact.email', label: 'Primary Contact Email' },
    { key: 'technicalContact.name', label: 'Technical Contact' },
    { key: 'technicalContact.email', label: 'Technical Contact Email' },
    { key: 'status', label: 'Status' },
    { key: 'deviceCount', label: 'Device Count' },
    { key: 'lastVisitDate', label: 'Last Visit Date' },
    { key: 'notes', label: 'Notes' },
  ],
  filename: `facilities_export_${new Date().toISOString().split('T')[0]}.csv`
}

/**
 * Export devices data
 */
export const exportDevices = (devices) => {
  exportToCSV(devices, deviceExportConfig.headers, deviceExportConfig.filename)
}

/**
 * Export installations data
 */
export const exportInstallations = (installations) => {
  exportToCSV(installations, installationExportConfig.headers, installationExportConfig.filename)
}

/**
 * Export service visits data
 */
export const exportServiceVisits = (serviceVisits) => {
  exportToCSV(serviceVisits, serviceVisitExportConfig.headers, serviceVisitExportConfig.filename)
}

/**
 * Export contracts data
 */
export const exportContracts = (contracts) => {
  exportToCSV(contracts, contractExportConfig.headers, contractExportConfig.filename)
}

/**
 * Export photo logs data
 */
export const exportPhotoLogs = (photoLogs) => {
  // Transform tags array to string for CSV
  const transformedData = photoLogs.map(photo => ({
    ...photo,
    tags: photo.tags.join(', '),
    isAlert: photo.isAlert ? 'Yes' : 'No',
  }))
  
  exportToCSV(transformedData, photoLogExportConfig.headers, photoLogExportConfig.filename)
}

/**
 * Export facilities data
 */
export const exportFacilities = (facilities) => {
  exportToCSV(facilities, facilityExportConfig.headers, facilityExportConfig.filename)
}

/**
 * Export all data as separate CSV files in a ZIP (requires additional library)
 * This is a placeholder for future implementation
 */
export const exportAllData = (data) => {
  // This would require a library like JSZip to create a ZIP file
  // For now, we'll export each dataset separately
  
  if (data.devices && data.devices.length > 0) {
    exportDevices(data.devices)
  }
  
  if (data.installations && data.installations.length > 0) {
    exportInstallations(data.installations)
  }
  
  if (data.serviceVisits && data.serviceVisits.length > 0) {
    exportServiceVisits(data.serviceVisits)
  }
  
  if (data.contracts && data.contracts.length > 0) {
    exportContracts(data.contracts)
  }
  
  if (data.photoLogs && data.photoLogs.length > 0) {
    exportPhotoLogs(data.photoLogs)
  }
  
  if (data.facilities && data.facilities.length > 0) {
    exportFacilities(data.facilities)
  }
}
