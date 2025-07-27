import { useState, useEffect } from 'react'
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material'
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  SettingsBrightness as AutoModeIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material'

const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
}

const THEME_STORAGE_KEY = 'medicalDeviceTheme'

function ThemeSwitcher({ onThemeChange }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    return savedTheme || THEME_MODES.LIGHT
  })

  const open = Boolean(anchorEl)

  useEffect(() => {
    // Apply theme on component mount and when theme changes
    applyTheme(currentTheme)
  }, [currentTheme])

  const applyTheme = (theme) => {
    let actualTheme = theme

    if (theme === THEME_MODES.AUTO) {
      // Use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      actualTheme = prefersDark ? THEME_MODES.DARK : THEME_MODES.LIGHT
    }

    // Update document class for theme
    document.documentElement.setAttribute('data-theme', actualTheme)
    
    // Update body background color
    document.body.style.backgroundColor = actualTheme === THEME_MODES.DARK ? '#121212' : '#f5f5f5'

    // Call parent callback if provided
    if (onThemeChange) {
      onThemeChange(actualTheme)
    }

    // Save to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleThemeSelect = (theme) => {
    setCurrentTheme(theme)
    handleClose()
  }

  const getCurrentIcon = () => {
    switch (currentTheme) {
      case THEME_MODES.DARK:
        return <DarkModeIcon />
      case THEME_MODES.LIGHT:
        return <LightModeIcon />
      case THEME_MODES.AUTO:
        return <AutoModeIcon />
      default:
        return <LightModeIcon />
    }
  }

  const getThemeLabel = (theme) => {
    switch (theme) {
      case THEME_MODES.LIGHT:
        return 'Light Mode'
      case THEME_MODES.DARK:
        return 'Dark Mode'
      case THEME_MODES.AUTO:
        return 'Auto (System)'
      default:
        return 'Light Mode'
    }
  }

  const themeOptions = [
    {
      value: THEME_MODES.LIGHT,
      label: 'Light Mode',
      icon: <LightModeIcon />,
      description: 'Light theme with bright colors',
    },
    {
      value: THEME_MODES.DARK,
      label: 'Dark Mode',
      icon: <DarkModeIcon />,
      description: 'Dark theme for low-light environments',
    },
    {
      value: THEME_MODES.AUTO,
      label: 'Auto (System)',
      icon: <AutoModeIcon />,
      description: 'Follow system theme preference',
    },
  ]

  return (
    <>
      <Tooltip title={`Current theme: ${getThemeLabel(currentTheme)}`}>
        <IconButton
          onClick={handleClick}
          color="inherit"
          aria-label="theme switcher"
          aria-controls={open ? 'theme-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          {getCurrentIcon()}
        </IconButton>
      </Tooltip>

      <Menu
        id="theme-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'theme-button',
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {themeOptions.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => handleThemeSelect(option.value)}
            selected={currentTheme === option.value}
            sx={{ minWidth: 200 }}
          >
            <ListItemIcon>
              {option.icon}
            </ListItemIcon>
            <ListItemText
              primary={option.label}
              secondary={option.description}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

// Hook for using theme in components
export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    return savedTheme || THEME_MODES.LIGHT
  })

  const toggleTheme = () => {
    const newTheme = theme === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT
    setTheme(newTheme)
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
  }

  const setThemeMode = (mode) => {
    setTheme(mode)
    localStorage.setItem(THEME_STORAGE_KEY, mode)
  }

  return {
    theme,
    toggleTheme,
    setThemeMode,
    isLight: theme === THEME_MODES.LIGHT,
    isDark: theme === THEME_MODES.DARK,
    isAuto: theme === THEME_MODES.AUTO,
  }
}

// CSS variables for theme switching
export const themeVariables = `
  :root[data-theme="light"] {
    --primary-color: #1976d2;
    --secondary-color: #dc004e;
    --background-color: #ffffff;
    --surface-color: #f5f5f5;
    --text-primary: #000000;
    --text-secondary: #666666;
    --border-color: #e0e0e0;
    --shadow: rgba(0, 0, 0, 0.12);
  }

  :root[data-theme="dark"] {
    --primary-color: #90caf9;
    --secondary-color: #f48fb1;
    --background-color: #121212;
    --surface-color: #1e1e1e;
    --text-primary: #ffffff;
    --text-secondary: #aaaaaa;
    --border-color: #333333;
    --shadow: rgba(0, 0, 0, 0.24);
  }

  .theme-transition {
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  }
`

export default ThemeSwitcher
