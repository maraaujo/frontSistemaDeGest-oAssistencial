// Aplica as cores do loader antes do app carregar. Fica em arquivo proprio (e nao
// inline no index.html) para a Content-Security-Policy nao precisar liberar scripts inline.
const loaderColor = localStorage.getItem('loader-bg') || '#FFFFFF'
const storedPrimaryColor = localStorage.getItem('app-preset')
const legacyPrimaryColors = ['#7635dc', '#0d9394']
const primaryColor = !storedPrimaryColor || legacyPrimaryColors.includes(storedPrimaryColor.toLowerCase())
  ? '#2065D1'
  : storedPrimaryColor

if (primaryColor !== storedPrimaryColor)
  localStorage.setItem('app-preset', primaryColor)

if (loaderColor)
  document.documentElement.style.setProperty('--loader-bg', loaderColor)

if (primaryColor)
  document.documentElement.style.setProperty('--loader-color', primaryColor)
