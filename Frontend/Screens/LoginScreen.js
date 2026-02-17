import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function LoginScreen({navigation}) {
  return (
    <View style={styles.container}>
      
    
      <Image
        source={require("../assets/login.png")}
        style={styles.image}
       
      />

      {/* Bottom Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.heading}>
          Ready to make a new friend?
        </Text>

        <Text style={styles.description}>
          Let's adopt the pet which you like and make their life happy again
        </Text>

        <TouchableOpacity style={styles.button}  onPress={() => navigation.navigate("Auth")}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
   
  },

  image: {
    width: "100%",
    height: 400,
  },

  contentContainer: {

    backgroundColor: "#f2f2f2",
    alignItems: "center",
    flex: 1,
    padding:15
  },

  heading: {
    marginTop:20,
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },

  description: {
    fontSize: 18,
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
  },

  button: {
    backgroundColor: "#f4a300",
    width: "100%",
    padding: 15,
    borderRadius: 12,
  },

  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
