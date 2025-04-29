import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { Audio } from 'expo-av';

export default function VuoristoScreen() {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#1c1c1c' : '#f5f5f5';
  const textColor = '#ffffff';
  const router = useRouter();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [sleepTimerModalVisible, setSleepTimerModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      let soundObj: Audio.Sound;
      async function loadSound() {
        const { sound } = await Audio.Sound.createAsync(
          require('../../../assets/sounds/forest.mp3'),
          { shouldPlay: true, isLooping: true, volume: 1.0, isMuted: false }
        );
        soundObj = sound;
        setSound(sound);
        setIsMuted(false);
      }
      loadSound();
      return () => {
        if (soundObj) {
          soundObj.stopAsync();
          soundObj.unloadAsync();
        }
        setSound(null);
        setIsMuted(false);
      };
    }, [])
  );

  // Toggleäänen mute-tila
  const toggleMute = async () => {
    if (sound) {
      const newMuted = !isMuted;
      await sound.setIsMutedAsync(newMuted);
      setIsMuted(newMuted);
    }
  };

  // Uniajastin-toiminto
  const handleSleepTimer = () => {
    setSleepTimerModalVisible(true);
  };

  const scheduleSoundStop = (minutes: number) => {
    if (sound) {
      setTimeout(() => {
        sound.stopAsync();
      }, minutes * 60000);
    }
  };

  const handleSleepTimerSelection = (minutes?: number) => {
    if (minutes) {
      scheduleSoundStop(minutes);
    }
    setSleepTimerModalVisible(false);
  };

  // Kun painetaan takaisin-nuolta, pysäytetään ääni ja navigoidaan pois
  const handleBackPress = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsMuted(false);
    }
    router.push('/');
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Taustavideo */}
      <View style={StyleSheet.absoluteFill}>
        <Video
          source={require('../../../assets/videos/vuoristo.mp4')}
          style={StyleSheet.absoluteFill}
          isLooping
          shouldPlay
          resizeMode={ResizeMode.COVER}
        />
      </View>

      {/* Interaktiivinen overlay */}
      <View style={styles.overlay}>
        {/* Takaisin-painike */}
        <Pressable style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={28} color="#ffffff" />
        </Pressable>

        {/* Tekstit */}
        <View style={styles.content}>
          <Text style={[styles.title, { color: textColor }]}>Vuoristo</Text>
          <Text style={[styles.description, { color: textColor }]}>
            Ihaile vuorten majesteettisuutta.
          </Text>
        </View>
      </View>

      {/* Mute-ikoni oikeassa alakulmassa */}
      <Pressable style={styles.muteButton} onPress={toggleMute}>
        <Ionicons name={isMuted ? 'volume-mute' : 'volume-high'} size={28} color="#ffffff" />
      </Pressable>

      {/* Uniajastin-painike ruudun alareunassa keskellä */}
      <Pressable style={styles.sleepTimerButton} onPress={handleSleepTimer}>
        <Text style={styles.sleepTimerText}>Uniajastin</Text>
      </Pressable>

      {/* Uniajastin  */}
      <Modal
        transparent={true}
        visible={sleepTimerModalVisible}
        animationType="fade"
        onRequestClose={() => setSleepTimerModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Uniajastin</Text>
            <Text style={styles.modalMessage}>Valitse aika, jonka jälkeen ääni pysäytetään:</Text>
            <View style={styles.modalButtonsContainer}>
              <Pressable style={styles.modalButton} onPress={() => handleSleepTimerSelection(5)}>
                <Text style={styles.modalButtonText}>5 min</Text>
              </Pressable>
              <Pressable style={styles.modalButton} onPress={() => handleSleepTimerSelection(15)}>
                <Text style={styles.modalButtonText}>15 min</Text>
              </Pressable>
              <Pressable style={styles.modalButton} onPress={() => handleSleepTimerSelection(20)}>
                <Text style={styles.modalButtonText}>30 min</Text>
              </Pressable>
            </View>
            <Pressable style={styles.modalCancelButton} onPress={() => handleSleepTimerSelection()}>
              <Text style={styles.modalCancelButtonText}>Peruuta</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 15,
    zIndex: 20,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  description: {
    fontSize: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  muteButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 20,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  sleepTimerButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    zIndex: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
  },
  sleepTimerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: '#1c1c1c',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalCancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#cccccc',
    borderRadius: 10,
  },
  modalCancelButtonText: {
    color: '#000',
    fontSize: 16,
  },
});
