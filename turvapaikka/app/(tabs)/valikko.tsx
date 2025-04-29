import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ImageBackground,
  Image
} from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function MenuPage() {
  const router = useRouter();
  return (
    <ImageBackground
      source={require("../../assets/images/sininen.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Valikko</Text>

        <Link href="/yhteystiedot" asChild>
          <Pressable style={styles.menuItem}>
            <FontAwesome
              name="address-book"
              size={24}
              color="gray"
              style={styles.icon}
            />
            <Text style={styles.menuText}>Yhteystiedot</Text>
            <FontAwesome
              name="chevron-right"
              size={18}
              color="gray"
              style={styles.arrow}
            />
          </Pressable>
        </Link>

        <Link href="/tietoja" asChild>
          <Pressable style={styles.menuItem}>
            <FontAwesome
              name="info-circle"
              size={24}
              color="gray"
              style={styles.icon}
            />
            <Text style={styles.menuText}>Tietoja sovelluksesta</Text>
            <FontAwesome
              name="chevron-right"
              size={18}
              color="gray"
              style={styles.arrow}
            />
          </Pressable>
        </Link>

        <Image 
        source={require('../../assets/images/OETK_logo.png')} 
        style={styles.image}
      />


        <Pressable style={styles.backButton} onPress={() => router.push("/")}>
          <Ionicons name="arrow-back" size={28} color="#ffffff" />
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
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
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    width: "100%",
  },

  icon: {
    marginRight: 10,
    color: "#fff",
  },
  menuText: {
    fontSize: 18,
    color: "#fff",
    flex: 1,
  },
  arrow: {},
  backButton: {
    position: "absolute",
    top: 30,
    left: 15,
    zIndex: 10,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
  },
  
  version: {
    fontSize: 12,
    color: "gray",
    marginTop: 50,
  },
  image: {
    width: 190,
    height: 190,
    resizeMode: "contain",
  marginBottom: 30,
  marginTop: 200,
    
  },
});
