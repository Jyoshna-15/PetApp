import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { BASE_URL } from "../config/Api";   // ⭐ using base url

export default function AddPetScreen({ navigation, route }) {

  const editPet = route?.params?.editPet;

  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Dogs');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [weight, setWeight] = useState('');
  const [address, setAddress] = useState('');
  const [about, setAbout] = useState('');
  const [loading, setLoading] = useState(false);

  // ⭐ Prefill when editing
  useEffect(() => {
    if (editPet) {
      setName(editPet.name || '');
      setCategory(editPet.category || 'Dogs');
      setBreed(editPet.breed || '');
      setAge(editPet.age || '');
      setGender(editPet.gender || 'Male');
      setWeight(editPet.weight || '');
      setAddress(editPet.address || '');
      setAbout(editPet.about || '');
      setImage(editPet.image || null);
    }
  }, [editPet]);

  // ⭐ Image Picker
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission required to access gallery');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // ⭐ VALIDATION FUNCTION
  const validate = () => {
    if (!name || !breed || !age || !address) {
      Alert.alert("Please fill all required fields");
      return false;
    }
    return true;
  };

  // ⭐ SUBMIT FUNCTION
  const handleSubmit = async () => {

    if (!validate()) return;

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");

      // ⭐ EDIT PET
      if (editPet?._id) {

        const response = await fetch(`${BASE_URL}/pets/${editPet._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            category,
            breed,
            age,
            gender,
            weight,
            address,
            about,
            image,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          Alert.alert("Error", data.message);
          return;
        }

        Alert.alert("Updated successfully");
        navigation.goBack();
        return;
      }

      // ⭐ ADD PET
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("breed", breed);
      formData.append("age", age);
      formData.append("gender", gender);
      formData.append("weight", weight);
      formData.append("address", address);
      formData.append("about", about);

      if (image && !image.startsWith("http")) {
        formData.append("image", {
          uri: image,
          type: "image/jpeg",
          name: "pet.jpg",
        });
      }

      const response = await fetch(`${BASE_URL}/pets`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.message);
        return;
      }

      Alert.alert("Pet added successfully");
      navigation.goBack();

    } catch (error) {
      console.log(error);
      Alert.alert("Server or network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      <Text style={styles.title}>
        {editPet ? 'Edit Pet' : 'Add Pet'}
      </Text>

      <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text>Select Image</Text>
        )}
      </TouchableOpacity>

      <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={setName} />

      <View style={styles.dropdown}>
        <Picker selectedValue={category} onValueChange={setCategory}>
          <Picker.Item label="Dogs" value="Dogs" />
          <Picker.Item label="Cats" value="Cats" />
          <Picker.Item label="Fish" value="Fish" />
          <Picker.Item label="Birds" value="Birds" />
        </Picker>
      </View>

      <TextInput placeholder="Breed" style={styles.input} value={breed} onChangeText={setBreed} />
      <TextInput placeholder="Age" style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" />
      <TextInput placeholder="Weight" style={styles.input} value={weight} onChangeText={setWeight} keyboardType="numeric" />
      <TextInput placeholder="Address" style={styles.input} value={address} onChangeText={setAddress} />

      <TextInput
        placeholder="About"
        style={[styles.input, { height: 80 }]}
        value={about}
        onChangeText={setAbout}
        multiline
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>
              {editPet ? 'Update Pet' : 'Add Pet'}
            </Text>
        }
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },

  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },

  imageBox: {
    width: 120,
    height: 120,
    backgroundColor: '#ffe0a3',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 20,
  },

  image: { width: '100%', height: '100%', borderRadius: 15 },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },

  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 15,
  },

  button: {
    backgroundColor: '#f4a300',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
