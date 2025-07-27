// Validation utility functions

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
}

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== ''
}

export const validateMinLength = (value, minLength) => {
  return value && value.toString().length >= minLength
}

export const validateMaxLength = (value, maxLength) => {
  return !value || value.toString().length <= maxLength
}

export const validateNumber = (value, min = null, max = null) => {
  const num = parseFloat(value)
  if (isNaN(num)) return false
  if (min !== null && num < min) return false
  if (max !== null && num > max) return false
  return true
}

export const validateDate = (date) => {
  const dateObj = new Date(date)
  return dateObj instanceof Date && !isNaN(dateObj)
}

export const validateFutureDate = (date) => {
  const dateObj = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return dateObj >= today
}

export const validatePastDate = (date) => {
  const dateObj = new Date(date)
  const today = new Date()
  today.setHours(23, 59, 59, 999)
  return dateObj <= today
}

export const validateDateRange = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return start <= end
}

export const validateDeviceId = (deviceId) => {
  // Device ID should be alphanumeric with optional hyphens
  const deviceIdRegex = /^[A-Za-z0-9\-]+$/
  return deviceIdRegex.test(deviceId)
}

export const validateSerialNumber = (serialNumber) => {
  // Serial number should be alphanumeric
  const serialRegex = /^[A-Za-z0-9]+$/
  return serialRegex.test(serialNumber)
}

export const validateContractNumber = (contractNumber) => {
  // Contract number format: TYPE-YYYY-NNN
  const contractRegex = /^(AMC|CMC)-\d{4}-\d{3}$/
  return contractRegex.test(contractNumber)
}

// Device form validation
export const validateDeviceForm = (formData) => {
  const errors = {}

  if (!validateRequired(formData.deviceId)) {
    errors.deviceId = 'Device ID is required'
  } else if (!validateDeviceId(formData.deviceId)) {
    errors.deviceId = 'Device ID must be alphanumeric with optional hyphens'
  }

  if (!validateRequired(formData.type)) {
    errors.type = 'Device type is required'
  }

  if (!validateRequired(formData.model)) {
    errors.model = 'Model is required'
  } else if (!validateMaxLength(formData.model, 100)) {
    errors.model = 'Model must be less than 100 characters'
  }

  if (!validateRequired(formData.serialNumber)) {
    errors.serialNumber = 'Serial number is required'
  } else if (!validateSerialNumber(formData.serialNumber)) {
    errors.serialNumber = 'Serial number must be alphanumeric'
  }

  if (!validateRequired(formData.facilityId)) {
    errors.facilityId = 'Facility is required'
  }

  if (!validateRequired(formData.location)) {
    errors.location = 'Location is required'
  }

  if (!validateRequired(formData.manufacturer)) {
    errors.manufacturer = 'Manufacturer is required'
  }

  if (!validateNumber(formData.batteryLevel, 0, 100)) {
    errors.batteryLevel = 'Battery level must be between 0 and 100'
  }

  if (formData.purchaseDate && !validateDate(formData.purchaseDate)) {
    errors.purchaseDate = 'Invalid purchase date'
  }

  if (formData.warrantyExpiry && !validateDate(formData.warrantyExpiry)) {
    errors.warrantyExpiry = 'Invalid warranty expiry date'
  }

  if (formData.purchaseDate && formData.warrantyExpiry) {
    if (!validateDateRange(formData.purchaseDate, formData.warrantyExpiry)) {
      errors.warrantyExpiry = 'Warranty expiry must be after purchase date'
    }
  }

  return errors
}

// Installation form validation
export const validateInstallationForm = (formData) => {
  const errors = {}

  if (!validateRequired(formData.deviceId)) {
    errors.deviceId = 'Device is required'
  }

  if (!validateRequired(formData.installationDate)) {
    errors.installationDate = 'Installation date is required'
  } else if (!validateDate(formData.installationDate)) {
    errors.installationDate = 'Invalid installation date'
  }

  if (!validateRequired(formData.engineerId)) {
    errors.engineerId = 'Engineer ID is required'
  }

  if (!validateRequired(formData.engineerName)) {
    errors.engineerName = 'Engineer name is required'
  }

  return errors
}

// Service visit form validation
export const validateServiceVisitForm = (formData) => {
  const errors = {}

  if (!validateRequired(formData.deviceId)) {
    errors.deviceId = 'Device is required'
  }

  if (!validateRequired(formData.visitDate)) {
    errors.visitDate = 'Visit date is required'
  } else if (!validateDate(formData.visitDate)) {
    errors.visitDate = 'Invalid visit date'
  }

  if (!validateRequired(formData.engineerId)) {
    errors.engineerId = 'Engineer ID is required'
  }

  if (!validateRequired(formData.engineerName)) {
    errors.engineerName = 'Engineer name is required'
  }

  if (!validateRequired(formData.purpose)) {
    errors.purpose = 'Purpose is required'
  }

  if (!validateRequired(formData.description)) {
    errors.description = 'Description is required'
  }

  if (formData.timeSpent && !validateNumber(formData.timeSpent, 0)) {
    errors.timeSpent = 'Time spent must be a positive number'
  }

  if (formData.nextServiceDate && !validateDate(formData.nextServiceDate)) {
    errors.nextServiceDate = 'Invalid next service date'
  }

  if (formData.visitDate && formData.nextServiceDate) {
    if (!validateDateRange(formData.visitDate, formData.nextServiceDate)) {
      errors.nextServiceDate = 'Next service date must be after visit date'
    }
  }

  return errors
}

// Contract form validation
export const validateContractForm = (formData) => {
  const errors = {}

  if (!validateRequired(formData.contractNumber)) {
    errors.contractNumber = 'Contract number is required'
  } else if (!validateContractNumber(formData.contractNumber)) {
    errors.contractNumber = 'Contract number format: AMC-YYYY-NNN or CMC-YYYY-NNN'
  }

  if (!validateRequired(formData.type)) {
    errors.type = 'Contract type is required'
  }

  if (!validateRequired(formData.deviceId)) {
    errors.deviceId = 'Device is required'
  }

  if (!validateRequired(formData.startDate)) {
    errors.startDate = 'Start date is required'
  } else if (!validateDate(formData.startDate)) {
    errors.startDate = 'Invalid start date'
  }

  if (!validateRequired(formData.endDate)) {
    errors.endDate = 'End date is required'
  } else if (!validateDate(formData.endDate)) {
    errors.endDate = 'Invalid end date'
  }

  if (formData.startDate && formData.endDate) {
    if (!validateDateRange(formData.startDate, formData.endDate)) {
      errors.endDate = 'End date must be after start date'
    }
  }

  if (!validateNumber(formData.value, 0)) {
    errors.value = 'Contract value must be a positive number'
  }

  if (!validateRequired(formData.contactPerson)) {
    errors.contactPerson = 'Contact person is required'
  }

  if (formData.contactEmail && !validateEmail(formData.contactEmail)) {
    errors.contactEmail = 'Invalid email address'
  }

  if (formData.contactPhone && !validatePhone(formData.contactPhone)) {
    errors.contactPhone = 'Invalid phone number'
  }

  if (!validateRequired(formData.vendor)) {
    errors.vendor = 'Vendor is required'
  }

  if (formData.vendorContact && !validateEmail(formData.vendorContact)) {
    errors.vendorContact = 'Invalid vendor contact email'
  }

  return errors
}

// Photo upload validation
export const validatePhotoUpload = (file) => {
  const errors = []

  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']

  if (!allowedTypes.includes(file.type)) {
    errors.push('File type not supported. Please upload JPEG, PNG, or GIF images.')
  }

  if (file.size > maxSize) {
    errors.push('File size too large. Maximum size is 10MB.')
  }

  return errors
}

// Facility form validation
export const validateFacilityForm = (formData) => {
  const errors = {}

  if (!validateRequired(formData.name)) {
    errors.name = 'Facility name is required'
  }

  if (!validateRequired(formData.type)) {
    errors.type = 'Facility type is required'
  }

  if (!validateRequired(formData.address?.street)) {
    errors.street = 'Street address is required'
  }

  if (!validateRequired(formData.address?.city)) {
    errors.city = 'City is required'
  }

  if (!validateRequired(formData.address?.zipCode)) {
    errors.zipCode = 'ZIP code is required'
  }

  if (formData.contactInfo?.email && !validateEmail(formData.contactInfo.email)) {
    errors.email = 'Invalid email address'
  }

  if (formData.contactInfo?.phone && !validatePhone(formData.contactInfo.phone)) {
    errors.phone = 'Invalid phone number'
  }

  if (formData.primaryContact?.email && !validateEmail(formData.primaryContact.email)) {
    errors.primaryEmail = 'Invalid primary contact email'
  }

  if (formData.technicalContact?.email && !validateEmail(formData.technicalContact.email)) {
    errors.technicalEmail = 'Invalid technical contact email'
  }

  return errors
}
