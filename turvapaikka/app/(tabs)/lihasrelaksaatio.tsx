import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ImageBackground } from 'react-native';
import { Link } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type Step = {
  muscle: string;
  instruction: string;
};

const Lihasrelaksaatio: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const colorScheme = useColorScheme();
  const router = useRouter();

  // Harjoituksen vaiheet
  const steps: Step[] = [
    { muscle: "Otsa", instruction: "Rutista otsasi ja pidä 5 sekuntia." },
    { muscle: "Silmät", instruction: "Sulje silmäsi tiukasti ja pidä 5 sekuntia." },
    { muscle: "Nenä", instruction: "Nyrpistele nenääsi 5 sekuntia." },
    { muscle: "Kaula", instruction: "Jännitä kaulaasi ja pidä 5 sekuntia." },
    { muscle: "Olkapäät", instruction: "Nosta olkapäitäsi ylös ja pidä 5 sekuntia." },
    { muscle: "Kädet", instruction: "Jännitä käsivartesi ja pidä 5 sekuntia." },
    { muscle: "Nyrkit", instruction: "Purista nyrkkejäsi tiukasti ja pidä 5 sekuntia." },
    { muscle: "Vatsa", instruction: "Jännitä vatsalihaksesi ja pidä 5 sekuntia." },
    { muscle: "Pakarat", instruction: "Jännitä pakaroitasi ja pidä 5 sekuntia." },
    { muscle: "Jalat", instruction: "Jännitä reitesi ja pidä 5 sekuntia." },
    { muscle: "Jalkapohjat", instruction: "Tee jalkapohjillesi jännitys ja pidä 5 sekuntia." },
  ];

  // Funktio, joka siirtää käyttäjän seuraavaan vaiheeseen
  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Jos ollaan viimeisessä vaiheessa, lopetetaan harjoitus ja palautetaan alkuun
      setIsRunning(false);
      setStep(0);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/sininen.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {/* Takaisin-nuoli vasempaan ylänurkkaan */}
      <Pressable style={styles.backButton} onPress={() => router.push("/")}>
        <Ionicons name="arrow-back" size={28} color="#ffffff" />
      </Pressable>

      <View style={styles.overlay}>
        <Text style={styles.title}>Lihasrentoutus</Text>
        {isRunning ? (
          <View style={styles.content}>
            <Text style={styles.stepText}>Vaihe {step + 1}/{steps.length}</Text>
            <Text style={styles.muscleText}>{steps[step].muscle}</Text>
            <Text style={styles.instructionText}>{steps[step].instruction}</Text>
            <Pressable style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Seuraava</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => { setIsRunning(false); setStep(0); }}>
              <Text style={styles.buttonText}>Takaisin</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.button} onPress={() => setIsRunning(true)}>
            <Text style={styles.buttonText}>Aloita harjoitus</Text>
          </Pressable>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  stepText: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 10,
  },
  muscleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 25,
    paddingHorizontal: 32,
    paddingVertical: 16,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
  },
});

export default Lihasrelaksaatio;
