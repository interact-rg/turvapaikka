import { Text, View, StyleSheet, Pressable, ImageBackground, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Linking } from "react-native";

export default function YhteystiedotScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../../assets/images/sininen.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Tietoja sovelluksesta</Text>

        <View style={styles.contactItem}>
          <Text style={styles.contactText}>
            Turvapaikka on konsepti tilasta, jonka voit itse määrittää ja jossa voi tuntea
            olonsa turvalliseksi.
          </Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.contactItem}>
          <Text style={styles.contactText}>Sovelluksen ovat toteuttaneet Oulun yliopiston opiskelijat.</Text>
        </View>

        <View style={styles.separator} />

       {/*linkki nettisivuille*/}
       
               
                 <View style={styles.contactItem}>
                   <Pressable
                     onPress={() =>
                       Linking.openURL(
                         "https://pixabay.com/"
                       )
                     }
                   >
                     <Text style={styles.contactText}>
                       Kuvat, videot ja äänet{" "}
                       <Text style={styles.linkText}>Pixabay</Text> {"\n"}
                     </Text>
                   </Pressable>
                 </View>
               

      {/* Tähän listATTUNA LISENSSIT*/}
        <Text style={styles.title}>Lisenssit</Text> 

        <View style={styles.contactItem}>
          <Text style={styles.contactText}>
            react-native-fontawesome{"\n"}MIT licence{"\n"}version 0.3.2
          </Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.contactItem}>
          <Text style={styles.contactText}>
            expo-router{"\n"}MIT licence{"\n"}version 4.0.19
          </Text>
        </View>

        
        <View style={styles.separator} />

        <View style={styles.contactItem}>
          <Text style={styles.contactText}>
          React Native Vector Icons-Ionicons {"\n"}MIT licence{"\n"}version 7.4.0
          </Text>
        </View>

        <View style={styles.separator} />
        
        <View style={styles.contactItem}>
          <Text style={styles.contactText}>
            Linking from react-native{"\n"}MIT licence{"\n"}version 3.2.3
          </Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.contactItem}>
          <Text style={styles.contactText}>
            react-native-reanimated{"\n"}MIT licence{"\n"}version 3.17.1
          </Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.contactItem}>
          <Text style={styles.contactText}>
            expo-av{"\n"}MIT licence{"\n"}version 15.0.2
          </Text>
        </View>

        <View style={styles.separator} />

      {/* pALUUNAPPI NURKASSA*/}

        <Pressable style={styles.backButton} onPress={() => router.push("/valikko")}>
          <Ionicons name="arrow-back" size={28} color="#ffffff" />
        </Pressable>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 80,
    marginBottom: 20,
    color: "#fff",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    width: "100%",
  },
  contactText: {
    fontSize: 18,
    color: "#fff",
  },
  separator: {
    height: 1,
    backgroundColor: "black",
    width: "100%",
    marginVertical: 10,
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 15,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
  },
  linkText: {
    fontSize: 18,
    color: "#00BFFF",
    textDecorationLine: "underline",
  },
});
