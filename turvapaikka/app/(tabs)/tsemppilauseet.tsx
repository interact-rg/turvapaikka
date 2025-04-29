import React from 'react';
import { View, Text, Dimensions, StyleSheet, Pressable, ImageBackground } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width: windowWidth, height: screenHeight } = Dimensions.get('window');
const ITEM_WIDTH = windowWidth * 0.7;
const ITEM_HEIGHT = screenHeight * 0.8;
const ITEM_MARGIN = 8;
const ITEM_FULL_WIDTH = ITEM_WIDTH + ITEM_MARGIN * 2;
const SIDE_PADDING = (windowWidth - ITEM_FULL_WIDTH) / 2;

const encouragements = [
  'Tee asioita, jotka tekevät sinut iloiseksi.',
  'Luota itseesi. Olet selvinnyt niin paljosta. Ja tulet selviämään.',
  'Sinä olet vahvempi kuin uskotkaan.',
  'Sinun tunteesi ovat tärkeitä.',
  'Sinä ansaitset hyvää.',
  'Sinä olet tärkeä.',
  'Sinä riität.',
  'Aina on toivoa.',
  'Sinä pystyt siihen!',
  'Pienet askeleet vievät pitkälle.',
  'Sinä olet vahvempi kuin uskotkaan.',
  'Sinun tunteesi ovat tärkeitä.',
  'Sinä olet tärkeä.',
  'Jonain päivänä tiedät, että selvisit tästäkin.',
  'Elämä on täynnä mahdollisuuksia.',
  'Ole lempeä itsellesi.',
  'On okei pyytää apua.',
  'Pimeyden jälkeen tulee aina valo.',
  'Jokainen askel eteenpäin on voitto.',
  'Tee asioita, jotka tekevät sinut iloiseksi.',
];

type CarouselItemProps = {
  quote: string;
  index: number;
  scrollX: Animated.SharedValue<number>;
};

const CarouselItem: React.FC<CarouselItemProps> = ({ quote, index, scrollX }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * ITEM_FULL_WIDTH,
      index * ITEM_FULL_WIDTH,
      (index + 1) * ITEM_FULL_WIDTH,
    ];
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      Extrapolate.CLAMP
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.7, 1, 0.7],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.itemContainer, animatedStyle]}>
      {/* Kortin taustakuva */}
      <ImageBackground
        source={require('../../assets/images/taustakuvaTsemppi.jpeg')} // <- vaihda polku omasi mukaan
        style={styles.cardBackground}
        imageStyle={styles.cardImage}
      >
        <Text style={styles.quoteText}>{quote}</Text>
      </ImageBackground>
    </Animated.View>
  );
};

export default function Tsemppilauseet() {
  const scrollX = useSharedValue(0);
  const router = useRouter();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <ImageBackground
      source={require('../../assets/images/keltainen.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <Pressable style={styles.backButton} onPress={() => router.push('/')}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </Pressable>

      <View style={styles.leftArrow} pointerEvents="none">
        <Ionicons name="chevron-back" size={48} color="#fff" />
      </View>

      <View style={styles.rightArrow} pointerEvents="none">
        <Ionicons name="chevron-forward" size={48} color="#fff" />
      </View>

      <Animated.FlatList
        data={encouragements}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_FULL_WIDTH}
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: SIDE_PADDING }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => (
          <CarouselItem quote={item} index={index} scrollX={scrollX} />
        )}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: screenHeight,
    justifyContent: 'center',
    paddingTop: 95,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 15,
    zIndex: 10,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 20,
    marginHorizontal: ITEM_MARGIN,
    borderWidth: 2,
    borderColor: '#fff',
    borderStyle: 'solid',
    overflow: 'hidden',
  },
  cardBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
    borderRadius: 20,
  },
  quoteText: {
    color: '#fff',
    fontSize: 25,
    textAlign: 'center',
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
  leftArrow: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: [{ translateY: -24 }],
    zIndex: 20,
    padding: 5,
  },
  rightArrow: {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: [{ translateY: -24 }],
    zIndex: 20,
    padding: 5,
  },
});
