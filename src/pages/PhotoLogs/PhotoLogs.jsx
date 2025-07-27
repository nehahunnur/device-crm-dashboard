import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Checkbox,
  FormControlLabel,
  Fab,
  Badge,
} from '@mui/material'
import {
  Add as AddIcon,
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
  Warning as WarningIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
} from '@mui/icons-material'
import {
  selectFilteredPhotoLogs,
  selectPhotoFilters,
  selectAlertPhotos,
  setPhotoFilters,
  clearPhotoFilters,
  deletePhotoLog,
  updatePhotoAlert,
  addPhotoLog,
} from '../../store/slices/photoLogsSlice'
import { selectAllDevices } from '../../store/slices/devicesSlice'
import PhotoUpload from '../../components/PhotoUpload/PhotoUpload'

const categories = [
  'All',
  'Condition Check',
  'Issue Documentation',
  'Installation',
  'Service Visit',
  'Maintenance',
  'General',
]

const alertLevels = ['All', 'Low', 'Medium', 'High', 'Critical']

function PhotoLogs() {
  const dispatch = useDispatch()
  const photoLogs = useSelector(selectFilteredPhotoLogs) || []
  const filters = useSelector(selectPhotoFilters) || {}
  const alertPhotos = useSelector(selectAlertPhotos) || []
  const devices = useSelector(selectAllDevices) || []
  
  const [openUploadDialog, setOpenUploadDialog] = useState(false)
  const [openFilterDialog, setOpenFilterDialog] = useState(false)
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [selectedPhotos, setSelectedPhotos] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [tempFilters, setTempFilters] = useState(filters || {
    deviceId: 'All',
    category: 'All',
    alertLevel: 'All',
    dateRange: { start: null, end: null }
  })

  const handleFilterChange = (field, value) => {
    setTempFilters(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleDateRangeChange = (field, value) => {
    setTempFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: value,
      },
    }))
  }

  const applyFilters = () => {
    dispatch(setPhotoFilters(tempFilters))
    setOpenFilterDialog(false)
  }

  const clearFilters = () => {
    dispatch(clearPhotoFilters())
    setTempFilters({
      deviceId: 'All',
      category: 'All',
      alertLevel: 'All',
      dateRange: {
        start: null,
        end: null,
      },
    })
    setOpenFilterDialog(false)
  }

  const handlePhotoSelect = (photoId) => {
    setSelectedPhotos(prev => {
      if (prev.includes(photoId)) {
        return prev.filter(id => id !== photoId)
      } else {
        return [...prev, photoId]
      }
    })
  }

  const handleBulkDelete = () => {
    selectedPhotos.forEach(photoId => {
      dispatch(deletePhotoLog(photoId))
    })
    setSelectedPhotos([])
  }

  const handleToggleAlert = (photo) => {
    dispatch(updatePhotoAlert({
      photoId: photo.id,
      isAlert: !photo.isAlert,
      alertLevel: photo.isAlert ? null : 'Medium',
    }))
  }

  const filteredBySearch = photoLogs.filter(photo => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      photo.description?.toLowerCase().includes(searchLower) ||
      photo.deviceId?.toLowerCase().includes(searchLower) ||
      photo.facilityName?.toLowerCase().includes(searchLower) ||
      photo.tags?.some(tag => tag?.toLowerCase().includes(searchLower))
    )
  })

  const getAlertColor = (alertLevel) => {
    switch (alertLevel) {
      case 'Low':
        return 'info'
      case 'Medium':
        return 'warning'
      case 'High':
        return 'error'
      case 'Critical':
        return 'error'
      default:
        return 'default'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Condition Check':
        return 'success'
      case 'Issue Documentation':
        return 'error'
      case 'Installation':
        return 'primary'
      case 'Service Visit':
        return 'info'
      case 'Maintenance':
        return 'warning'
      default:
        return 'default'
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Photo Documentation</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Badge badgeContent={alertPhotos.length} color="error">
            <Button
              variant="outlined"
              startIcon={<WarningIcon />}
              onClick={() => {
                dispatch(setPhotoFilters({ ...filters, alertLevel: 'All' }))
                setTempFilters({ ...filters, alertLevel: 'All' })
              }}
            >
              Alerts
            </Button>
          </Badge>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setOpenFilterDialog(true)}
          >
            Filters
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenUploadDialog(true)}
          >
            Upload Photos
          </Button>
        </Box>
      </Box>

      {/* Search Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            label="Search photos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedPhotos.length > 0 && (
        <Alert
          severity="info"
          sx={{ mb: 3 }}
          action={
            <Box>
              <Button color="inherit" size="small" onClick={handleBulkDelete}>
                Delete Selected ({selectedPhotos.length})
              </Button>
              <Button color="inherit" size="small" onClick={() => setSelectedPhotos([])}>
                Clear Selection
              </Button>
            </Box>
          }
        >
          {selectedPhotos.length} photo{selectedPhotos.length > 1 ? 's' : ''} selected
        </Alert>
      )}

      {/* Photo Grid */}
      <Grid container spacing={3}>
        {filteredBySearch.map((photo) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={photo.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="div"
                height="200"
                sx={{
                  bgcolor: 'grey.200',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <PhotoCameraIcon sx={{ fontSize: 48, color: 'grey.500' }} />
                
                {/* Selection Checkbox */}
                <Checkbox
                  checked={selectedPhotos.includes(photo.id)}
                  onChange={() => handlePhotoSelect(photo.id)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                />

                {/* Alert Badge */}
                {photo.isAlert && (
                  <Chip
                    icon={<WarningIcon />}
                    label={photo.alertLevel}
                    color={getAlertColor(photo.alertLevel)}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                    }}
                  />
                )}
              </CardMedia>
              
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div" noWrap>
                  {photo.filename}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {photo.description}
                </Typography>
                
                <Typography variant="body2" gutterBottom>
                  <strong>Device:</strong> {photo.deviceId}
                </Typography>
                
                <Typography variant="body2" gutterBottom>
                  <strong>Facility:</strong> {photo.facilityName}
                </Typography>
                
                <Typography variant="body2" gutterBottom>
                  <strong>Location:</strong> {photo.location}
                </Typography>

                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
                  <Chip
                    label={photo.category}
                    color={getCategoryColor(photo.category)}
                    size="small"
                  />
                  {photo.tags.slice(0, 2).map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                  {photo.tags.length > 2 && (
                    <Chip
                      label={`+${photo.tags.length - 2}`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>

                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                  Uploaded: {new Date(photo.uploadDate).toLocaleDateString()}
                </Typography>
                
                <Typography variant="caption" color="text.secondary">
                  By: {photo.uploadedBy}
                </Typography>
              </CardContent>
              
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => {
                    setSelectedPhoto(photo)
                    setOpenViewDialog(true)
                  }}
                  color="primary"
                >
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleToggleAlert(photo)}
                  color={photo.isAlert ? 'error' : 'default'}
                >
                  <WarningIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => dispatch(deletePhotoLog(photo.id))}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredBySearch.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No photos found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Try adjusting your search criteria or upload new photos
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenUploadDialog(true)}>
            Upload First Photo
          </Button>
        </Box>
      )}

      {/* Floating Action Button for Quick Upload */}
      <Fab
        color="primary"
        aria-label="upload"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={() => setOpenUploadDialog(true)}
      >
        <PhotoCameraIcon />
      </Fab>

      {/* Filter Dialog */}
      <Dialog open={openFilterDialog} onClose={() => setOpenFilterDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Filter Photos</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Device</InputLabel>
                <Select
                  value={tempFilters.deviceId}
                  label="Device"
                  onChange={(e) => handleFilterChange('deviceId', e.target.value)}
                >
                  <MenuItem value="All">All Devices</MenuItem>
                  {devices.map((device) => (
                    <MenuItem key={device.id} value={device.deviceId}>
                      {device.deviceId} - {device.type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={tempFilters.category}
                  label="Category"
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Alert Level</InputLabel>
                <Select
                  value={tempFilters.alertLevel}
                  label="Alert Level"
                  onChange={(e) => handleFilterChange('alertLevel', e.target.value)}
                >
                  {alertLevels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={tempFilters.dateRange.start || ''}
                onChange={(e) => handleDateRangeChange('start', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={tempFilters.dateRange.end || ''}
                onChange={(e) => handleDateRangeChange('end', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={clearFilters} startIcon={<ClearIcon />}>
            Clear All
          </Button>
          <Button onClick={() => setOpenFilterDialog(false)}>Cancel</Button>
          <Button onClick={applyFilters} variant="contained">
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>

      {/* Photo View Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Photo Details</DialogTitle>
        <DialogContent>
          {selectedPhoto && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    width: '100%',
                    height: 300,
                    bgcolor: 'grey.200',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                  }}
                >
                  <PhotoCameraIcon sx={{ fontSize: 64, color: 'grey.500' }} />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  {selectedPhoto.filename}
                </Typography>
                <Typography variant="body2" paragraph>
                  {selectedPhoto.description}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Device:</strong> {selectedPhoto.deviceId} ({selectedPhoto.deviceType})
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Facility:</strong> {selectedPhoto.facilityName}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Location:</strong> {selectedPhoto.location}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Category:</strong> {selectedPhoto.category}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Upload Date:</strong> {new Date(selectedPhoto.uploadDate).toLocaleString()}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Uploaded By:</strong> {selectedPhoto.uploadedBy}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>File Size:</strong> {(selectedPhoto.fileSize / 1024 / 1024).toFixed(2)} MB
                </Typography>
                {selectedPhoto.isAlert && (
                  <Alert severity={getAlertColor(selectedPhoto.alertLevel)} sx={{ mt: 2 }}>
                    Alert Level: {selectedPhoto.alertLevel}
                  </Alert>
                )}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Tags:</strong>
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {selectedPhoto.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
                {selectedPhoto.notes && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Notes:</strong>
                    </Typography>
                    <Typography variant="body2">
                      {selectedPhoto.notes}
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Photo Upload Dialog */}
      <PhotoUpload
        open={openUploadDialog}
        onClose={() => setOpenUploadDialog(false)}
        title="Upload Photos to Log"
      />
    </Box>
  )
}

export default PhotoLogs
