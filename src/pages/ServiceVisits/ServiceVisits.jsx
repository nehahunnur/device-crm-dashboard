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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PhotoCamera as PhotoCameraIcon,
  AttachFile as AttachFileIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Engineering as EngineeringIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material'
import {
  selectAllServiceVisits,
  addServiceVisit,
  updateServiceVisit,
  addWorkPerformed,
  removeWorkPerformed,
  addPartUsed,
  removePartUsed,
  completeServiceVisit,
  deleteServiceVisit,
} from '../../store/slices/serviceVisitsSlice'
import { selectAllDevices } from '../../store/slices/devicesSlice'
import PhotoUpload from '../../components/PhotoUpload/PhotoUpload'

const purposeOptions = ['Preventive', 'Breakdown', 'Installation', 'Calibration', 'Upgrade']
const statusOptions = ['Scheduled', 'In Progress', 'Completed', 'Cancelled']

function ServiceVisits() {
  const dispatch = useDispatch()
  const serviceVisits = useSelector(selectAllServiceVisits) || []
  const devices = useSelector(selectAllDevices) || []
  
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedVisit, setSelectedVisit] = useState(null)
  const [openPhotoDialog, setOpenPhotoDialog] = useState(false)
  const [openWorkDialog, setOpenWorkDialog] = useState(false)
  const [openPartsDialog, setOpenPartsDialog] = useState(false)
  const [openCompleteDialog, setOpenCompleteDialog] = useState(false)
  
  const [formData, setFormData] = useState({
    deviceId: '',
    deviceType: '',
    facilityId: '',
    facilityName: '',
    visitDate: new Date().toISOString().split('T')[0],
    engineerId: '',
    engineerName: '',
    purpose: 'Preventive',
    description: '',
    timeSpent: 0,
    nextServiceDate: '',
    notes: '',
  })
  
  const [newWork, setNewWork] = useState('')
  const [newPart, setNewPart] = useState({
    name: '',
    partNumber: '',
    quantity: 1,
  })
  const [completionData, setCompletionData] = useState({
    customerSignature: '',
    completionNotes: '',
  })

  const handleAddServiceVisit = () => {
    setSelectedVisit(null)
    setFormData({
      deviceId: '',
      deviceType: '',
      facilityId: '',
      facilityName: '',
      visitDate: new Date().toISOString().split('T')[0],
      engineerId: '',
      engineerName: '',
      purpose: 'Preventive',
      description: '',
      timeSpent: 0,
      nextServiceDate: '',
      notes: '',
    })
    setOpenDialog(true)
  }

  const handleEditServiceVisit = (visit) => {
    setSelectedVisit(visit)
    setFormData({
      deviceId: visit.deviceId,
      deviceType: visit.deviceType,
      facilityId: visit.facilityId,
      facilityName: visit.facilityName,
      visitDate: visit.visitDate,
      engineerId: visit.engineerId,
      engineerName: visit.engineerName,
      purpose: visit.purpose,
      description: visit.description,
      timeSpent: visit.timeSpent,
      nextServiceDate: visit.nextServiceDate || '',
      notes: visit.notes,
    })
    setOpenDialog(true)
  }

  const handleSubmit = () => {
    if (selectedVisit) {
      dispatch(updateServiceVisit({ id: selectedVisit.id, ...formData }))
    } else {
      dispatch(addServiceVisit(formData))
    }
    setOpenDialog(false)
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

  const handleAddWork = () => {
    if (newWork.trim() && selectedVisit) {
      dispatch(addWorkPerformed({
        visitId: selectedVisit.id,
        work: newWork.trim(),
      }))
      setNewWork('')
    }
  }

  const handleAddPart = () => {
    if (newPart.name.trim() && selectedVisit) {
      dispatch(addPartUsed({
        visitId: selectedVisit.id,
        part: { ...newPart },
      }))
      setNewPart({ name: '', partNumber: '', quantity: 1 })
    }
  }

  const handleCompleteVisit = () => {
    if (selectedVisit) {
      dispatch(completeServiceVisit({
        visitId: selectedVisit.id,
        customerSignature: completionData.customerSignature,
        completionNotes: completionData.completionNotes,
      }))
      setOpenCompleteDialog(false)
      setCompletionData({ customerSignature: '', completionNotes: '' })
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success'
      case 'In Progress':
        return 'warning'
      case 'Scheduled':
        return 'info'
      case 'Cancelled':
        return 'error'
      default:
        return 'default'
    }
  }

  const getPurposeColor = (purpose) => {
    switch (purpose) {
      case 'Preventive':
        return 'success'
      case 'Breakdown':
        return 'error'
      case 'Installation':
        return 'primary'
      case 'Calibration':
        return 'warning'
      case 'Upgrade':
        return 'info'
      default:
        return 'default'
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Service Visits</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddServiceVisit}
        >
          Schedule Visit
        </Button>
      </Box>

      <Grid container spacing={3}>
        {serviceVisits.map((visit) => (
          <Grid item xs={12} md={6} lg={4} key={visit.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="div">
                    {visit.deviceId}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexDirection: 'column' }}>
                    <Chip
                      label={visit.status}
                      color={getStatusColor(visit.status)}
                      size="small"
                    />
                    <Chip
                      label={visit.purpose}
                      color={getPurposeColor(visit.purpose)}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {visit.deviceType}
                </Typography>
                
                <Typography variant="body2" gutterBottom>
                  <strong>Facility:</strong> {visit.facilityName}
                </Typography>
                
                <Typography variant="body2" gutterBottom>
                  <strong>Date:</strong> {visit.visitDate}
                </Typography>
                
                <Typography variant="body2" gutterBottom>
                  <strong>Engineer:</strong> {visit.engineerName}
                </Typography>

                <Typography variant="body2" gutterBottom>
                  <strong>Description:</strong> {visit.description}
                </Typography>

                {visit.timeSpent > 0 && (
                  <Typography variant="body2" gutterBottom>
                    <strong>Time Spent:</strong> {visit.timeSpent} minutes
                  </Typography>
                )}

                {/* Work Performed */}
                {visit.workPerformed && visit.workPerformed.length > 0 && (
                  <Accordion sx={{ mt: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle2">
                        Work Performed ({visit.workPerformed.length})
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {visit.workPerformed.map((work, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={work} />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                )}

                {/* Parts Used */}
                {visit.partsUsed && visit.partsUsed.length > 0 && (
                  <Accordion sx={{ mt: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle2">
                        Parts Used ({visit.partsUsed.length})
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {visit.partsUsed.map((part, index) => (
                          <ListItem key={index}>
                            <ListItemText
                              primary={part.name}
                              secondary={`${part.partNumber} (Qty: ${part.quantity})`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                )}

                {visit.nextServiceDate && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                    Next Service: {visit.nextServiceDate}
                  </Typography>
                )}
              </CardContent>
              
              <CardActions>
                <Button
                  size="small"
                  startIcon={<PhotoCameraIcon />}
                  onClick={() => {
                    setSelectedVisit(visit)
                    setOpenPhotoDialog(true)
                  }}
                >
                  Photos ({visit.photos?.length || 0})
                </Button>
                
                {visit.status !== 'Completed' && (
                  <>
                    <Button
                      size="small"
                      startIcon={<EngineeringIcon />}
                      onClick={() => {
                        setSelectedVisit(visit)
                        setOpenWorkDialog(true)
                      }}
                    >
                      Work
                    </Button>
                    <Button
                      size="small"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => {
                        setSelectedVisit(visit)
                        setCompletionData({ customerSignature: '', completionNotes: visit.notes || '' })
                        setOpenCompleteDialog(true)
                      }}
                      color="success"
                    >
                      Complete
                    </Button>
                  </>
                )}
                
                <IconButton
                  size="small"
                  onClick={() => handleEditServiceVisit(visit)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => dispatch(deleteServiceVisit(visit.id))}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {serviceVisits.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No service visits found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Start by scheduling a new service visit
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddServiceVisit}>
            Schedule First Visit
          </Button>
        </Box>
      )}

      {/* Service Visit Form Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedVisit ? 'Edit Service Visit' : 'Schedule Service Visit'}
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
                label="Visit Date"
                type="date"
                value={formData.visitDate}
                onChange={(e) => setFormData(prev => ({ ...prev, visitDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Purpose</InputLabel>
                <Select
                  value={formData.purpose}
                  label="Purpose"
                  onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                >
                  {purposeOptions.map((purpose) => (
                    <MenuItem key={purpose} value={purpose}>
                      {purpose}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Engineer ID"
                value={formData.engineerId}
                onChange={(e) => setFormData(prev => ({ ...prev, engineerId: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Time Spent (minutes)"
                type="number"
                value={formData.timeSpent}
                onChange={(e) => setFormData(prev => ({ ...prev, timeSpent: parseInt(e.target.value) || 0 }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Next Service Date"
                type="date"
                value={formData.nextServiceDate}
                onChange={(e) => setFormData(prev => ({ ...prev, nextServiceDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
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
            {selectedVisit ? 'Update' : 'Schedule'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Work Performed Dialog */}
      <Dialog open={openWorkDialog} onClose={() => setOpenWorkDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Work Performed</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Add work item"
              value={newWork}
              onChange={(e) => setNewWork(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddWork()}
              sx={{ mb: 2 }}
            />
            <Button onClick={handleAddWork} variant="outlined" fullWidth sx={{ mb: 2 }}>
              Add Work Item
            </Button>
            
            {selectedVisit?.workPerformed && selectedVisit.workPerformed.length > 0 && (
              <List>
                {selectedVisit.workPerformed.map((work, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={work} />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => dispatch(removeWorkPerformed({ visitId: selectedVisit.id, index }))}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenWorkDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Complete Visit Dialog */}
      <Dialog open={openCompleteDialog} onClose={() => setOpenCompleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Complete Service Visit</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Customer Signature"
                value={completionData.customerSignature}
                onChange={(e) => setCompletionData(prev => ({ ...prev, customerSignature: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Completion Notes"
                multiline
                rows={3}
                value={completionData.completionNotes}
                onChange={(e) => setCompletionData(prev => ({ ...prev, completionNotes: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCompleteDialog(false)}>Cancel</Button>
          <Button onClick={handleCompleteVisit} variant="contained" color="success">
            Complete Visit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Photo Upload Dialog */}
      <PhotoUpload
        open={openPhotoDialog}
        onClose={() => setOpenPhotoDialog(false)}
        serviceVisitId={selectedVisit?.id}
        title="Service Visit Photos"
      />
    </Box>
  )
}

export default ServiceVisits
