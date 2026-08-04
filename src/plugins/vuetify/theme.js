const defaultPrimaryColor = '#2065D1'
const legacyPrimaryColors = ['#7635dc', '#0d9394']
const storedPrimaryColor = localStorage.getItem('app-preset')
const primaryColor = !storedPrimaryColor || legacyPrimaryColors.includes(storedPrimaryColor.toLowerCase())
  ? defaultPrimaryColor
  : storedPrimaryColor

if (primaryColor !== storedPrimaryColor)
  localStorage.setItem('app-preset', primaryColor)

export default {
  themes: {
    light: {
      colors: {
        'primary': primaryColor,
        'on-primary': '#fff',
        'secondary': '#38BDF8',
        'on-secondary': '#fff',
        'info': '#00B8D9',
        'success': '#22C55E',
        'on-success': '#fff',
        'warning': '#FFAB00',
        'on-warning': '#fff',
        'error': '#FF5630',
        'background': '#f9fafb',
        'on-background': '#212b36',
        'on-surface': '#212b36',
      },
      variables: {
        'border-color': '#919eab',
        'border-opacity': '0.24',
        'hover-opacity': '0.06',
        'table-header-color': '#F4F6F8',
        'scrollbar-thumb': '#dbdade',
        'high-emphasis-opacity': '0.87',
        'medium-emphasis-opacity': '0.6',
        'disabled-opacity': 0.4,
        'overlay-scrim-background': '#212b36',
        'overlay-scrim-opacity': 0.5,

        // Shadows
        'shadow-key-umbra-opacity': 'rgba(var(--v-border-color), 0.2)',
        'shadow-key-penumbra-opacity': 'rgba(var(--v-border-color), 0.14)',
        'shadow-key-ambient-opacity': 'rgba(var(--v-border-color), 0.12)',
      },
    },
    dark: {
      colors: {
        'primary': primaryColor,
        'on-primary': '#fff',
        'secondary': '#38BDF8',
        'on-secondary': '#fff',
        'info': '#00B8D9',
        'success': '#36B37E',
        'warning': '#FFAB00',
        'on-warning': '#fff',
        'error': '#FF5630',
        'background': '#151521',
        'surface': '#1e1e2d',
        'on-surface': '#E7E3FC',
        'on-background': '#E7E3FC',
      },
      variables: {
        'border-color': '#eaeaff',
        'border-opacity': '0.12',
        'hover-opacity': '0.06',
        'idle-opacity': '0.04',
        'table-header-color': '#2F3944',
        'scrollbar-thumb': '#4a5072',
        'high-emphasis-opacity': '0.87',
        'medium-emphasis-opacity': '0.6',
        'disabled-opacity': 0.4,
        'overlay-scrim-background': '#4a5072',
        'overlay-scrim-opacity': 0.5,

        // Shadows
        'shadow-key-umbra-opacity': 'rgba(0, 0, 0, 0.2)',
        'shadow-key-penumbra-opacity': 'rgba(0, 0, 0, 0.14)',
        'shadow-key-ambient-opacity': 'rgba(0, 0, 0, 0.12)',
      },
    },
  },
}
