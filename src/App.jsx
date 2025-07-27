import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard/Dashboard'
import DeviceInventory from './pages/DeviceInventory/DeviceInventory'
import Installation from './pages/Installation/Installation'
import ServiceVisits from './pages/ServiceVisits/ServiceVisits'
import AMCTracker from './pages/AMCTracker/AMCTracker'
import PhotoLogs from './pages/PhotoLogs/PhotoLogs'
import './App.css'

// Add console logging to catch any React warnings
console.log('🚀 App component loaded successfully')

function App() {
  return (
    <ErrorBoundary>
      <Box sx={{ display: 'flex' }}>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/devices" element={<DeviceInventory />} />
            <Route path="/installations" element={<Installation />} />
            <Route path="/service-visits" element={<ServiceVisits />} />
            <Route path="/contracts" element={<AMCTracker />} />
            <Route path="/photo-logs" element={<PhotoLogs />} />
          </Routes>
        </Layout>
      </Box>
    </ErrorBoundary>
  )
}

export default App
