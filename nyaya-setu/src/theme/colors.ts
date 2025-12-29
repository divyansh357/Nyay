// Theme colors optimized for rural accessibility
// High contrast colors for better visibility on basic devices

export const theme = {
  colors: {
    // Primary colors - Forest Green theme for FRA
    primary: '#2E7D32',        // Dark green
    primaryLight: '#4CAF50',   // Light green
    primaryDark: '#1B5E20',    // Very dark green
    
    // Secondary colors
    secondary: '#FF9800',      // Orange for highlights
    secondaryLight: '#FFB74D', // Light orange
    secondaryDark: '#F57C00',  // Dark orange
    
    // Background colors
    background: '#FFFFFF',     // Pure white
    surface: '#F8F9FA',       // Light gray
    surfaceVariant: '#E8F5E8', // Very light green
    
    // Text colors - High contrast
    text: '#212121',           // Almost black
    textSecondary: '#757575',  // Medium gray
    textOnPrimary: '#FFFFFF',  // White on green
    onPrimary: '#FFFFFF',      // White
    onSurface: '#212121',      // Dark text on light surface
    
    // Status colors
    success: '#4CAF50',        // Green
    warning: '#FF9800',        // Orange
    error: '#F44336',          // Red
    info: '#2196F3',           // Blue
    
    // Border and divider
    border: '#E0E0E0',         // Light gray
    divider: '#BDBDBD',        // Medium gray
    
    // Accessibility colors
    focus: '#FF5722',          // Bright orange for focus
    disabled: '#9E9E9E',       // Gray for disabled elements
    
    // Offline indicator
    offline: '#795548',        // Brown
    online: '#4CAF50',         // Green
  },
  
  // Font sizes optimized for rural users
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    title: 32,
  },
  
  // Spacing for large touch targets
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Border radius
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  
  // Shadows for depth
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
};