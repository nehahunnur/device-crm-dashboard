import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Tooltip,
  Alert,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Battery1Bar,
  Battery2Bar,
  Battery3Bar,
  Battery4Bar,
  Battery5Bar,
  Battery6Bar,
  BatteryFull,
  Circle as CircleIcon,
} from '@mui/icons-material'
import {
  selectFilteredDevices,
  selectSearchTerm,
  selectFilterStatus,
  selectFilterFacility,
  setSearchTerm,
  setFilterStatus,
  setFilterFacility,
  deleteDevice,
} from '../../store/slices/devicesSlice'
import { selectAllFacilities } from '../../store/slices/facilitiesSlice'
import DeviceForm from '../../components/DeviceForm/DeviceForm'
import { exportDevices } from '../../utils/csvExport'

function DeviceInventory() {
  const dispatch = useDispatch()
  const devices = useSelector(selectFilteredDevices) || []
  const searchTerm = useSelector(selectSearchTerm) || ''
  const filterStatus = useSelector(selectFilterStatus) || 'All'
  const filterFacility = useSelector(selectFilterFacility) || 'All'
  const facilities = useSelector(selectAllFacilities) || []
  
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deviceToDelete, setDeviceToDelete] = useState(null)

  const handleAddDevice = () => {
    setSelectedDevice(null)
    setOpenDialog(true)
  }

  const handleEditDevice = (device) => {
    setSelectedDevice(device)
    setOpenDialog(true)
  }

  const handleDeleteDevice = (device) => {
    setDeviceToDelete(device)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = () => {
    if (deviceToDelete) {
      dispatch(deleteDevice(deviceToDelete.id))
      setDeleteConfirmOpen(false)
      setDeviceToDelete(null)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Online':
        return 'success'
      case 'Offline':
        return 'error'
      case 'Maintenance':
        return 'warning'
      default:
        return 'default'
    }
  }

  const getBatteryIcon = (level) => {
    if (level >= 90) return <BatteryFull color="success" />
    if (level >= 75) return <Battery6Bar color="success" />
    if (level >= 60) return <Battery5Bar color="success" />
    if (level >= 45) return <Battery4Bar color="warning" />
    if (level >= 30) return <Battery3Bar color="warning" />
    if (level >= 15) return <Battery2Bar color="error" />
    return <Battery1Bar color="error" />
  }

  const getAMCStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success'
      case 'Expiring Soon':
        return 'warning'
      case 'Expired':
        return 'error'
      default:
        return 'default'
    }
  }

  const statusOptions = ['All', 'Online', 'Offline', 'Maintenance']
  const facilityOptions = ['All', ...facilities.map(f => f.name)]

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Device Inventory</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => exportDevices(devices)}
            disabled={devices.length === 0}
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddDevice}
          >
            Add Device
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Search devices..."
                value={searchTerm}
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e) => dispatch(setFilterStatus(e.target.value))}
                >
                  {statusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <FormControl fullWidth>
                <InputLabel>Facility</InputLabel>
                <Select
                  value={filterFacility}
                  label="Facility"
                  onChange={(e) => dispatch(setFilterFacility(e.target.value))}
                >
                  {facilityOptions.map((facility) => (
                    <MenuItem key={facility} value={facility}>
                      {facility}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <Alert severity="info" sx={{ py: 0.5 }}>
                Showing {devices.length} device{devices.length !== 1 ? 's' : ''}
              </Alert>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Device Cards */}
      <Grid container spacing={3}>
        {devices.map((device) => (
          <Grid item xs={12} sm={6} md={4} key={device.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="div" noWrap>
                    {device.deviceId}
                  </Typography>
                  <Chip
                    icon={<CircleIcon sx={{ fontSize: 12 }} />}
                    label={device.status}
                    color={getStatusColor(device.status)}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {device.type} - {device.model}
                </Typography>
                
                <Typography variant="body2" gutterBottom>
                  <strong>Facility:</strong> {device.facilityName}
                </Typography>
                
                <Typography variant="body2" gutterBottom>
                  <strong>Location:</strong> {device.location}
                </Typography>
                
                <Typography variant="body2" gutterBottom>
                  <strong>Serial:</strong> {device.serialNumber}
                </Typography>

                {/* Battery Level */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                  {getBatteryIcon(device.batteryLevel)}
                  <Typography variant="body2">
                    {device.batteryLevel}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={device.batteryLevel}
                    sx={{ flexGrow: 1, ml: 1 }}
                    color={device.batteryLevel > 30 ? 'success' : device.batteryLevel > 15 ? 'warning' : 'error'}
                  />
                </Box>

                {/* Contract Status */}
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Chip
                    label={`AMC: ${device.amcStatus}`}
                    color={getAMCStatusColor(device.amcStatus)}
                    size="small"
                  />
                  <Chip
                    label={`CMC: ${device.cmcStatus}`}
                    color={getAMCStatusColor(device.cmcStatus)}
                    size="small"
                  />
                </Box>

                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                  Last Service: {device.lastServiceDate}
                </Typography>
              </CardContent>
              
              <CardActions>
                <Tooltip title="Edit Device">
                  <IconButton
                    size="small"
                    onClick={() => handleEditDevice(device)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Device">
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteDevice(device)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {devices.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No devices found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Try adjusting your search criteria or add a new device
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddDevice}>
            Add First Device
          </Button>
        </Box>
      )}

      {/* Device Form Dialog */}
      <DeviceForm
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        device={selectedDevice}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete device "{deviceToDelete?.deviceId}"? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default DeviceInventory
