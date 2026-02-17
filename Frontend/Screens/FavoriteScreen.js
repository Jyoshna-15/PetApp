import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config/Api";

const { width } = Dimensions.get("screen");

export default function FavoritesScreen({ navigation }) {

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadFavorites = async () => {
    try {
      setLoading(true);

      let backendFav = [];
      let dummyFav = [];

      // ⭐ BACKEND FAVORITES
      try {
        const token = await AsyncStorage.getItem("token");

        const res = await fetch(`${BASE_URL}/favorites`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        if (res.ok) backendFav = data;

      } catch (e) {
        console.log("Backend fav error");
      }

      // ⭐ DUMMY FAVORITES FROM ASYNC
      const stored = await AsyncStorage.getItem("dummyFavorites");
      dummyFav = stored ? JSON.parse(stored) : [];

      // ⭐ MERGE BOTH
      const combined = [
        ...backendFav,
        ...dummyFav
      ];

      setFavorites(combined);

    } catch (err) {
      console.log("Fav load error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadFavorites);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => {

    // ⭐ if backend fav -> item.pet
    // ⭐ if dummy fav -> item directly
    const pet = item.pet || item;

    if (!pet || !pet.image) return null;

    return (
      <TouchableOpacity
        style={styles.petCard}
        onPress={() => navigation.navigate("PetDetails", { pet })}
      >
        <Image source={{ uri: pet.image }} style={styles.petImage} />

        <View style={styles.petInfoRow}>
          <View>
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.petBreed}>{pet.breed}</Text>
          </View>

          <View style={styles.ageBadge}>
            <Text style={styles.ageText}>{pet.age} YRS</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Favorites ❤️</Text>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 50 }} />
      ) : favorites.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 50, color: "gray" }}>
          No favorites yet
        </Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1,padding:20,backgroundColor:"#fff" },
  title:{ fontSize:24,fontWeight:"bold",marginTop:20,marginBottom:10 },
  petImage:{ width:"100%",height:130,borderTopLeftRadius:15,borderTopRightRadius:15 },
  petCard:{ marginTop:20,width:width*0.45,backgroundColor:"#f9f9f9",borderRadius:15,marginBottom:15 },
  petInfoRow:{ flexDirection:"row",justifyContent:"space-between",padding:10 },
  petName:{ fontWeight:"bold",fontSize:16 },
  petBreed:{ color:"gray",fontSize:13 },
  ageBadge:{ backgroundColor:"#ffe0a3",paddingHorizontal:8,paddingVertical:3,borderRadius:10,alignSelf:"center" },
  ageText:{ fontSize:11,fontWeight:"bold" }
});
