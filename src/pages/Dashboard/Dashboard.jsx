import { useSelector } from 'react-redux'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  LinearProgress,
} from '@mui/material'
import {
  Devices as DevicesIcon,
  Build as BuildIcon,
  Engineering as EngineeringIcon,
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material'
import { selectAllDevices } from '../../store/slices/devicesSlice'
import { selectAllInstallations, selectPendingInstallations } from '../../store/slices/installationsSlice'
import { selectAllServiceVisits, selectPendingServiceVisits } from '../../store/slices/serviceVisitsSlice'
import { selectAllContracts, selectExpiringContracts, selectExpiredContracts } from '../../store/slices/contractsSlice'
import { selectAlertPhotos } from '../../store/slices/photoLogsSlice'

function Dashboard() {
  const devices = useSelector(selectAllDevices) || []
  const installations = useSelector(selectAllInstallations) || []
  const pendingInstallations = useSelector(selectPendingInstallations) || []
  const serviceVisits = useSelector(selectAllServiceVisits) || []
  const pendingServiceVisits = useSelector(selectPendingServiceVisits) || []
  const contracts = useSelector(selectAllContracts) || []
  const expiringContracts = useSelector(selectExpiringContracts) || []
  const expiredContracts = useSelector(selectExpiredContracts) || []
  const alertPhotos = useSelector(selectAlertPhotos) || []

  // Calculate device status counts
  const deviceStatusCounts = devices.reduce((acc, device) => {
    acc[device.status] = (acc[device.status] || 0) + 1
    return acc
  }, {})

  // Calculate average battery level
  const avgBatteryLevel = devices.length > 0
    ? Math.round(devices.reduce((sum, device) => sum + (device.batteryLevel || 0), 0) / devices.length)
    : 0

  // Recent activities (last 5)
  const recentActivities = [
    ...serviceVisits.slice(0, 3).map(visit => ({
      type: 'Service Visit',
      description: `${visit.purpose || 'Unknown'} maintenance on ${visit.deviceType || 'Unknown Device'}`,
      date: visit.visitDate,
      facility: visit.facilityName || 'Unknown Facility',
      status: visit.status,
    })),
    ...installations.slice(0, 2).map(installation => ({
      type: 'Installation',
      description: `${installation.deviceType || 'Unknown Device'} installation`,
      date: installation.installationDate,
      facility: installation.facilityName || 'Unknown Facility',
      status: installation.status,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)

  const StatCard = ({ title, value, icon, color = 'primary', subtitle }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" color={color}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ color: `${color}.main` }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
      case 'Online':
      case 'Active':
        return 'success'
      case 'In Progress':
      case 'Maintenance':
        return 'warning'
      case 'Offline':
      case 'Expired':
        return 'error'
      default:
        return 'default'
    }
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Devices"
            value={devices.length}
            icon={<DevicesIcon sx={{ fontSize: 40 }} />}
            subtitle={`Avg Battery: ${avgBatteryLevel}%`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Installations"
            value={pendingInstallations.length}
            icon={<BuildIcon sx={{ fontSize: 40 }} />}
            color={pendingInstallations.length > 0 ? 'warning' : 'success'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Service Visits"
            value={pendingServiceVisits.length}
            icon={<EngineeringIcon sx={{ fontSize: 40 }} />}
            color={pendingServiceVisits.length > 0 ? 'warning' : 'success'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Contract Alerts"
            value={expiringContracts.length + expiredContracts.length}
            icon={<AssignmentIcon sx={{ fontSize: 40 }} />}
            color={expiringContracts.length + expiredContracts.length > 0 ? 'error' : 'success'}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Device Status Overview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Device Status Overview
              </Typography>
              <Box sx={{ mt: 2 }}>
                {Object.entries(deviceStatusCounts).map(([status, count]) => (
                  <Box key={status} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{status}</Typography>
                      <Typography variant="body2">{count} devices</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(count / devices.length) * 100}
                      color={getStatusColor(status)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <List dense>
                {recentActivities.map((activity, index) => (
                  <ListItem key={`${activity.type}-${activity.date}-${index}`} divider={index < recentActivities.length - 1}>
                    <ListItemIcon>
                      {activity.type === 'Service Visit' ? (
                        <EngineeringIcon color={getStatusColor(activity.status)} />
                      ) : (
                        <BuildIcon color={getStatusColor(activity.status)} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.description}
                      secondary={
                        <Box>
                          <Typography variant="caption" display="block">
                            {activity.facility} • {activity.date}
                          </Typography>
                          <Chip
                            label={activity.status}
                            size="small"
                            color={getStatusColor(activity.status)}
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Alerts and Notifications */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Alerts & Notifications
              </Typography>
              <Grid container spacing={2}>
                {expiredContracts.length > 0 && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Paper sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ErrorIcon />
                        <Typography variant="subtitle2">
                          {expiredContracts.length} Expired Contract{expiredContracts.length > 1 ? 's' : ''}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                )}
                {expiringContracts.length > 0 && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Paper sx={{ p: 2, bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WarningIcon />
                        <Typography variant="subtitle2">
                          {expiringContracts.length} Contract{expiringContracts.length > 1 ? 's' : ''} Expiring Soon
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                )}
                {alertPhotos.length > 0 && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Paper sx={{ p: 2, bgcolor: 'info.light', color: 'info.contrastText' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ScheduleIcon />
                        <Typography variant="subtitle2">
                          {alertPhotos.length} Photo Alert{alertPhotos.length > 1 ? 's' : ''}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                )}
                {expiredContracts.length === 0 && expiringContracts.length === 0 && alertPhotos.length === 0 && (
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon />
                        <Typography variant="subtitle2">
                          All systems operational - No alerts at this time
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
