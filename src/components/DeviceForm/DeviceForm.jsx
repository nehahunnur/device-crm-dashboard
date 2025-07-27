import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  Box,
  Alert,
} from '@mui/material'
import { addDevice, updateDevice } from '../../store/slices/devicesSlice'
import { selectAllFacilities } from '../../store/slices/facilitiesSlice'

const deviceTypes = [
  'Ventilator',
  'Patient Monitor',
  'Defibrillator',
  'Infusion Pump',
  'ECG Machine',
  'Ultrasound',
  'X-Ray Machine',
  'CT Scanner',
  'MRI Machine',
  'Dialysis Machine',
  'Anesthesia Machine',
  'Blood Gas Analyzer',
  'Other',
]

const statusOptions = ['Online', 'Offline', 'Maintenance']
const contractStatusOptions = ['Active', 'Expiring Soon', 'Expired', 'Not Applicable']

function DeviceForm({ open, onClose, device }) {
  const dispatch = useDispatch()
  const facilities = useSelector(selectAllFacilities) || []
  
  const [formData, setFormData] = useState({
    deviceId: '',
    type: '',
    model: '',
    serialNumber: '',
    facilityId: '',
    facilityName: '',
    status: 'Online',
    batteryLevel: 100,
    location: '',
    manufacturer: '',
    purchaseDate: '',
    warrantyExpiry: '',
    amcStatus: 'Not Applicable',
    cmcStatus: 'Not Applicable',
    notes: '',
  })
  
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (device) {
      setFormData({
        deviceId: device.deviceId || '',
        type: device.type || '',
        model: device.model || '',
        serialNumber: device.serialNumber || '',
        facilityId: device.facilityId || '',
        facilityName: device.facilityName || '',
        status: device.status || 'Online',
        batteryLevel: device.batteryLevel || 100,
        location: device.location || '',
        manufacturer: device.manufacturer || '',
        purchaseDate: device.purchaseDate || '',
        warrantyExpiry: device.warrantyExpiry || '',
        amcStatus: device.amcStatus || 'Not Applicable',
        cmcStatus: device.cmcStatus || 'Not Applicable',
        notes: device.notes || '',
      })
    } else {
      setFormData({
        deviceId: '',
        type: '',
        model: '',
        serialNumber: '',
        facilityId: '',
        facilityName: '',
        status: 'Online',
        batteryLevel: 100,
        location: '',
        manufacturer: '',
        purchaseDate: '',
        warrantyExpiry: '',
        amcStatus: 'Not Applicable',
        cmcStatus: 'Not Applicable',
        notes: '',
      })
    }
    setErrors({})
  }, [device, open])

  const handleChange = (field) => (event) => {
    const value = event.target.value
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
    
    // Update facility name when facility is selected
    if (field === 'facilityId') {
      const selectedFacility = facilities.find(f => f.id === value)
      setFormData(prev => ({
        ...prev,
        facilityId: value,
        facilityName: selectedFacility ? selectedFacility.name : '',
      }))
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }))
    }
  }

  const handleBatteryChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      batteryLevel: newValue,
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.deviceId.trim()) {
      newErrors.deviceId = 'Device ID is required'
    }
    
    if (!formData.type) {
      newErrors.type = 'Device type is required'
    }
    
    if (!formData.model.trim()) {
      newErrors.model = 'Model is required'
    }
    
    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = 'Serial number is required'
    }
    
    if (!formData.facilityId) {
      newErrors.facilityId = 'Facility is required'
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }
    
    if (!formData.manufacturer.trim()) {
      newErrors.manufacturer = 'Manufacturer is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }

    const deviceData = {
      ...formData,
      lastServiceDate: device?.lastServiceDate || new Date().toISOString().split('T')[0],
      lastInstallationDate: device?.lastInstallationDate || new Date().toISOString().split('T')[0],
    }

    if (device) {
      dispatch(updateDevice({ id: device.id, ...deviceData }))
    } else {
      dispatch(addDevice(deviceData))
    }
    
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {device ? 'Edit Device' : 'Add New Device'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Device ID"
              value={formData.deviceId}
              onChange={handleChange('deviceId')}
              error={!!errors.deviceId}
              helperText={errors.deviceId}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.type} required>
              <InputLabel>Device Type</InputLabel>
              <Select
                value={formData.type}
                label="Device Type"
                onChange={handleChange('type')}
              >
                {deviceTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              {errors.type && (
                <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                  {errors.type}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Model"
              value={formData.model}
              onChange={handleChange('model')}
              error={!!errors.model}
              helperText={errors.model}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Serial Number"
              value={formData.serialNumber}
              onChange={handleChange('serialNumber')}
              error={!!errors.serialNumber}
              helperText={errors.serialNumber}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.facilityId} required>
              <InputLabel>Facility</InputLabel>
              <Select
                value={formData.facilityId}
                label="Facility"
                onChange={handleChange('facilityId')}
              >
                {facilities.map((facility) => (
                  <MenuItem key={facility.id} value={facility.id}>
                    {facility.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.facilityId && (
                <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                  {errors.facilityId}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Location"
              value={formData.location}
              onChange={handleChange('location')}
              error={!!errors.location}
              helperText={errors.location}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Manufacturer"
              value={formData.manufacturer}
              onChange={handleChange('manufacturer')}
              error={!!errors.manufacturer}
              helperText={errors.manufacturer}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={handleChange('status')}
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom>
              Battery Level: {formData.batteryLevel}%
            </Typography>
            <Slider
              value={formData.batteryLevel}
              onChange={handleBatteryChange}
              min={0}
              max={100}
              step={5}
              marks={[
                { value: 0, label: '0%' },
                { value: 25, label: '25%' },
                { value: 50, label: '50%' },
                { value: 75, label: '75%' },
                { value: 100, label: '100%' },
              ]}
              color={formData.batteryLevel > 30 ? 'success' : formData.batteryLevel > 15 ? 'warning' : 'error'}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Purchase Date"
              type="date"
              value={formData.purchaseDate}
              onChange={handleChange('purchaseDate')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Warranty Expiry"
              type="date"
              value={formData.warrantyExpiry}
              onChange={handleChange('warrantyExpiry')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>AMC Status</InputLabel>
              <Select
                value={formData.amcStatus}
                label="AMC Status"
                onChange={handleChange('amcStatus')}
              >
                {contractStatusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>CMC Status</InputLabel>
              <Select
                value={formData.cmcStatus}
                label="CMC Status"
                onChange={handleChange('cmcStatus')}
              >
                {contractStatusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={formData.notes}
              onChange={handleChange('notes')}
            />
          </Grid>
        </Grid>
        
        {Object.keys(errors).length > 0 && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Please fix the errors above before submitting.
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {device ? 'Update' : 'Add'} Device
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeviceForm
