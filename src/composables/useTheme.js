import { ref } from 'vue';
import { THEME_CONFIG } from '@/utils/baseConfig';

const getPreferredTheme = () => {
  if (typeof window === 'undefined') {
    return THEME_CONFIG.defaultTheme;
  }

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme && THEME_CONFIG[savedTheme]) {
    return savedTheme;
  }

  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return THEME_CONFIG.defaultTheme;
};

const theme = ref(getPreferredTheme());
let initialized = false;
let colorSchemeQuery = null;

const setThemeVariables = (selectedTheme) => {
  const root = document.documentElement;
  const themeVars = THEME_CONFIG[selectedTheme] || THEME_CONFIG[THEME_CONFIG.defaultTheme];

  root.style.setProperty('--theme-color', themeVars.primaryColor);
  root.style.setProperty('--theme-color-rgb', themeVars.primaryColorRgb);
  root.style.setProperty('--theme-hover-color', themeVars.primaryColorHover);
  root.style.setProperty('--primary-color-hover', themeVars.primaryColorHover);
  root.style.setProperty('--background-color', themeVars.backgroundColor);
  root.style.setProperty('--card-background', themeVars.cardBackground);
  root.style.setProperty('--text-color', themeVars.textColor);
  root.style.setProperty('--secondary-text-color', themeVars.secondaryTextColor);
  root.style.setProperty('--border-color', themeVars.borderColor);
  root.style.setProperty('--shadow-color', themeVars.shadowColor);
};

const applyTheme = (selectedTheme = theme.value) => {
  if (typeof document === 'undefined') {
    return;
  }

  theme.value = selectedTheme;
  document.body.classList.toggle('dark-theme', selectedTheme === 'dark');
  setThemeVariables(selectedTheme);
};

const handleSystemThemeChange = (event) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (!localStorage.getItem('theme')) {
    applyTheme(event.matches ? 'dark' : 'light');
  }
};

const initTheme = () => {
  if (initialized || typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  applyTheme(getPreferredTheme());

  if (window.matchMedia) {
    colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    colorSchemeQuery.addEventListener('change', handleSystemThemeChange);
  }

  initialized = true;
};

const toggleTheme = () => {
  const nextTheme = theme.value === 'light' ? 'dark' : 'light';
  theme.value = nextTheme;

  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', nextTheme);
  }

  applyTheme(nextTheme);
};

export function useTheme() {
  initTheme();

  return {
    theme,
    toggleTheme,
    applyTheme
  };
}
