# 🏥 Medical Device Management Dashboard

A comprehensive React-based dashboard for managing medical devices, installations, service visits, contracts, and photo documentation in healthcare facilities.

## ✨ Features

### 📊 **Dashboard Overview**
- Real-time device status monitoring
- Battery level tracking
- Recent activities feed
- Contract expiration alerts
- Quick statistics and metrics

### 🔧 **Device Management**
- Complete device inventory
- Device registration and tracking
- Battery monitoring
- Status management (Online/Offline/Maintenance)
- QR code scanning for quick device identification

### 🛠️ **Installation Tracking**
- Installation scheduling and management
- Training documentation
- Personnel tracking
- Installation status monitoring
- Photo documentation

### 🔧 **Service Visits**
- Service visit scheduling
- Work performed tracking
- Parts usage documentation
- Photo evidence collection
- Service history

### 📋 **Contract Management (AMC/CMC)**
- Annual Maintenance Contract tracking
- Contract renewal notifications
- Expiration monitoring
- Document management
- Renewal workflow

### 📸 **Photo Documentation**
- Photo logging with categorization
- Alert-level tagging
- Device-specific photo organization
- Search and filtering capabilities
- Bulk operations

## 🚀 **Technology Stack**

- **Frontend**: React 19.1.0
- **UI Framework**: Material-UI 7.2.0
- **State Management**: Redux Toolkit 2.8.2
- **Routing**: React Router 7.7.1
- **Styling**: Emotion + Sass
- **Build Tool**: Vite 7.0.6
- **Date Handling**: date-fns 4.1.0
- **Unique IDs**: uuid 11.1.0

## 🛠️ **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/nehahunnur/device-crm-dashboard.git
   cd device-crm-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 **Project Structure**

```
src/
├── components/          # Reusable UI components
│   ├── DeviceForm/     # Device creation/editing form
│   ├── ErrorBoundary/  # Error handling component
│   ├── Layout/         # Main application layout
│   ├── PhotoUpload/    # Photo upload functionality
│   ├── QRScanner/      # QR code scanning component
│   └── ThemeSwitcher/  # Theme switching component
├── pages/              # Main application pages
│   ├── Dashboard/      # Dashboard overview
│   ├── DeviceInventory/ # Device management
│   ├── Installation/   # Installation tracking
│   ├── ServiceVisits/  # Service visit management
│   ├── AMCTracker/     # Contract management
│   └── PhotoLogs/      # Photo documentation
├── store/              # Redux store configuration
│   └── slices/         # Redux slices for state management
└── utils/              # Utility functions
    ├── csvExport.js    # CSV export functionality
    └── validation.js   # Form validation helpers
```

## 🎯 **Key Features**

### **Device Management**
- Add, edit, and delete medical devices
- Track device status and battery levels
- QR code generation and scanning
- Facility assignment and tracking

### **Installation Management**
- Schedule and track device installations
- Document training sessions
- Track installation personnel
- Photo documentation of installations

### **Service Management**
- Schedule service visits
- Document work performed
- Track parts usage
- Maintain service history

### **Contract Management**
- Track AMC/CMC contracts
- Monitor contract expiration
- Automated renewal notifications
- Document management

### **Photo Documentation**
- Categorized photo logging
- Alert-level tagging
- Advanced search and filtering
- Bulk photo operations

## 🔧 **Available Scripts**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌟 **Contributing**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 **Support**

For support, email support@yourcompany.com or create an issue in this repository.

## 🙏 **Acknowledgments**

- Material-UI for the excellent component library
- Redux Toolkit for state management
- React team for the amazing framework
- Vite for the fast build tool
