import { useColorScheme } from 'react-native'

export function useThemeColor() {
  const colorScheme = useColorScheme()
  return colorScheme === 'dark' ? '#000000' : '#ffffff'
}