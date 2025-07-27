# Medical Device Management Dashboard

A comprehensive admin dashboard for managing medical device inventories, tracking installations, service visits, and contract lifecycles (AMC/CMC). Built with React, Redux, and Material-UI for a modern, responsive experience.

## 🚀 Features

### Core Modules
- **📊 Dashboard Overview**: Real-time summary of devices, installations, service visits, and contract status
- **🏥 Device Inventory Management**: Complete CRUD operations for medical devices with advanced filtering
- **🔧 Installation & Training Module**: Track installations with photo documentation and completion checklists
- **⚙️ Service Visit Tracking**: Log maintenance visits with detailed work records and attachments
- **📋 AMC/CMC Contract Management**: Monitor contract lifecycles with expiry alerts and renewal tracking
- **📸 Photo Documentation**: Upload and manage device condition photos with categorization and alerts

### Enhanced Features
- **🔍 QR Code Scanner**: Quick device identification and lookup
- **🌙 Theme Switcher**: Light/Dark mode with system preference detection
- **📤 CSV Export**: Export data from all modules for reporting and analysis
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🔔 Real-time Alerts**: Contract expiry warnings and device status notifications
- **💾 Data Persistence**: Automatic localStorage backup of all data

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.1.0 with modern Hooks
- **State Management**: Redux Toolkit 2.8.2 with localStorage persistence
- **UI Library**: Material-UI 7.2.0 with custom theming
- **Styling**: SCSS + Emotion + Material-UI styling system
- **Routing**: React Router 7.7.1 with modern routing
- **Build Tool**: Vite 7.0.6 for fast development and optimized builds
- **Date Handling**: date-fns 4.1.0 for date manipulation and formatting
- **File Handling**: HTML5 File API for photo uploads
- **Validation**: Custom validation utilities with real-time feedback
- **Icons**: Material-UI Icons 7.2.0
- **Data Grid**: Material-UI X Data Grid 8.9.1

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm/yarn
- Modern web browser with ES6+ support

### Quick Start
```bash
# Clone the repository
git clone https://github.com/your-username/medical-device-dashboard.git
cd medical-device-dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── Layout/             # Main application layout
│   ├── DeviceForm/         # Device creation/editing forms
│   ├── PhotoUpload/        # Photo upload with preview
│   ├── QRScanner/          # QR code scanning functionality
│   ├── ThemeSwitcher/      # Theme toggle component
│   └── ErrorBoundary/      # Error handling wrapper
├── pages/                  # Main application pages
│   ├── Dashboard/          # Overview with analytics
│   ├── DeviceInventory/    # Device management interface
│   ├── Installation/       # Installation tracking
│   ├── ServiceVisits/      # Service visit management
│   ├── AMCTracker/         # Contract lifecycle management
│   └── PhotoLogs/          # Photo documentation center
├── store/                  # Redux store configuration
│   └── slices/            # Feature-based Redux slices
│       ├── devicesSlice.js
│       ├── installationsSlice.js
│       ├── serviceVisitsSlice.js
│       ├── contractsSlice.js
│       ├── photoLogsSlice.js
│       └── facilitiesSlice.js
├── utils/                  # Utility functions
│   ├── validation.js       # Form validation helpers
│   └── csvExport.js        # Data export utilities
└── styles/                 # Global styles and themes
```

## 🎯 Usage Guide

### Getting Started
1. **Dashboard Overview**: Start at the main dashboard to see system status and alerts
2. **Add Facilities**: Set up your medical facilities first (optional - sample data included)
3. **Register Devices**: Add your medical devices with complete specifications
4. **Track Operations**: Log installations, service visits, and contract details

### Device Management
```
Navigation: Sidebar → Device Inventory
```
- **View All Devices**: Browse devices with status indicators and battery levels
- **Add New Device**: Complete form with device specifications and facility assignment
- **Search & Filter**: Use search bar and filters for quick device location
- **Export Data**: Download device inventory as CSV for external reporting
- **Edit/Delete**: Modify device details or remove obsolete entries

### Installation Tracking
```
Navigation: Sidebar → Installations
```
- **Create Installation Record**: Link device to installation with engineer details
- **Complete Checklist**: Mark installation steps as completed
- **Upload Photos**: Document installation process with photo evidence
- **Training Management**: Record staff training completion and personnel details
- **Progress Tracking**: Monitor installation completion percentage

### Service Visit Management
```
Navigation: Sidebar → Service Visits
```
- **Schedule Visits**: Create service appointments with purpose and engineer assignment
- **Log Work Performed**: Add detailed work items and parts used
- **Photo Documentation**: Attach before/after photos and service evidence
- **Time Tracking**: Record time spent and calculate service costs
- **Customer Sign-off**: Capture customer signatures and completion notes

### Contract Management (AMC/CMC)
```
Navigation: Sidebar → AMC/CMC Tracker
```
- **Contract Registration**: Add AMC/CMC contracts with complete terms
- **Expiry Monitoring**: Automatic alerts for contracts expiring within 30 days
- **Renewal Management**: Quick contract renewal with updated terms
- **Report Generation**: Export contract data for administrative review
- **Status Tracking**: Monitor active, expiring, and expired contracts

### Photo Documentation
```
Navigation: Sidebar → Photo Logs
```
- **Upload Photos**: Drag-and-drop or click to upload device photos
- **Categorization**: Organize photos by type (condition check, issues, maintenance)
- **Alert System**: Mark photos as alerts with severity levels
- **Search & Filter**: Find photos by device, date, category, or alert status
- **Bulk Operations**: Select multiple photos for batch operations

## 🔧 Advanced Features

### QR Code Scanner
- **Access**: Click QR scanner icon in top navigation
- **Usage**: Scan device QR codes for quick device lookup
- **Integration**: Automatically navigates to device details when found

### Theme Switching
- **Light Mode**: Default bright theme for normal lighting conditions
- **Dark Mode**: Dark theme for low-light environments
- **Auto Mode**: Follows system theme preference
- **Persistence**: Theme choice saved across browser sessions

### Data Export
- **Individual Modules**: Export data from each module separately
- **CSV Format**: Compatible with Excel and other spreadsheet applications
- **Complete Data**: All fields and relationships preserved in export
- **Batch Export**: Export all data types simultaneously

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with proper testing
4. **Commit with clear messages**: `git commit -m 'Add amazing feature'`
5. **Push to your branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request** with detailed description

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and feature requests via GitHub Issues

---

**Built with ❤️ for healthcare professionals managing medical device inventories**
