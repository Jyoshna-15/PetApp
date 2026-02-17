import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen({ navigation }) {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadUser);
    return unsubscribe;
  }, [navigation]);

  // ⭐ LOAD USER
  const loadUser = async () => {
    const userData = await AsyncStorage.getItem("user");
    setUser(JSON.parse(userData));
  };

  // ⭐ LOGOUT FUNCTION (PRO LEVEL)
  const handleLogout = () => {

    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel" },

        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {

            try {
              // ⭐ CLEAR EVERYTHING
              await AsyncStorage.clear();

              // ⭐ RESET NAVIGATION STACK
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });

            } catch (error) {
              Alert.alert("Error logging out");
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>

      {/* AVATAR */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </Text>
      </View>

      {/* NAME */}
      <Text style={styles.name}>
        {user?.name || "User Name"}
      </Text>

      {/* EMAIL */}
      <Text style={styles.email}>
        {user?.email || "user@email.com"}
      </Text>

      {/* BUTTONS */}
      <View style={styles.buttonContainer}>

        {/* ADD POST */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("AddPet")}
        >
          <Ionicons name="add-circle-outline" size={22} color="#fff" />
          <Text style={styles.buttonText}>Add Post</Text>
        </TouchableOpacity>

        {/* MY POSTS */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("MyPosts")}
        >
          <Ionicons name="albums-outline" size={22} color="#fff" />
          <Text style={styles.buttonText}>My Posts</Text>
        </TouchableOpacity>

        {/* FAVORITES */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Favorite")}
        >
          <Ionicons name="heart-outline" size={22} color="#fff" />
          <Text style={styles.buttonText}>Favorites</Text>
        </TouchableOpacity>

        {/* LOGOUT */}
        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={22} color="#fff" />
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 80
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 60,
    backgroundColor: "#f4a300",
    justifyContent: "center",
    alignItems: "center"
  },

  avatarText: {
    fontSize: 40,
    color: "#fff",
    fontWeight: "bold"
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 15
  },

  email: {
    color: "gray",
    marginTop: 5
  },

  buttonContainer: {
    marginTop: 40,
    width: "80%"
  },

  button: {
    backgroundColor: "#f4a300",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8
  },

  logoutButton: {
    backgroundColor: "#e63946"
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  }
});
