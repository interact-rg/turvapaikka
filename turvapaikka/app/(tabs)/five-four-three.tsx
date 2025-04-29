import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet, ImageBackground } from 'react-native';
import { Link } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Senses {
  see: string;
  hear: string;
  touch: string;
  smell: string;
  taste: string;
}

// Tämä harjoitus auttaa käyttäjää havainnoimaan ympäristöään

export default function FiveFourThreeTwoOneScreen() {

  const router = useRouter();

  const textColor = '#ffffff';

  const [senses, setSenses] = useState<Senses>({
    see: '',
    hear: '',
    touch: '',
    smell: '',
    taste: '',
  });

  const handleInputChange = (name: keyof Senses, value: string) => {
    setSenses({
      ...senses,
      [name]: value,
    });
  };

  return (
    <ImageBackground
      source={require('../../assets/images/violetti.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >

{/* Takaisin-nuoli vasempaan ylänurkkaan, resetoi tekstikentät */}

<Pressable
  style={styles.backButton}
  onPress={() => {
    setSenses({
      see: '',
      hear: '',
      touch: '',
      smell: '',
      taste: '',
    });
    router.push("/");
  }}
>
  <Ionicons name="arrow-back" size={28} color="#ffffff" />
</Pressable>
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* Otsikko */}
          <Text style={styles.header}>5-4-3-2-1 Menetelmä</Text>

          {/* Ohjeet */}
          <Text style={styles.instructions}>
            Tämä harjoitus auttaa sinua keskittymään ympäristöösi ja rauhoittumaan. Kirjoita alla oleviin kenttiin, mitä näet, kuulet, tunnet, haistat ja maistat.
          </Text>

          {/* Näe */}
          <Text style={styles.label}>5 asiaa, jotka näet</Text>
          <TextInput
            style={[styles.input]}
            placeholder="Voit kirjoittaa tähän..."
            placeholderTextColor="#fff"
            value={senses.see}
            onChangeText={(text) => handleInputChange('see', text)}
            multiline
          />

          {/* Kuule */}
          <Text style={styles.label}>4 asiaa, jotka kuulet</Text>
          <TextInput
            style={[styles.input]}
            placeholder="Voit kirjoittaa tähän..."
            placeholderTextColor="#fff"
            value={senses.hear}
            onChangeText={(text) => handleInputChange('hear', text)}
            multiline
          />

          {/* Tunne */}
          <Text style={styles.label}>3 asiaa, joita tunnet</Text>
          <TextInput
            style={[styles.input]}
            placeholder="Voit kirjoittaa tähän..."
            placeholderTextColor="#fff"
            value={senses.touch}
            onChangeText={(text) => handleInputChange('touch', text)}
            multiline
          />

          {/* Haista */}
          <Text style={styles.label}>2 asiaa, joita haistat</Text>
          <TextInput
            style={[styles.input]}
            placeholder="Voit kirjoittaa tähän..."
            placeholderTextColor="#fff"
            value={senses.smell}
            onChangeText={(text) => handleInputChange('smell', text)}
            multiline
          />

          {/* Maista */}
          <Text style={styles.label}>1 asia, jonka maistat</Text>
          <TextInput
            style={[styles.input]}
            placeholder="Voit kirjoittaa tähän..."
            placeholderTextColor="#fff"
            value={senses.taste}
            onChangeText={(text) => handleInputChange('taste', text)}
            multiline
          />

        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    marginTop: 65,
    textAlign: 'center',
  },
  instructions: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  button: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 15,
    zIndex: 10,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
  },
});
