import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Animated, Pressable, ImageBackground, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function BreathingExercisesScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const [isBreathing, setIsBreathing] = useState(false);
  const [breathText, setBreathText] = useState('Hengitä sisään');
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let animation = null;

    if (isBreathing) {
      // Aloitetaan hengitysanimaatio: pallo kasvaa ja kutistuu
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.5,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();

      // Vaihdetaan hengitystekstiä 4 sekunnin välein
      const interval = setInterval(() => {
        setBreathText((prev) =>
          prev === 'Hengitä sisään' ? 'Hengitä ulos' : 'Hengitä sisään'
        );
      }, 4000);

      return () => {
        if (animation) animation.stop();
        clearInterval(interval);
      };
    } else {
      scaleAnim.stopAnimation();
      scaleAnim.setValue(1);
      setBreathText('Hengitä sisään');
    }
  }, [isBreathing, scaleAnim]);

  const startBreathing = () => {
    setIsBreathing(true);
  };

  const stopBreathing = () => {
    setIsBreathing(false);
  };

  return (
    <ImageBackground
      source={require('../../assets/images/oranssi.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {/* Takaisin-nuoli vasempaan ylänurkkaan – lopettaa harjoituksen ennen paluuta */}
      <Pressable
        style={styles.backButton}
        onPress={() => {
          stopBreathing();
          router.push("/");
        }}
      >
        <Ionicons name="arrow-back" size={28} color="#ffffff" />
      </Pressable>

      <View style={styles.overlay}>
        {/* Siirretään tekstiä ylemmäs */}
        <Text style={styles.header}>Hengitysharjoitus</Text>

        <Animated.View
          style={[
            styles.circle,
            { transform: [{ scale: scaleAnim }], marginVertical: 40 },
          ]}
        >
          <Text style={styles.circleText}>{breathText}</Text>
        </Animated.View>

        {/* Toggle-painike "Aloita" / "Lopeta" – siirretty alemmaksi */}
        <Pressable
          onPress={isBreathing ? stopBreathing : startBreathing}
          style={[styles.singleBox, { marginTop: 80 }]}
        >
          <Text style={styles.buttonText}>{isBreathing ? 'Lopeta' : 'Aloita'}</Text>
        </Pressable>
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
    // Muutettu keskityksestä yläreunaan
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    // Voit säätää tätä arvoa siirtääksesi tekstiä vielä ylemmäs
    marginBottom: 100,
    textAlign: 'center',
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#eda296',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  circleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  singleBox: {
    marginTop: 80,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'transparent',
    paddingHorizontal: 32,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
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
