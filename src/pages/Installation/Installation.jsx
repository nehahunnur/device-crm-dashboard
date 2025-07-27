import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Box,
  Typography,
  Button,
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  LinearProgress,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  PhotoCamera as PhotoCameraIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material'
import {
  selectAllInstallations,
  addInstallation,
  updateInstallation,
  updateChecklist,
  updateTrainingStatus,
  deleteInstallation,
} from '../../store/slices/installationsSlice'
import { selectAllDevices } from '../../store/slices/devicesSlice'
import { selectAllFacilities } from '../../store/slices/facilitiesSlice'
import PhotoUpload from '../../components/PhotoUpload/PhotoUpload'

const checklistItems = [
  { key: 'unboxingPhotos', label: 'Unboxing Photos Taken' },
  { key: 'deviceInspection', label: 'Device Physical Inspection' },
  { key: 'powerConnection', label: 'Power Connection & Testing' },
  { key: 'networkSetup', label: 'Network Setup & Configuration' },
  { key: 'calibration', label: 'Device Calibration' },
  { key: 'userTraining', label: 'User Training Completed' },
  { key: 'documentation', label: 'Documentation Handover' },
  { key: 'finalTesting', label: 'Final Testing & Validation' },
]

function Installation() {
  const dispatch = useDispatch()
  const installations = useSelector(selectAllInstallations) || []
  const devices = useSelector(selectAllDevices) || []
  const facilities = useSelector(selectAllFacilities) || []
  
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedInstallation, setSelectedInstallation] = useState(null)
  const [openPhotoDialog, setOpenPhotoDialog] = useState(false)
  const [openTrainingDialog, setOpenTrainingDialog] = useState(false)
  const [formData, setFormData] = useState({
    deviceId: '',
    deviceType: '',
    facilityId: '',
    facilityName: '',
    installationDate: new Date().toISOString().split('T')[0],
    engineerId: '',
    engineerName: '',
    notes: '',
  })
  const [trainingData, setTrainingData] = useState({
    trainingDate: new Date().toISOString().split('T')[0],
    trainedPersonnel: [''],
  })

  const handleAddInstallation = () => {
    setSelectedInstallation(null)
    setFormData({
      deviceId: '',
      deviceType: '',
      facilityId: '',
      facilityName: '',
      installationDate: new Date().toISOString().split('T')[0],
      engineerId: '',
      engineerName: '',
      notes: '',
    })
    setOpenDialog(true)
  }

  const handleEditInstallation = (installation) => {
    setSelectedInstallation(installation)
    setFormData({
      deviceId: installation.deviceId,
      deviceType: installation.deviceType,
      facilityId: installation.facilityId,
      facilityName: installation.facilityName,
      installationDate: installation.installationDate,
      engineerId: installation.engineerId,
      engineerName: installation.engineerName,
      notes: installation.notes || '',
    })
    setOpenDialog(true)
  }

  const handleSubmit = () => {
    if (selectedInstallation) {
      dispatch(updateInstallation({ id: selectedInstallation.id, ...formData }))
    } else {
      dispatch(addInstallation(formData))
    }
    setOpenDialog(false)
  }

  const handleChecklistChange = (installationId, checklistItem, checked) => {
    dispatch(updateChecklist({
      id: installationId,
      checklistItem,
      value: checked,
    }))
  }

  const handleTrainingSubmit = () => {
    if (selectedInstallation) {
      dispatch(updateTrainingStatus({
        id: selectedInstallation.id,
        trainingCompleted: true,
        trainingDate: trainingData.trainingDate,
        trainedPersonnel: trainingData.trainedPersonnel.filter(person => person.trim()),
      }))
    }
    setOpenTrainingDialog(false)
  }

  const handleDeviceChange = (deviceId) => {
    const device = devices.find(d => d.id === deviceId)
    if (device) {
      setFormData(prev => ({
        ...prev,
        deviceId: device.deviceId,
        deviceType: device.type,
        facilityId: device.facilityId,
        facilityName: device.facilityName,
      }))
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success'
      case 'In Progress':
        return 'warning'
      default:
        return 'default'
    }
  }

  const getCompletionPercentage = (installation) => {
    const checklistCompleted = Object.values(installation.checklist).filter(Boolean).length
    const totalItems = Object.keys(installation.checklist).length
    const trainingWeight = installation.trainingCompleted ? 1 : 0
    return Math.round(((checklistCompleted + trainingWeight) / (totalItems + 1)) * 100)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Installation & Training</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddInstallation}
        >
          New Installation
        </Button>
      </Box>

      <Grid container spacing={3}>
        {installations.map((installation) => (
          <Grid item xs={12} md={6} lg={4} key={installation.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="div">
                    {installation.deviceId}
                  </Typography>
                  <Chip
                    label={installation.status}
                    color={getStatusColor(installation.status)}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {installation.deviceType}
                </Typography>
                
                <Typography variant="body2" gutterBottom>
                  <strong>Facility:</strong> {installation.facilityName}
                </Typography>
                
                <Typography variant="body2" gutterBottom>
                  <strong>Date:</strong> {installation.installationDate}
                </Typography>
                
                <Typography variant="body2" gutterBottom>
                  <strong>Engineer:</strong> {installation.engineerName}
                </Typography>

                {/* Progress */}
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Progress</Typography>
                    <Typography variant="body2">{getCompletionPercentage(installation)}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={getCompletionPercentage(installation)}
                    color={installation.status === 'Completed' ? 'success' : 'primary'}
                  />
                </Box>

                {/* Checklist Summary */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Installation Checklist
                  </Typography>
                  <List dense>
                    {checklistItems.slice(0, 4).map((item) => (
                      <ListItem key={item.key} sx={{ py: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Checkbox
                            edge="start"
                            checked={installation.checklist[item.key]}
                            onChange={(e) => handleChecklistChange(installation.id, item.key, e.target.checked)}
                            size="small"
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={item.label}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                    {checklistItems.length > 4 && (
                      <ListItem sx={{ py: 0 }}>
                        <ListItemText
                          primary={`+${checklistItems.length - 4} more items...`}
                          primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                        />
                      </ListItem>
                    )}
                  </List>
                </Box>

                {/* Training Status */}
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SchoolIcon color={installation.trainingCompleted ? 'success' : 'disabled'} />
                    <Typography variant="body2">
                      Training: {installation.trainingCompleted ? 'Completed' : 'Pending'}
                    </Typography>
                  </Box>
                  {installation.trainingCompleted && installation.trainedPersonnel && (
                    <Typography variant="caption" color="text.secondary">
                      {installation.trainedPersonnel.length} personnel trained
                    </Typography>
                  )}
                </Box>
              </CardContent>
              
              <CardActions>
                <Button
                  size="small"
                  startIcon={<PhotoCameraIcon />}
                  onClick={() => {
                    setSelectedInstallation(installation)
                    setOpenPhotoDialog(true)
                  }}
                >
                  Photos ({installation.photos?.length || 0})
                </Button>
                <Button
                  size="small"
                  startIcon={<SchoolIcon />}
                  onClick={() => {
                    setSelectedInstallation(installation)
                    setTrainingData({
                      trainingDate: installation.trainingDate || new Date().toISOString().split('T')[0],
                      trainedPersonnel: installation.trainedPersonnel || [''],
                    })
                    setOpenTrainingDialog(true)
                  }}
                  disabled={installation.trainingCompleted}
                >
                  Training
                </Button>
                <IconButton
                  size="small"
                  onClick={() => handleEditInstallation(installation)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => dispatch(deleteInstallation(installation.id))}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {installations.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No installations found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Start by creating a new installation record
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddInstallation}>
            Create First Installation
          </Button>
        </Box>
      )}

      {/* Installation Form Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedInstallation ? 'Edit Installation' : 'New Installation'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Device</InputLabel>
                <Select
                  value={devices.find(d => d.deviceId === formData.deviceId)?.id || ''}
                  label="Device"
                  onChange={(e) => handleDeviceChange(e.target.value)}
                >
                  {devices.map((device) => (
                    <MenuItem key={device.id} value={device.id}>
                      {device.deviceId} - {device.type} ({device.facilityName})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Installation Date"
                type="date"
                value={formData.installationDate}
                onChange={(e) => setFormData(prev => ({ ...prev, installationDate: e.target.value }))}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Engineer ID"
                value={formData.engineerId}
                onChange={(e) => setFormData(prev => ({ ...prev, engineerId: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Engineer Name"
                value={formData.engineerName}
                onChange={(e) => setFormData(prev => ({ ...prev, engineerName: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedInstallation ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Training Dialog */}
      <Dialog open={openTrainingDialog} onClose={() => setOpenTrainingDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Complete Training</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Training Date"
                type="date"
                value={trainingData.trainingDate}
                onChange={(e) => setTrainingData(prev => ({ ...prev, trainingDate: e.target.value }))}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Trained Personnel
              </Typography>
              {trainingData.trainedPersonnel.map((person, index) => (
                <TextField
                  key={index}
                  fullWidth
                  label={`Person ${index + 1}`}
                  value={person}
                  onChange={(e) => {
                    const newPersonnel = [...trainingData.trainedPersonnel]
                    newPersonnel[index] = e.target.value
                    setTrainingData(prev => ({ ...prev, trainedPersonnel: newPersonnel }))
                  }}
                  sx={{ mb: 1 }}
                />
              ))}
              <Button
                size="small"
                onClick={() => setTrainingData(prev => ({
                  ...prev,
                  trainedPersonnel: [...prev.trainedPersonnel, '']
                }))}
              >
                Add Person
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTrainingDialog(false)}>Cancel</Button>
          <Button onClick={handleTrainingSubmit} variant="contained">
            Complete Training
          </Button>
        </DialogActions>
      </Dialog>

      {/* Photo Upload Dialog */}
      <PhotoUpload
        open={openPhotoDialog}
        onClose={() => setOpenPhotoDialog(false)}
        installationId={selectedInstallation?.id}
        title="Installation Photos"
      />
    </Box>
  )
}

export default Installation
