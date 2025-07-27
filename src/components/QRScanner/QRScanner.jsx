import { useState, useRef, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  IconButton,
  Paper,
} from '@mui/material'
import {
  QrCodeScanner as QrCodeScannerIcon,
  Close as CloseIcon,
  FlashOn as FlashOnIcon,
  FlashOff as FlashOffIcon,
  CameraAlt as CameraAltIcon,
} from '@mui/icons-material'

function QRScanner({ open, onClose, onScan, title = "Scan QR Code" }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState(null)
  const [hasFlash, setHasFlash] = useState(false)
  const [flashOn, setFlashOn] = useState(false)
  const [stream, setStream] = useState(null)
  const [scanResult, setScanResult] = useState(null)

  useEffect(() => {
    if (open) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [open])

  const startCamera = async () => {
    try {
      setError(null)
      setIsScanning(true)

      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access not supported in this browser')
      }

      // Request camera permission
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      })

      setStream(mediaStream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
      }

      // Check if flash is available
      const track = mediaStream.getVideoTracks()[0]
      const capabilities = track.getCapabilities()
      setHasFlash(capabilities.torch === true)

      // Start scanning for QR codes
      startQRDetection()

    } catch (err) {
      console.error('Error accessing camera:', err)
      setError('Unable to access camera. Please ensure camera permissions are granted.')
      setIsScanning(false)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsScanning(false)
    setFlashOn(false)
  }

  const toggleFlash = async () => {
    if (!stream || !hasFlash) return

    try {
      const track = stream.getVideoTracks()[0]
      await track.applyConstraints({
        advanced: [{ torch: !flashOn }]
      })
      setFlashOn(!flashOn)
    } catch (err) {
      console.error('Error toggling flash:', err)
    }
  }

  const startQRDetection = () => {
    // Simulate QR code detection
    // In a real implementation, you would use a library like jsQR or zxing-js
    const detectQR = () => {
      if (!isScanning || !videoRef.current || !canvasRef.current) return

      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Simulate QR code detection
      // In reality, you would use a QR code detection library here
      // For demo purposes, we'll simulate finding a QR code after 3 seconds
      setTimeout(() => {
        if (isScanning && Math.random() > 0.7) {
          const mockQRData = `MD-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
          handleQRDetected(mockQRData)
        } else if (isScanning) {
          requestAnimationFrame(detectQR)
        }
      }, 100)
    }

    requestAnimationFrame(detectQR)
  }

  const handleQRDetected = (data) => {
    setScanResult(data)
    setIsScanning(false)
    
    // Vibrate if supported
    if (navigator.vibrate) {
      navigator.vibrate(200)
    }

    // Call the onScan callback with the detected data
    if (onScan) {
      onScan(data)
    }
  }

  const handleClose = () => {
    stopCamera()
    setScanResult(null)
    onClose()
  }

  const handleRetry = () => {
    setScanResult(null)
    setError(null)
    startCamera()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <QrCodeScannerIcon />
            <Typography variant="h6">{title}</Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {scanResult && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="subtitle2">QR Code Detected!</Typography>
            <Typography variant="body2">Data: {scanResult}</Typography>
          </Alert>
        )}

        <Box sx={{ position: 'relative', textAlign: 'center' }}>
          {isScanning && (
            <>
              <Paper
                elevation={3}
                sx={{
                  position: 'relative',
                  display: 'inline-block',
                  borderRadius: 2,
                  overflow: 'hidden',
                  bgcolor: 'black',
                }}
              >
                <video
                  ref={videoRef}
                  style={{
                    width: '100%',
                    maxWidth: 400,
                    height: 'auto',
                    display: 'block',
                  }}
                  playsInline
                  muted
                />
                
                {/* QR Code Overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 200,
                    height: 200,
                    border: '2px solid #fff',
                    borderRadius: 2,
                    '&::before, &::after': {
                      content: '""',
                      position: 'absolute',
                      width: 20,
                      height: 20,
                      border: '3px solid #4caf50',
                    },
                    '&::before': {
                      top: -3,
                      left: -3,
                      borderRight: 'none',
                      borderBottom: 'none',
                    },
                    '&::after': {
                      bottom: -3,
                      right: -3,
                      borderLeft: 'none',
                      borderTop: 'none',
                    },
                  }}
                />

                {/* Flash Button */}
                {hasFlash && (
                  <IconButton
                    onClick={toggleFlash}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(0, 0, 0, 0.5)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.7)',
                      },
                    }}
                  >
                    {flashOn ? <FlashOffIcon /> : <FlashOnIcon />}
                  </IconButton>
                )}
              </Paper>

              <canvas
                ref={canvasRef}
                style={{ display: 'none' }}
              />

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Position the QR code within the frame to scan
              </Typography>
            </>
          )}

          {!isScanning && !error && !scanResult && (
            <Box sx={{ py: 4 }}>
              <CameraAltIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Camera is starting...
              </Typography>
            </Box>
          )}

          {error && (
            <Box sx={{ py: 4 }}>
              <Typography variant="body1" color="error" gutterBottom>
                Camera access failed
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please check your camera permissions and try again
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        {error && (
          <Button onClick={handleRetry} variant="outlined">
            Retry
          </Button>
        )}
        {scanResult && (
          <Button onClick={handleRetry} variant="outlined">
            Scan Again
          </Button>
        )}
        <Button onClick={handleClose}>
          {scanResult ? 'Done' : 'Cancel'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default QRScanner
