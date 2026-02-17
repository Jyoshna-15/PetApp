import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config/Api";

export default function MyPostsScreen({ navigation }) {

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsub = navigation.addListener("focus", loadData);
    return unsub;
  }, [navigation]);

  // ⭐ LOAD MY POSTS
  const loadData = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/pets/mypets`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Error loading posts");
        return;
      }

      setPets(data);

    } catch (error) {
      console.log(error);
      Alert.alert("Network error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ⭐ PULL REFRESH
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, []);

  // ⭐ DELETE PET
  const deletePet = async (id) => {

    Alert.alert("Delete Post", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");

            const res = await fetch(`${BASE_URL}/pets/${id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) {
              Alert.alert("Delete failed");
              return;
            }

            Alert.alert("Deleted successfully");
            loadData();

          } catch {
            Alert.alert("Network error");
          }
        }
      }
    ]);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>

      <Text style={styles.title}>My Posts</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#f4a300" style={{ marginTop: 40 }} />
      ) : pets.length === 0 ? (
        <Text style={styles.empty}>You haven't added any pets yet</Text>
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />

              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.breed}>{item.breed}</Text>

              <View style={styles.row}>

                <TouchableOpacity
                  style={styles.edit}
                  onPress={() => navigation.navigate("AddPet", { editPet: item })}
                >
                  <Text style={{ color: "#fff" }}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.del}
                  onPress={() => deletePet(item._id)}
                >
                  <Text style={{ color: "#fff" }}>Delete</Text>
                </TouchableOpacity>

              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 10
  },

  empty: {
    textAlign: "center",
    marginTop: 60,
    fontSize: 16,
    color: "gray"
  },

  card: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 15,
    marginBottom: 15
  },

  image: {
    height: 140,
    borderRadius: 12
  },

  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 5
  },

  breed: {
    color: "gray"
  },

  row: {
    flexDirection: "row",
    marginTop: 10
  },

  edit: {
    backgroundColor: "#f4a300",
    padding: 8,
    borderRadius: 8,
    marginRight: 10
  },

  del: {
    backgroundColor: "#e63946",
    padding: 8,
    borderRadius: 8
  }

});
