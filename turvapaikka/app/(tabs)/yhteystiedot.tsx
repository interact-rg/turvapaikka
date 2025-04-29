import {Text, View, StyleSheet, Pressable, ImageBackground} from "react-native";
import { useRouter } from "expo-router";
import { Link } from "expo-router";
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
      {/*Otsikko*/}
      <View style={styles.container}>
        <Text style={styles.title}>Yhteystiedot</Text>

        {/*Tieto-osio*/}

        <View style={styles.contactItem}>
          <Text style={styles.firstText}>
          Älä epäröi ottaa yhteyttä, jos haluat keskustella tilanteestasi, sinulla on kysymyksiä tai lisätiedon tarve. Aina on mahdollisuus muutokseen.</Text>
        </View>

        <View style={styles.separator} />

        {/*Puhelinnumero*/}

        <View style={styles.contactItem}>
          <FontAwesome
            name="phone"
            size={24}
            color="gray"
            style={styles.icon}
          />
          <Text style={styles.contactText}>
            Oulun ensi- ja turvakodin 24/7 päivystysnumero{" "}
            <Text style={styles.linkText}>0400 581606</Text> 
          </Text>
        </View>

        <View style={styles.separator} />

        {/*linkki nettisivuille*/}

        <View style={styles.contactItem}>
          <FontAwesome
            name="link"
            size={24}
            color="gray"
            style={styles.icon}
          />
          <View>
            <Pressable
              onPress={() =>
                Linking.openURL(
                  "https://ensijaturvakotienliitto.fi/oulunensijaturvakoti/"
                )
              }
            >
              <Text style={styles.contactText}>
                Ensi- ja turvakotien liiton{" "}
                <Text style={styles.linkText}>sivuilta</Text> {"\n"}löydät chat-apua ja eri teitä avun saamiseksi.
              </Text>
            </Pressable>
          </View>
        </View>

        {/*Paluunuoli*/}
        <Pressable
          style={styles.backButton}
          onPress={() => router.push("/valikko")}
        >
          <Ionicons name="arrow-back" size={28} color="#ffffff" />
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
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
  icon: {
    marginRight: 10,
    marginTop: 3,
    color: "#fff",
  },
  firstText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center", 
    width: "100%", 
    paddingHorizontal: 20

  },
  contactText: {
    fontSize: 18,
    color: "#fff",
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    width: "100%",
    marginVertical: 10,
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
  linkText: {
    fontSize: 18,
    color: "#00BFFF",
    textDecorationLine: "underline",
  },
});
