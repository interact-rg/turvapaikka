import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  ImageBackground,
  StyleSheet,
  Modal
} from 'react-native';
import { Audio } from 'expo-av';
import { useColorScheme } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CreateSafeSpace() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  // Vaiheet: 1: seuralaisen valinta, 2: sijainnin valinta, 3: ääniraidan valinta, 5: lopullinen näkymä
  const [step, setStep] = useState(1);

  // "companion" ja "location" ovat merkkijonoja
  const [companion, setCompanion] = useState(null);
  const [location, setLocation] = useState(null);

  // "soundId" on merkkijono (esim. 'rain', 'waves', 'forest'),
  // "soundObj" on varsinainen Sound-olio (expo-av).
  const [soundId, setSoundId] = useState(null);
  const [soundObj, setSoundObj] = useState(null);

  const [isMuted, setIsMuted] = useState(false);
  const [sleepTimerModalVisible, setSleepTimerModalVisible] = useState(false);

  // Ääniraidat
  const sounds = [
    { id: 'rain',   name: 'Sade',   uri: require('../../assets/sounds/rain.mp3') },
    { id: 'waves',  name: 'Aallot', uri: require('../../assets/sounds/waves.mp3') },
    { id: 'forest', name: 'Metsä',  uri: require('../../assets/sounds/forest.mp3') },
    { id: 'jazz', name: 'Rentouttava jazz',  uri: require('../../assets/sounds/jazz-charm-loop-312715.mp3') },
    { id: 'fireplace', name: 'Nuotio',  uri: require('../../assets/sounds/fireplace-6160.mp3') },
    { id: 'piano', name: 'Rauhoittava piano',  uri: require('../../assets/sounds/the-last-piano-112677.mp3') },
  ];

  // Taustakuvat
  const locationImages = {
    Nuotiolla: require('../../assets/images/nuotio.jpg'),
    Teltassa: require('../../assets/images/teltta.jpg'),
    Merenrannalla: require('../../assets/images/merenranta.jpg'),
    Makuuhuoneessa: require('../../assets/images/makuuhuone.jpg'),
    Vuoristossa: require('../../assets/images/vuoristo.jpg'),
  };

  // Pysäyttää ja purkaa Sound-olion
  const stopSound = useCallback(async () => {
    if (soundObj) {
      try {
        const status = await soundObj.getStatusAsync();
        if (status.isLoaded) {
          await soundObj.stopAsync();
          await soundObj.unloadAsync();
        }
      } catch (error) {
        if (!error.message?.includes('Player does not exist')) {
          console.warn('Virhe ääntä pysäyttäessä:', error);
        }
      } finally {
        setSoundObj(null);
      }
    }
  }, [soundObj]);

  // Soittaa äänitiedoston (playSound) pysäyttäen mahdollisen vanhan Sound-olion
  const playSound = useCallback(
    async (uri) => {
      // Ensin pysäytetään aiempi sointi
      await stopSound();

      // Luodaan uusi Sound-olio
      try {
        const { sound } = await Audio.Sound.createAsync(uri, {
          shouldPlay: true,
          isLooping: true,
          volume: 1.0,
          isMuted: false,
        });
        setSoundObj(sound);
        await sound.playAsync();
      } catch (error) {
        if (!error.message?.includes('Player does not exist')) {
          console.warn('Virhe ääntä luodessa:', error);
        }
      }
    },
    [stopSound]
  );

  // Kun turvapaikka on "valmis" (step === 5), tallennetaan tiedot sessioon
  useEffect(() => {
    if (step === 5) {
      global.sessionSafeSpace = { companion, location, soundId };
    }
  }, [step, companion, location, soundId]);

  // Palauttaa sessiosta mahdollisen valmiin turvapaikan tiedot.
  // useFocusEffect ajetaan joka kerta kun navigoidaan tälle sivulle.
  useFocusEffect(
    useCallback(() => {
      if (global.sessionSafeSpace) {
        setStep(5);
        setCompanion(global.sessionSafeSpace.companion);
        setLocation(global.sessionSafeSpace.location);
        setSoundId(global.sessionSafeSpace.soundId);

        // Käynnistetään ääni vain jos meillä ei vielä ole Sound-oliota
        if (!soundObj) {
          const foundSound = sounds.find((s) => s.id === global.sessionSafeSpace.soundId);
          if (foundSound) {
            playSound(foundSound.uri);
          }
        }
      }

      // Kun näkymältä poistutaan
      return () => {
        stopSound();
      };
    }, [playSound, stopSound, soundObj])
  );

  // Mute / unmute -nappi
  const toggleMute = async () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);

    if (soundObj) {
      try {
        await soundObj.setIsMutedAsync(newMuted);
      } catch (error) {
        console.warn('Virhe mute-toiminnossa:', error);
      }
    }
  };




  // Final view: takaisin-nappi
  const handleBackPress = async () => {
    // Pysäytetään ääni
    await stopSound();
    router.push('/');
  };

  // Turvapaikan poistaminen ja siirtyminen takaisin vaiheeseen 1
  const handleResetSafeSpace = async () => {
    // Pysäytetään ääni
    await stopSound();
    // Tyhjennetään session turvapaikka
    global.sessionSafeSpace = null;
    // Nollataan omat tilat
    setCompanion(null);
    setLocation(null);
    setSoundId(null);
    // Palataan luomisvaiheeseen 1
    setStep(1);
  };

  // Tekstien generointi final-näkymään
  const getFinalTitle = () => location || 'Turvapaikka';
  const getFinalDescription = () => {
    if (!location) return '';
    return companion === 'yksin'
      ? `Nauti rauhasta ja yksinolosta ${location.toLowerCase()}.`
      : `Nauti yhdessäolosta ja turvallisuudesta ${location.toLowerCase()}.`;
  };

  // Luomisvaiheen alaotsikko
  const getSubHeaderText = () => {
    if (step === 1) return 'Ketä turvapaikassasi on?';
    if (step === 2) return 'Missä olet?';
    if (step === 3) return 'Mitä ympärilläsi kuuluu?';
    return '';
  };

  // Jos turvapaikka on valmis (step === 5)
  if (step === 5) {
    return (
      <View style={styles.finalContainer}>
        <ImageBackground
          source={locationImages[location]}
          pointerEvents="none"
          style={styles.finalBackground}
          resizeMode="cover"
        />
        <View style={styles.finalOverlay}>
          <View style={styles.finalContent}>
            <Text style={styles.finalTitle}>{getFinalTitle()}</Text>
            <Text style={styles.finalDescription}>{getFinalDescription()}</Text>
          </View>
        </View>

        {/* Mute-ikoni oikeassa alakulmassa */}
        <Pressable style={styles.muteButton} onPress={toggleMute}>
          <Ionicons name={isMuted ? 'volume-mute' : 'volume-high'} size={28} color="#ffffff" />
        </Pressable>

        {/* Takaisin -nappi (oikea yläkulma) */}
        <Pressable style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={28} color="#ffffff" />
        </Pressable>

        {/* vasempaan alanurkkaan */}
        <Pressable style={styles.resetButton} onPress={handleResetSafeSpace}>
          <Ionicons name="trash" size={28} color="#ffffff" />
        </Pressable>



        {/* Modal uniajastimelle. Tämä ei ole käytössä*/}
        <Modal
          transparent
          visible={sleepTimerModalVisible}
          animationType="fade"
          onRequestClose={() => setSleepTimerModalVisible(false)}
        >
          <View style={styles.finalModalOverlay}>
            <View style={styles.finalModalContainer}>
              <Text style={styles.finalModalTitle}>Uniajastin</Text>
              <Text style={styles.finalModalMessage}>
                Valitse aika, jonka jälkeen ääni pysäytetään:
              </Text>
              <View style={styles.finalModalButtonsContainer}>
                <Pressable
                  style={styles.finalModalButton}
                  onPress={() => handleSleepTimerSelection(5)}
                >
                  <Text style={styles.finalModalButtonText}>5 min</Text>
                </Pressable>
                <Pressable
                  style={styles.finalModalButton}
                  onPress={() => handleSleepTimerSelection(15)}
                >
                  <Text style={styles.finalModalButtonText}>15 min</Text>
                </Pressable>
                <Pressable
                  style={styles.finalModalButton}
                  onPress={() => handleSleepTimerSelection(20)}
                >
                  <Text style={styles.finalModalButtonText}>20 min</Text>
                </Pressable>
              </View>
              <Pressable
                style={styles.finalModalCancelButton}
                onPress={() => handleSleepTimerSelection()}
              >
                <Text style={styles.finalModalCancelButtonText}>Peruuta</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // Luomisvaiheet (1–3)
  return (
    <ImageBackground
      source={require('../../assets/images/keltainen.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <Pressable style={styles.backButton} onPress={() => router.push('/')}>
        <Ionicons name="arrow-back" size={28} color="#ffffff" />
      </Pressable>
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text style={styles.header}>Luo oma turvapaikka</Text>
          <Text style={styles.subHeader}>{getSubHeaderText()}</Text>

          {step === 1 && (
            <View>
              <Pressable onPress={() => setCompanion('yksin')} style={styles.box}>
                <Text style={styles.boxText}>Olen yksin</Text>
              </Pressable>
              <Pressable onPress={() => setCompanion('seurassa')} style={styles.box}>
                <Text style={styles.boxText}>Olen jonkun seurassa</Text>
              </Pressable>
              {companion && (
                <Pressable onPress={() => setStep(2)} style={styles.button}>
                  <Text style={styles.buttonText}>Jatka</Text>
                </Pressable>
              )}
            </View>
          )}

          {step === 2 && (
            <View>
              <ScrollView>
                {['Nuotiolla', 'Teltassa', 'Merenrannalla', 'Makuuhuoneessa', 'Vuoristossa'].map(
                  (loc) => (
                    <Pressable
                      key={loc}
                      onPress={() => setLocation(loc)}
                      style={[
                        styles.box,
                        location === loc && { borderColor: 'yellow' }
                      ]}
                    >
                      <Text style={styles.boxText}>{loc}</Text>
                    </Pressable>
                  )
                )}
              </ScrollView>
              {location && (
                <>
                  <Image
                    source={locationImages[location]}
                    style={styles.locationImage}
                    resizeMode="cover"
                  />
                  <Pressable onPress={() => setStep(3)} style={styles.button}>
                    <Text style={styles.buttonText}>Jatka</Text>
                  </Pressable>
                </>
              )}
            </View>
          )}

        {step === 3 && (
          <View>
            {sounds.map((s) => (
              <Pressable
                key={s.id}
                onPress={async () => {
                  setSoundId(s.id);
                  await playSound(s.uri);

                }}
                style={[
                  styles.box,
                  soundId === s.id && { borderColor: 'yellow' }
                ]}
              >
                <Text style={styles.boxText}>{s.name}</Text>
              </Pressable>
            ))}
            {/* Näytetään "Jatka"-painike vain, kun jokin ääni on valittu */}
            {soundId && (
              <Pressable onPress={() => setStep(5)} style={styles.button}>
                <Text style={styles.buttonText}>Jatka</Text>
              </Pressable>
            )}
          </View>
        )}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
    padding: 20,
    paddingTop: 95,
  },
  contentContainer: { paddingBottom: 20 },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 20,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  box: {
    backgroundColor: 'transparent',
    borderRadius: 25,
    padding: 20,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
  boxText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'transparent',
    borderRadius: 25,
    padding: 20,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
  },
  buttonText: { fontSize: 18, color: 'white', fontWeight: 'bold' },
  locationImage: {
    width: 200,
    height: 200,
    borderRadius: 25,
    marginBottom: 20,
    alignSelf: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 15,
    zIndex: 99,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  // Final-näkymän tyylit
  finalContainer: { flex: 1 },
  finalBackground: { ...StyleSheet.absoluteFillObject },
  finalOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finalContent: { paddingHorizontal: 20, alignItems: 'center' },
  finalTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    color: '#fff',
  },
  finalDescription: {
    fontSize: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    color: '#fff',
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
  resetButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    zIndex: 20,
    padding: 10,
    backgroundColor: 'rgba(255,0,0,0.5)',
    borderRadius: 20,
  },
  finalSleepTimerButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    zIndex: 50,
    elevation: 10,
  },
  finalSleepTimerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  finalModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  finalModalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  finalModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  finalModalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  finalModalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  finalModalButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: '#1c1c1c',
    borderRadius: 10,
    alignItems: 'center',
  },
  finalModalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  finalModalCancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#cccccc',
    borderRadius: 10,
  },
  finalModalCancelButtonText: {
    color: '#000',
    fontSize: 16,
  },
});
