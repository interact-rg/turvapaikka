import { Tabs } from 'expo-router'
import {Stack} from 'expo-router'
import React from 'react'
import { Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useColorScheme } from 'react-native'

export default function TabLayout() {
  const colorScheme = useColorScheme()
  const tabBarBackgroundColor = colorScheme === 'dark' ? '#1c1c1c' : '#ffffff'
  const tabBarActiveTintColor = colorScheme === 'dark' ? '#ffffff' : '#000000'
  const tabBarInactiveTintColor = colorScheme === 'dark' ? '#888888' : '#666666'


// Tämä ei ole käytössä. ALuksi alapalkki oli käytössä, jonka takia tiedostorakenne tehtiin tähän tapaan.
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tabBarActiveTintColor,
        tabBarInactiveTintColor: tabBarInactiveTintColor,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tabBarBackgroundColor,
          borderTopWidth: 0,
          elevation: 0,
          display: 'none' // Piilotetaan alapalkki
        },
      }}
    >
      {/* Home-välilehti */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Koti',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />

      {/* Luo turvapaikka -välilehti */}
       <Tabs.Screen
        name="create-own-safe-space"
        options={{
            title: 'Luo turvapaikka',
            tabBarIcon: ({ color }) => (
               <Ionicons name="add-circle" size={24} color={color} />
            ),
           }}
        />
    </Tabs>
  )
}