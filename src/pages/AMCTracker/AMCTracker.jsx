import { useState, useEffect } from 'react'
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Tabs,
  Tab,
  FormControlLabel,
  Switch,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material'
import {
  selectAllContracts,
  selectActiveContracts,
  selectExpiringContracts,
  selectExpiredContracts,
  addContract,
  updateContract,
  renewContract,
  deleteContract,
  updateContractStatuses,
} from '../../store/slices/contractsSlice'
import { selectAllDevices } from '../../store/slices/devicesSlice'
import { selectAllFacilities } from '../../store/slices/facilitiesSlice'
import { differenceInDays } from 'date-fns'

const contractTypes = ['AMC', 'CMC']
const serviceFrequencies = ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual']
const currencies = ['USD', 'EUR', 'GBP', 'INR']

function AMCTracker() {
  const dispatch = useDispatch()
  const allContracts = useSelector(selectAllContracts) || []
  const activeContracts = useSelector(selectActiveContracts) || []
  const expiringContracts = useSelector(selectExpiringContracts) || []
  const expiredContracts = useSelector(selectExpiredContracts) || []
  const devices = useSelector(selectAllDevices) || []
  const facilities = useSelector(selectAllFacilities) || []
  
  const [tabValue, setTabValue] = useState(0)
  const [openDialog, setOpenDialog] = useState(false)
  const [openRenewDialog, setOpenRenewDialog] = useState(false)
  const [selectedContract, setSelectedContract] = useState(null)
  const [formData, setFormData] = useState({
    contractNumber: '',
    type: 'AMC',
    deviceId: '',
    deviceType: '',
    facilityId: '',
    facilityName: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    value: 0,
    currency: 'USD',
    serviceFrequency: 'Quarterly',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    vendor: '',
    vendorContact: '',
    notes: '',
    autoRenewal: false,
  })
  const [renewalData, setRenewalData] = useState({
    newEndDate: '',
    newValue: 0,
  })

  // Update contract statuses on component mount
  useEffect(() => {
    dispatch(updateContractStatuses())
  }, [dispatch])

  const handleAddContract = () => {
    setSelectedContract(null)
    setFormData({
      contractNumber: '',
      type: 'AMC',
      deviceId: '',
      deviceType: '',
      facilityId: '',
      facilityName: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      value: 0,
      currency: 'USD',
      serviceFrequency: 'Quarterly',
      contactPerson: '',
      contactEmail: '',
      contactPhone: '',
      vendor: '',
      vendorContact: '',
      notes: '',
      autoRenewal: false,
    })
    setOpenDialog(true)
  }

  const handleEditContract = (contract) => {
    setSelectedContract(contract)
    setFormData({
      contractNumber: contract.contractNumber,
      type: contract.type,
      deviceId: contract.deviceId,
      deviceType: contract.deviceType,
      facilityId: contract.facilityId,
      facilityName: contract.facilityName,
      startDate: contract.startDate,
      endDate: contract.endDate,
      value: contract.value,
      currency: contract.currency,
      serviceFrequency: contract.serviceFrequency,
      contactPerson: contract.contactPerson,
      contactEmail: contract.contactEmail,
      contactPhone: contract.contactPhone,
      vendor: contract.vendor,
      vendorContact: contract.vendorContact,
      notes: contract.notes,
      autoRenewal: contract.autoRenewal,
    })
    setOpenDialog(true)
  }

  const handleRenewContract = (contract) => {
    setSelectedContract(contract)
    const currentEndDate = new Date(contract.endDate)
    const newEndDate = new Date(currentEndDate)
    newEndDate.setFullYear(currentEndDate.getFullYear() + 1)
    
    setRenewalData({
      newEndDate: newEndDate.toISOString().split('T')[0],
      newValue: contract.value,
    })
    setOpenRenewDialog(true)
  }

  const handleSubmit = () => {
    if (selectedContract) {
      dispatch(updateContract({ id: selectedContract.id, ...formData }))
    } else {
      dispatch(addContract(formData))
    }
    setOpenDialog(false)
  }

  const handleRenewal = () => {
    if (selectedContract) {
      dispatch(renewContract({
        id: selectedContract.id,
        newEndDate: renewalData.newEndDate,
        newValue: renewalData.newValue,
      }))
    }
    setOpenRenewDialog(false)
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active':
        return <CheckCircleIcon />
      case 'Expiring Soon':
        return <WarningIcon />
      case 'Expired':
        return <ErrorIcon />
      default:
        return null
    }
  }

  const getDaysUntilExpiry = (endDate) => {
    return differenceInDays(new Date(endDate), new Date())
  }

  const exportToCSV = () => {
    const headers = [
      'Contract Number',
      'Type',
      'Device ID',
      'Device Type',
      'Facility',
      'Start Date',
      'End Date',
      'Status',
      'Value',
      'Currency',
      'Service Frequency',
      'Contact Person',
      'Vendor',
      'Days Until Expiry',
    ]

    const csvData = allContracts.map(contract => [
      contract.contractNumber,
      contract.type,
      contract.deviceId,
      contract.deviceType,
      contract.facilityName,
      contract.startDate,
      contract.endDate,
      contract.status,
      contract.value,
      contract.currency,
      contract.serviceFrequency,
      contract.contactPerson,
      contract.vendor,
      getDaysUntilExpiry(contract.endDate),
    ])

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `contracts_export_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getContractsForTab = (tabIndex) => {
    switch (tabIndex) {
      case 0:
        return allContracts
      case 1:
        return activeContracts
      case 2:
        return expiringContracts
      case 3:
        return expiredContracts
      default:
        return allContracts
    }
  }

  const contracts = getContractsForTab(tabValue)

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">AMC/CMC Contract Tracker</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => dispatch(updateContractStatuses())}
          >
            Refresh Status
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={exportToCSV}
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddContract}
          >
            Add Contract
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Contracts
              </Typography>
              <Typography variant="h4" component="div">
                {allContracts.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Contracts
              </Typography>
              <Typography variant="h4" component="div" color="success.main">
                {activeContracts.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Expiring Soon
              </Typography>
              <Typography variant="h4" component="div" color="warning.main">
                {expiringContracts.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Expired
              </Typography>
              <Typography variant="h4" component="div" color="error.main">
                {expiredContracts.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts */}
      {(expiringContracts.length > 0 || expiredContracts.length > 0) && (
        <Box sx={{ mb: 3 }}>
          {expiredContracts.length > 0 && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {expiredContracts.length} contract{expiredContracts.length > 1 ? 's have' : ' has'} expired and need{expiredContracts.length === 1 ? 's' : ''} immediate attention.
            </Alert>
          )}
          {expiringContracts.length > 0 && (
            <Alert severity="warning">
              {expiringContracts.length} contract{expiringContracts.length > 1 ? 's are' : ' is'} expiring within 30 days.
            </Alert>
          )}
        </Box>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label={`All (${allContracts.length})`} />
          <Tab label={`Active (${activeContracts.length})`} />
          <Tab label={`Expiring (${expiringContracts.length})`} />
          <Tab label={`Expired (${expiredContracts.length})`} />
        </Tabs>
      </Box>

      {/* Contracts Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Contract #</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Device</TableCell>
              <TableCell>Facility</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Days Left</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contracts.map((contract) => {
              const daysLeft = getDaysUntilExpiry(contract.endDate)
              return (
                <TableRow key={contract.id}>
                  <TableCell>{contract.contractNumber}</TableCell>
                  <TableCell>
                    <Chip
                      label={contract.type}
                      color={contract.type === 'AMC' ? 'primary' : 'secondary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{contract.deviceId}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {contract.deviceType}
                    </Typography>
                  </TableCell>
                  <TableCell>{contract.facilityName}</TableCell>
                  <TableCell>{contract.startDate}</TableCell>
                  <TableCell>{contract.endDate}</TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(contract.status)}
                      label={contract.status}
                      color={getStatusColor(contract.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {contract.currency} {contract.value.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color={daysLeft < 0 ? 'error' : daysLeft <= 30 ? 'warning.main' : 'text.primary'}
                    >
                      {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleEditContract(contract)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    {(contract.status === 'Expiring Soon' || contract.status === 'Expired') && (
                      <IconButton
                        size="small"
                        onClick={() => handleRenewContract(contract)}
                        color="success"
                      >
                        <RefreshIcon />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => dispatch(deleteContract(contract.id))}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {contracts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No contracts found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Start by adding a new contract
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddContract}>
            Add First Contract
          </Button>
        </Box>
      )}

      {/* Contract Form Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedContract ? 'Edit Contract' : 'Add New Contract'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contract Number"
                value={formData.contractNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, contractNumber: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Type"
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                >
                  {contractTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
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
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Value"
                type="number"
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={formData.currency}
                  label="Currency"
                  onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                >
                  {currencies.map((currency) => (
                    <MenuItem key={currency} value={currency}>
                      {currency}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Service Frequency</InputLabel>
                <Select
                  value={formData.serviceFrequency}
                  label="Service Frequency"
                  onChange={(e) => setFormData(prev => ({ ...prev, serviceFrequency: e.target.value }))}
                >
                  {serviceFrequencies.map((frequency) => (
                    <MenuItem key={frequency} value={frequency}>
                      {frequency}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Person"
                value={formData.contactPerson}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Email"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Phone"
                value={formData.contactPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Vendor"
                value={formData.vendor}
                onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Vendor Contact"
                value={formData.vendorContact}
                onChange={(e) => setFormData(prev => ({ ...prev, vendorContact: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.autoRenewal}
                    onChange={(e) => setFormData(prev => ({ ...prev, autoRenewal: e.target.checked }))}
                  />
                }
                label="Auto Renewal"
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
            {selectedContract ? 'Update' : 'Add'} Contract
          </Button>
        </DialogActions>
      </Dialog>

      {/* Renewal Dialog */}
      <Dialog open={openRenewDialog} onClose={() => setOpenRenewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Renew Contract</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                Renewing contract: {selectedContract?.contractNumber}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="New End Date"
                type="date"
                value={renewalData.newEndDate}
                onChange={(e) => setRenewalData(prev => ({ ...prev, newEndDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="New Value"
                type="number"
                value={renewalData.newValue}
                onChange={(e) => setRenewalData(prev => ({ ...prev, newValue: parseFloat(e.target.value) || 0 }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRenewDialog(false)}>Cancel</Button>
          <Button onClick={handleRenewal} variant="contained" color="success">
            Renew Contract
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AMCTracker
