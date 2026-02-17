import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { toggleFavorite, getFavorites } from "../utils/favoriteHelper";

export default function PetDetailsScreen({ route, navigation }) {

  const { pet } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", checkFavorite);
    return unsubscribe;
  }, [navigation]);

  // ⭐ CHECK FAVORITE
  const checkFavorite = async () => {
    const favs = await getFavorites();
    const exists = favs.find((p) => p.id === pet.id);
    setIsFavorite(!!exists);
  };

  // ⭐ TOGGLE FAVORITE
  const handleFavorite = async () => {
    await toggleFavorite(pet);
    setIsFavorite(!isFavorite);
  };

  // ⭐ ADOPT EMAIL FUNCTION
  const handleAdopt = () => {

    const email = pet.owner?.email;

    if (!email) {
      Alert.alert("Owner email not available");
      return;
    }

    const subject = `Interested in adopting ${pet.name}`;

    const body =
`Hi,

I am interested in adopting ${pet.name}.

Pet Details:
Breed: ${pet.breed}
Age: ${pet.age}

Please share more details.

Thank You`;

    const url =
      `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* BACK BUTTON */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* PET IMAGE */}
      <Image source={{ uri: pet.image }} style={styles.petImage} />

      <View style={styles.content}>

        {/* NAME + FAVORITE */}
        <View style={styles.titleRow}>
          <Text style={styles.petName}>{pet.name}</Text>

          <TouchableOpacity onPress={handleFavorite}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={26}
              color={isFavorite ? "red" : "black"}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.address}>{pet.address || "India"}</Text>

        {/* INFO CARDS */}
        <View style={styles.infoContainer}>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Age</Text>
            <Text style={styles.infoValue}>{pet.age}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Breed</Text>
            <Text style={styles.infoValue}>{pet.breed}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Category</Text>
            <Text style={styles.infoValue}>{pet.category}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Weight</Text>
            <Text style={styles.infoValue}>{pet.weight || "N/A"}</Text>
          </View>

        </View>

        {/* ABOUT */}
        <Text style={styles.aboutTitle}>About {pet.name}</Text>
        <Text style={styles.aboutText}>
          {pet.about || "Friendly and playful companion."}
        </Text>

        {/* OWNER CARD */}
        <View style={styles.ownerCard}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
            style={styles.ownerImage}
          />

          <View>
            <Text style={styles.ownerName}>
              {pet.owner?.name || "Pet Owner"}
            </Text>

            <Text style={styles.ownerRole}>
              {pet.owner?.email || "No email"}
            </Text>
          </View>
        </View>

      </View>

      {/* ADOPT BUTTON */}
      <TouchableOpacity style={styles.adoptBtn} onPress={handleAdopt}>
        <Text style={styles.adoptText}>Adopt Me</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: { flex: 1, backgroundColor: "#fff" },

  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 50,
    elevation: 3
  },

  petImage: { width: "100%", height: 300 },

  content: { padding: 20 },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  petName: { fontSize: 26, fontWeight: "bold" },

  address: { color: "gray", marginTop: 5 },

  infoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
    justifyContent: "space-between",
  },

  infoCard: {
    width: "48%",
    backgroundColor: "#f4f4f4",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },

  infoTitle: { color: "gray" },

  infoValue: { fontWeight: "bold", marginTop: 5 },

  aboutTitle: { fontSize: 20, fontWeight: "bold", marginTop: 10 },

  aboutText: { color: "gray", marginTop: 5 },

  ownerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff5e1",
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
  },

  ownerImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 15,
  },

  ownerName: { fontWeight: "bold" },

  ownerRole: { color: "gray" },

  adoptBtn: {
    backgroundColor: "#f4a300",
    padding: 18,
    alignItems: "center",
    margin: 20,
    borderRadius: 12,
  },

  adoptText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
