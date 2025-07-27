import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Badge,
  Tooltip,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Devices as DevicesIcon,
  Build as BuildIcon,
  Engineering as EngineeringIcon,
  Assignment as AssignmentIcon,
  PhotoLibrary as PhotoLibraryIcon,
  LocalHospital as LocalHospitalIcon,
  QrCodeScanner as QrCodeScannerIcon,
  Download as DownloadIcon,
} from '@mui/icons-material'
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher'
import QRScanner from '../QRScanner/QRScanner'
import { selectAllDevices } from '../../store/slices/devicesSlice'
import { selectExpiringContracts, selectExpiredContracts } from '../../store/slices/contractsSlice'
import { selectAlertPhotos } from '../../store/slices/photoLogsSlice'
import { exportAllData } from '../../utils/csvExport'

const drawerWidth = 240

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Device Inventory', icon: <DevicesIcon />, path: '/devices' },
  { text: 'Installations', icon: <BuildIcon />, path: '/installations' },
  { text: 'Service Visits', icon: <EngineeringIcon />, path: '/service-visits' },
  { text: 'AMC/CMC Tracker', icon: <AssignmentIcon />, path: '/contracts' },
  { text: 'Photo Logs', icon: <PhotoLibraryIcon />, path: '/photo-logs' },
]

function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [qrScannerOpen, setQrScannerOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Get data for notifications
  const devices = useSelector(selectAllDevices) || []
  const expiringContracts = useSelector(selectExpiringContracts) || []
  const expiredContracts = useSelector(selectExpiredContracts) || []
  const alertPhotos = useSelector(selectAlertPhotos) || []

  const totalAlerts = expiringContracts.length + expiredContracts.length + alertPhotos.length

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleNavigation = (path) => {
    navigate(path)
    if (isMobile) {
      setMobileOpen(false)
    }
  }

  const handleQRScan = (data) => {
    // Handle QR code scan result
    console.log('QR Code scanned:', data)

    // Try to find device by ID
    const device = devices.find(d => d.deviceId === data)
    if (device) {
      navigate('/devices')
      // In a real app, you might want to highlight or filter to the specific device
    } else {
      // Show notification that device not found
      console.log('Device not found:', data)
    }

    setQrScannerOpen(false)
  }

  const handleExportAll = () => {
    try {
      const allData = {
        devices: devices || [],
        // Add other data when selectors are available
      }
      exportAllData(allData)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const drawer = (
    <div>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocalHospitalIcon color="primary" />
          <Typography variant="h6" noWrap component="div" color="primary">
            MedDevice
          </Typography>
        </Box>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: `${theme.palette.primary.main}20`,
                  '&:hover': {
                    backgroundColor: `${theme.palette.primary.main}30`,
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path 
                    ? theme.palette.primary.main 
                    : 'inherit'
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    color: location.pathname === item.path 
                      ? theme.palette.primary.main 
                      : 'inherit',
                    fontWeight: location.pathname === item.path ? 600 : 400,
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Medical Device Management Dashboard
          </Typography>

          {/* Action buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Export All Data">
              <IconButton color="inherit" onClick={handleExportAll}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Scan QR Code">
              <IconButton color="inherit" onClick={() => setQrScannerOpen(true)}>
                <QrCodeScannerIcon />
              </IconButton>
            </Tooltip>

            {totalAlerts > 0 && (
              <Tooltip title={`${totalAlerts} alert${totalAlerts > 1 ? 's' : ''}`}>
                <Badge badgeContent={totalAlerts} color="error">
                  <IconButton color="inherit" onClick={() => navigate('/')}>
                    <DashboardIcon />
                  </IconButton>
                </Badge>
              </Tooltip>
            )}

            <ThemeSwitcher />
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="navigation menu"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8, // Account for AppBar height
        }}
      >
        {children}
      </Box>

      {/* QR Scanner Dialog */}
      <QRScanner
        open={qrScannerOpen}
        onClose={() => setQrScannerOpen(false)}
        onScan={handleQRScan}
        title="Scan Device QR Code"
      />
    </Box>
  )
}

export default Layout
