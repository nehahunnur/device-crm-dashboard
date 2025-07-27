import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { store } from './store/store'
import './index.css'
import App from './App.jsx'

// Enhanced error logging
const originalConsoleError = console.error
console.error = (...args) => {
  // Log React warnings and errors
  if (args[0] && typeof args[0] === 'string') {
    if (args[0].includes('Warning:') || args[0].includes('Error:')) {
      console.log('🔍 React Warning/Error detected:', ...args)
    }
  }
  originalConsoleError.apply(console, args)
}

window.addEventListener('error', (event) => {
  console.error('🚨 Global error:', event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 Unhandled promise rejection:', event.reason)
})

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
})

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </Provider>
)
