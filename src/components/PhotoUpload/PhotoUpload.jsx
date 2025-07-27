import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  TextField,
  Chip,
  Alert,
  LinearProgress,
} from '@mui/material'
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  PhotoCamera as PhotoCameraIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material'
import {
  addInstallationPhoto,
  removeInstallationPhoto,
  selectInstallationById,
} from '../../store/slices/installationsSlice'
import {
  addServicePhoto,
  removeServicePhoto,
  selectServiceVisitById,
} from '../../store/slices/serviceVisitsSlice'
import {
  addPhotoLog,
  selectPhotoLogsByInstallation,
  selectPhotoLogsByServiceVisit,
} from '../../store/slices/photoLogsSlice'

function PhotoUpload({ 
  open, 
  onClose, 
  installationId, 
  serviceVisitId, 
  deviceId,
  title = "Photo Upload" 
}) {
  const dispatch = useDispatch()
  const fileInputRef = useRef(null)
  
  const installation = useSelector(state => 
    installationId ? selectInstallationById(state, installationId) : null
  )
  const serviceVisit = useSelector(state => 
    serviceVisitId ? selectServiceVisitById(state, serviceVisitId) : null
  )
  const installationPhotos = useSelector(state => 
    installationId ? selectPhotoLogsByInstallation(state, installationId) : []
  )
  const servicePhotos = useSelector(state => 
    serviceVisitId ? selectPhotoLogsByServiceVisit(state, serviceVisitId) : []
  )
  
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [previewPhotos, setPreviewPhotos] = useState([])

  // Get existing photos based on context
  const existingPhotos = installationId 
    ? (installation?.photos || [])
    : serviceVisitId 
    ? (serviceVisit?.photos || [])
    : []

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files)
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/')
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit
      return isValidType && isValidSize
    })

    if (validFiles.length !== files.length) {
      // Show error for invalid files
      console.warn('Some files were rejected (invalid type or too large)')
    }

    setSelectedFiles(validFiles)
    
    // Create preview URLs
    const previews = validFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
      description: '',
    }))
    setPreviewPhotos(previews)
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    setUploading(true)
    
    try {
      for (const preview of previewPhotos) {
        const photoData = {
          filename: `${Date.now()}_${preview.file.name}`,
          originalName: preview.file.name,
          description: preview.description || `Photo uploaded on ${new Date().toLocaleDateString()}`,
          fileSize: preview.file.size,
          mimeType: preview.file.type,
          uploadedBy: 'Current User', // In a real app, this would come from auth
        }

        if (installationId) {
          // Add to installation photos
          dispatch(addInstallationPhoto({
            installationId,
            photo: photoData,
          }))
          
          // Also add to photo logs
          dispatch(addPhotoLog({
            ...photoData,
            deviceId: installation?.deviceId,
            deviceType: installation?.deviceType,
            facilityId: installation?.facilityId,
            facilityName: installation?.facilityName,
            category: 'Installation',
            relatedInstallationId: installationId,
            location: 'Installation Site',
            tags: ['installation', 'setup'],
          }))
        } else if (serviceVisitId) {
          // Add to service visit photos
          dispatch(addServicePhoto({
            visitId: serviceVisitId,
            photo: photoData,
          }))
          
          // Also add to photo logs
          dispatch(addPhotoLog({
            ...photoData,
            deviceId: serviceVisit?.deviceId,
            deviceType: serviceVisit?.deviceType,
            facilityId: serviceVisit?.facilityId,
            facilityName: serviceVisit?.facilityName,
            category: 'Service Visit',
            relatedServiceVisitId: serviceVisitId,
            location: 'Service Location',
            tags: ['service', serviceVisit?.purpose?.toLowerCase()],
          }))
        } else if (deviceId) {
          // Add directly to photo logs
          dispatch(addPhotoLog({
            ...photoData,
            deviceId,
            category: 'General',
            tags: ['general'],
          }))
        }
      }
      
      // Clean up
      previewPhotos.forEach(preview => URL.revokeObjectURL(preview.url))
      setSelectedFiles([])
      setPreviewPhotos([])
      
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleRemovePhoto = (photoId) => {
    if (installationId) {
      dispatch(removeInstallationPhoto({ installationId, photoId }))
    } else if (serviceVisitId) {
      dispatch(removeServicePhoto({ visitId: serviceVisitId, photoId }))
    }
  }

  const handleRemovePreview = (index) => {
    const newPreviews = [...previewPhotos]
    URL.revokeObjectURL(newPreviews[index].url)
    newPreviews.splice(index, 1)
    setPreviewPhotos(newPreviews)
    
    const newFiles = [...selectedFiles]
    newFiles.splice(index, 1)
    setSelectedFiles(newFiles)
  }

  const updatePreviewDescription = (index, description) => {
    const newPreviews = [...previewPhotos]
    newPreviews[index].description = description
    setPreviewPhotos(newPreviews)
  }

  const handleClose = () => {
    // Clean up preview URLs
    previewPhotos.forEach(preview => URL.revokeObjectURL(preview.url))
    setSelectedFiles([])
    setPreviewPhotos([])
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {/* Upload Area */}
        <Box
          sx={{
            border: '2px dashed',
            borderColor: 'primary.main',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            mb: 3,
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="h6" gutterBottom>
            Click to upload photos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Supports: JPG, PNG, GIF (Max 10MB each)
          </Typography>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
        </Box>

        {/* Upload Progress */}
        {uploading && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              Uploading photos...
            </Typography>
            <LinearProgress />
          </Box>
        )}

        {/* Preview Selected Photos */}
        {previewPhotos.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Selected Photos ({previewPhotos.length})
            </Typography>
            <Grid container spacing={2}>
              {previewPhotos.map((preview, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={preview.url}
                      alt={`Preview ${index + 1}`}
                    />
                    <CardContent>
                      <TextField
                        fullWidth
                        size="small"
                        label="Description"
                        value={preview.description}
                        onChange={(e) => updatePreviewDescription(index, e.target.value)}
                        placeholder="Add photo description..."
                      />
                    </CardContent>
                    <CardActions>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemovePreview(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Existing Photos */}
        {existingPhotos.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Existing Photos ({existingPhotos.length})
            </Typography>
            <Grid container spacing={2}>
              {existingPhotos.map((photo) => (
                <Grid item xs={12} sm={6} md={4} key={photo.id}>
                  <Card>
                    <CardMedia
                      component="div"
                      height="140"
                      sx={{
                        bgcolor: 'grey.200',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PhotoCameraIcon sx={{ fontSize: 48, color: 'grey.500' }} />
                    </CardMedia>
                    <CardContent>
                      <Typography variant="body2" noWrap>
                        {photo.filename}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {photo.description}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label={new Date(photo.uploadDate).toLocaleDateString()}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </CardContent>
                    <CardActions>
                      <IconButton size="small" color="primary">
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemovePhoto(photo.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {existingPhotos.length === 0 && previewPhotos.length === 0 && (
          <Alert severity="info">
            No photos uploaded yet. Click the upload area above to add photos.
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        {previewPhotos.length > 0 && (
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={uploading}
            startIcon={<CloudUploadIcon />}
          >
            Upload {previewPhotos.length} Photo{previewPhotos.length > 1 ? 's' : ''}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default PhotoUpload
