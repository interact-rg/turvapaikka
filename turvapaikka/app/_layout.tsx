import { Slot } from 'expo-router'
import { View } from 'react-native'
//test
export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Slot /> {/* Tähän tulee nykyinen näyttö */}
    </View>
  )
}
