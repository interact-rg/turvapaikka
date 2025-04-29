import {
  View,
  ImageBackground,
  Pressable,
  Image,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet
} from "react-native";
import { useColorScheme } from "react-native";
import { Link, useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";

const { width: windowWidth, height: screenHeight } = Dimensions.get('window');
const ListItemWidth = windowWidth / 2.5;

// Harjoituksille kuvat
const exercises = [
  { label: "Lihasrentoutus", route: "/lihasrelaksaatio", image: require("../../assets/images/sininen.png") },
  { label: "Hengitysharjoitus", route: "/breathing-exercise", image: require("../../assets/images/oranssi.png") },
  { label: "5-4-3-2-1 menetelmä", route: "/five-four-three", image: require("../../assets/images/violetti.png") },
  { label: "Tsemppilauseet", route: "/tsemppilauseet", image: require("../../assets/images/keltainen.png") },
];

// Määritellään kuvat turvapaikan sijainnille
const locationImages = {
  'Nuotiolla': require("../../assets/images/nuotio.jpg"),
  'Teltassa': require("../../assets/images/teltta.jpg"),
  'Merenrannalla': require("../../assets/images/merenranta.jpg"),
  'Makuuhuoneessa': require("../../assets/images/makuuhuone.jpg"),
  'Vuoristossa': require("../../assets/images/vuoristo.jpg"),
};

const CircularExerciseItem = ({ exercise, index, contentOffset }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 2) * ListItemWidth,
      (index - 1) * ListItemWidth,
      index * ListItemWidth,
      (index + 1) * ListItemWidth,
      (index + 2) * ListItemWidth,
    ];

    const translateY = interpolate(
      contentOffset.value,
      inputRange,
      [0, -ListItemWidth / 3, -ListItemWidth / 2, -ListItemWidth / 3, 0],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      contentOffset.value,
      inputRange,
      [0.7, 0.9, 1, 0.9, 0.7],
      Extrapolate.CLAMP
    );

    const scale = interpolate(
      contentOffset.value,
      inputRange,
      [0.7, 0.8, 1, 0.8, 0.7],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [
        { translateY },
        { scale },
      ],
    };
  });

  return (
    <Animated.View style={[styles.carouselItem, animatedStyle]}>
      <Link href={exercise.route} asChild>
        <Pressable style={styles.carouselPressable}>
          {/* Taustakuva palloille */}
          <ImageBackground
            source={exercise.image}
            style={styles.carouselImageBackground}
            imageStyle={styles.carouselImage}
          >
            <Text style={styles.carouselTitle}>{exercise.label}</Text>
          </ImageBackground>
        </Pressable>
      </Link>
    </Animated.View>
  );
};

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === "dark" ? "#000000" : "#ffffff";
  const router = useRouter();

  // "Omat turvapaikat" -osio
  let ownSpots = [];

  if (global.sessionSafeSpace && global.sessionSafeSpace.location) {   
    ownSpots.push({
      image: locationImages[global.sessionSafeSpace.location],
      route: "/create-own-safe-space",
      label: global.sessionSafeSpace.location,
    });
  } else {
    ownSpots.push({
      icon: "+",
      route: "/create-own-safe-space",
    });
  }

  // "Valmiit turvapaikat" -osio
  const readySpots = [
    {
      image: require("../../assets/images/makuuhuone.jpg"),
      route: "/relaxation-spots/makuuhuone",
      label: "Makuuhuone",
    },
    {
      image: require("../../assets/images/nuotio.jpg"),
      route: "/relaxation-spots/nuotio",
      label: "Nuotio",
    },
    {
      image: require("../../assets/images/merenranta.jpg"),
      route: "/relaxation-spots/merenranta",
      label: "Merenranta",
    },
    {
      image: require("../../assets/images/teltta.jpg"),
      route: "/relaxation-spots/teltta",
      label: "Teltta",
    },
    {
      image: require("../../assets/images/vuoristo.jpg"),
      route: "/relaxation-spots/vuoristo",
      label: "Vuoristo",
    },
  ];

  const contentOffset = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      contentOffset.value = event.contentOffset.x;
    },
  });

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <ImageBackground
        source={require("../../assets/images/oranssi.png")}
        style={{ flex: 1, overflow: "visible" }}
        resizeMode="cover"
      >
        {/* Yläreunan "hampurilaismenu" */}
        <Link href="../valikko" asChild>
          <Pressable
            style={{ position: "absolute", top: 20, left: 10, zIndex: 10 }}
          >
            <Text style={{ color: "white", fontSize: 30 }}>☰</Text>
          </Pressable>
        </Link>

        {/* Omat turvapaikat -osio */}
        <View
          style={{
            position: "absolute",
            top: 50,
            left: 0,
            right: 0,
            paddingHorizontal: 10,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 5,
            }}
          >
            Oma turvapaikka
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          >
            {ownSpots.map((spot, index) => {
              // Plus-ikoni
              if (spot.icon) {
                return (
                  <Link href={spot.route} key={index} asChild>
                    <Pressable
                      style={{
                        width: 170,
                        aspectRatio: 9 / 11,
                        marginRight: 10,
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          borderRadius: 10,
                          overflow: "hidden",
                          backgroundColor: "rgba(255,255,255,0.2)",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 50,
                            fontWeight: "bold",
                          }}
                        >
                          {spot.icon}
                        </Text>
                      </View>
                    </Pressable>
                  </Link>
                );
              } else {
                // Tallennettu turvapaikka
                return (
                  <Pressable
                    key={index}
                    onPress={async () => {
                      if (
                        global.sessionSafeSpaceSoundObjects &&
                        global.sessionSafeSpaceSoundObjects.length > 0
                      ) {
                        for (const sound of global.sessionSafeSpaceSoundObjects) {
                          await sound.stopAsync();
                        }
                        global.sessionSafeSpaceSoundObjects = [];
                      }
                      router.push(spot.route);
                    }}
                    style={{ width: 170, aspectRatio: 9 / 11, marginRight: 10 }}
                  >
                    <View
                      style={{
                        flex: 1,
                        borderRadius: 10,
                        overflow: "hidden",
                        backgroundColor: "rgba(255,255,255,0.2)",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        style={{ width: "100%", height: "100%" }}
                        source={spot.image}
                        resizeMode="cover"
                      />
                      {spot.label && (
                        <View
                          style={{ position: "absolute", bottom: 5, right: 5 }}
                        >
                          <Text
                            style={{
                              color: "white",
                              fontWeight: "bold",
                              paddingHorizontal: 5,
                              paddingVertical: 2,
                            }}
                          >
                            {spot.label}
                          </Text>
                        </View>
                      )}
                    </View>
                  </Pressable>
                );
              }
            })}
          </ScrollView>
        </View>

        {/* Valmiit turvapaikat -osio */}
        <View
          style={{
            position: "absolute",
            top: 310,
            left: 0,
            right: 0,
            paddingHorizontal: 10,
            elevation: 1,
            zIndex: 0,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 3,
            }}
          >
            Valmiit turvapaikat
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          >
            {readySpots.map((spot, index) => (
              <Link href={spot.route} key={index} asChild>
                <Pressable
                  style={{ width: 170, aspectRatio: 9 / 11, marginRight: 10 }}
                >
                  <View
                    style={{
                      flex: 1,
                      position: "relative",
                      borderRadius: 10,
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      style={{ width: "100%", height: "100%" }}
                      source={spot.image}
                      resizeMode="cover"
                    />
                    <View
                      style={{ position: "absolute", bottom: 10, right: 5 }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          paddingHorizontal: 5,
                          paddingVertical: 2,
                        }}
                      >
                        {spot.label}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </Link>
            ))}
          </ScrollView>
        </View>

        {/* Harjoitukset - Circular Carousel */}
        <View
          style={{
            position: "absolute",
            bottom: -150,
            left: 0,
            right: 0,
            alignItems: "center",
            overflow: "visible",
            elevation: 9999,
            zIndex: 9999,
          }}
        >
          <View style={{ height: screenHeight * 0.5, overflow: "visible" }}>
            <Animated.FlatList
              data={exercises}
              keyExtractor={(_, index) => index.toString()}
              horizontal
              pagingEnabled
              snapToInterval={ListItemWidth}
              scrollEventThrottle={16}
              onScroll={scrollHandler}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: (windowWidth - ListItemWidth) / 2.5,
              }}
              renderItem={({ item, index }) => (
                <CircularExerciseItem
                  exercise={item}
                  index={index}
                  contentOffset={contentOffset}
                />
              )}
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  carouselItem: {
    width: ListItemWidth,
    aspectRatio: 1,
    borderRadius: ListItemWidth / 2,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "rgba(108, 98, 98, 0.5)",
    elevation: 5,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    overflow: "hidden",
  },
  // Pressable, jotta sisältö pysyy pyöreän muodon sisällä
  carouselPressable: {
    width: '100%',
    height: '100%',
    borderRadius: ListItemWidth / 2,
    overflow: 'hidden',
  },
  // ImageBackground venytetään pallon kokoon
  carouselImageBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Taustakuvan pyöristys, sama säde kuin pallossa
  carouselImage: {
    borderRadius: ListItemWidth / 2,
  },
  carouselTitle: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: 'center',
    marginHorizontal: 5,
  },
});
