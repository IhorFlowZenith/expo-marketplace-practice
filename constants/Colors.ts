const palette = {
  primary: '#6055D8',
  primaryLight: '#6C63FF',

  error: '#FF4444',
  success: '#4CAF50',
  warning: '#FF7A50',
  google: '#DB4437',

  white: '#FFFFFF',
  black: '#000000',
  textMuted: '#8E8E93',
  iconMuted: '#666666',
  placeholder: '#999999',
  gray: 'gray',

  cardLight: '#F8F7F7',
  accentBgLight: '#F0EEFF',
  inputBgLight: '#F5F6F8',
  borderLight: '#DADCE0',
  switchTrackOff: '#767577',
  switchThumb: '#f4f3f4',

  cardDark: '#1C1C1E',
  accentBgDark: '#2C2C2E',
  borderDark: '#3A3A3C',
};

export default {
  palette,
  light: {
    text: '#000',
    background: '#fff',
    tint: palette.primaryLight,
    tabIconDefault: '#ccc',
    tabIconSelected: palette.primaryLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: '#fff',
    tabIconDefault: '#ccc',
    tabIconSelected: '#fff',
  },
};
