import React, { useEffect, useState, useCallback ,useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { BASE_URL } from '../config/Api';

const { width } = Dimensions.get('screen');

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Dogs');
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [localFav, setLocalFav] = useState([]); // ⭐ local dummy fav
  const [pets, setPets] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const sliderRef = useRef(null);
const [currentIndex, setCurrentIndex] = useState(0);


  // dummy pets
  const dummyPets = [
    {
      id: 'd1',
      name: 'Goldy',
      breed: 'Golden Shepherd',
      age: '5',
      category: 'Dogs',
      image: 'https://images.unsplash.com/photo-1558788353-f76d92427f16',
    },
    {
      id: 'd2',
      name: 'Hutch',
      breed: 'Dutch Puppy',
      age: '1',
      category: 'Dogs',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b',
    },
    {
      id: 'd3',
      name: 'Milo',
      breed: 'Persian Cat',
      age: '2',
      category: 'Cats',
      image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
    },
    {
      id: 'd4',
      name: 'Nemo',
      breed: 'Clown Fish',
      age: '1',
      category: 'Fish',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    },
    {
      id: 'd5',
      name: 'Rio',
      breed: 'Parrot',
      age: '3',
      category: 'Birds',
      image: 'https://images.unsplash.com/photo-1501706362039-c6e13a9f1c7b',
    },
  ];

  useEffect(() => {
    loadUser();
    loadFavorites();
    loadLocalFav();
    loadPets();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadFavorites();
      loadLocalFav();
      loadPets();
    });
    return unsubscribe;
  }, [navigation]);

  const loadUser = async () => {
    const data = await AsyncStorage.getItem('user');
    setUser(JSON.parse(data));
  };

  // ⭐ backend favorites
  const loadFavorites = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const res = await fetch(`${BASE_URL}/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) return;

      setFavorites(data);
    } catch (err) {
      console.log('Fav load error', err);
    }
  };

  // ⭐ local dummy favorites
  const loadLocalFav = async () => {
    const stored = await AsyncStorage.getItem('dummyFavorites');
    setLocalFav(stored ? JSON.parse(stored) : []);
  };

  // ⭐ load pets
  const loadPets = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/pets`);
      const data = await res.json();
      if (!res.ok) return;

      const formatted = data.map((pet) => ({
        ...pet,
        id: pet._id,
      }));

      setPets([...dummyPets, ...formatted]);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPets();
    loadFavorites();
    loadLocalFav();
  }, []);

  const filteredPets = pets.filter((p) => p.category === selectedCategory);

  // ⭐ toggle favorite (backend + dummy)
  const handleFavorite = async (pet) => {
    try {
      // ⭐ backend pet
      if (pet._id) {
        const token = await AsyncStorage.getItem('token');

        await fetch(`${BASE_URL}/favorites/${pet._id}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });

        loadFavorites();
      }

      // ⭐ dummy pet
      else {
        let updated;

        const exists = localFav.find((p) => p.id === pet.id);

        if (exists) {
          updated = localFav.filter((p) => p.id !== pet.id);
        } else {
          updated = [...localFav, pet];
        }

        setLocalFav(updated);
        await AsyncStorage.setItem('dummyFavorites', JSON.stringify(updated));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const sliderImages = [
    {
      id: '1',
      image:
        'https://cdn.dribbble.com/userupload/2841504/file/original-3315cd86212390c4241a2fc98edf51ad.jpg',
    },
    {
      id: '2',
      image:
        'https://cdn.dribbble.com/userupload/32813290/file/original-278b6bce64ac5952898de9fd32f44d6a.jpg?resize=1504x1128&vertical=center',
    },
    {
       id: '3',
      image:
      'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/pet-banner-design-template-c4b3a9dd6c6c6aeeb319177e055b1a4c_screen.jpg?ts=1739341539'
    },
    {
       id: '4',
      image:
      'https://mir-s3-cdn-cf.behance.net/project_modules/1400/3a1fb4169601075.644fdce41162b.jpg'
    },
    {
       id: '5',
      image:
      'https://img.freepik.com/free-psd/flat-design-pet-adoption-banner-template_23-2149383388.jpg'
    }
  ];
  useEffect(() => {
  const interval = setInterval(() => {
    let nextIndex = currentIndex + 1;

    if (nextIndex >= sliderImages.length) {
      nextIndex = 0;
    }

    sliderRef.current?.scrollToIndex({
      index: nextIndex,
      animated: true,
    });

    setCurrentIndex(nextIndex);
  }, 3000); // change every 3 sec

  return () => clearInterval(interval);
}, [currentIndex]);


  const categories = [
    { id: '1', name: 'Dogs', icon: 'https://cdn-icons-png.flaticon.com/512/616/616408.png' },
    { id: '2', name: 'Cats', icon: 'https://cdn-icons-png.flaticon.com/512/616/616430.png' },
    { id: '3', name: 'Fish', icon: 'https://cdn-icons-png.flaticon.com/512/7751/7751276.png' },
    { id: '4', name: 'Birds', icon: 'https://cdn-icons-png.flaticon.com/512/5980/5980620.png' },
  ];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>

      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.userName}>{user?.name || 'Pet Lover'}</Text>
        </View>

        <TouchableOpacity style={styles.profileCircle} onPress={()=>navigation.navigate('Profile')}>
          <Text style={styles.profileText}>
            {user?.name?.charAt(0)?.toUpperCase() || 'P'}
          </Text>
        </TouchableOpacity>
      </View>

     <FlatList
  ref={sliderRef}
  data={sliderImages}
  horizontal
  pagingEnabled
  showsHorizontalScrollIndicator={false}
  keyExtractor={(i) => i.id}
  onMomentumScrollEnd={(e) => {
    const index = Math.round(
      e.nativeEvent.contentOffset.x /
      e.nativeEvent.layoutMeasurement.width
    );
    setCurrentIndex(index);
  }}
  renderItem={({ item }) => (
    <Image source={{ uri: item.image }} style={styles.sliderImage} />
  )}
/>


      <Text style={styles.categoryTitle}>Category</Text>

      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => {
          const isSelected = selectedCategory === item.name;
          return (
            <TouchableOpacity
              onPress={() => setSelectedCategory(item.name)}
              style={[
                styles.categoryCard,
                isSelected && styles.selectedCategory,
              ]}>
              <Image source={{ uri: item.icon }} style={styles.categoryIcon} />
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredPets}
          keyExtractor={(item) => item.id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item }) => {

            // ⭐ backend liked
            const backendLiked = favorites.some((f) => {
              const favPet = f.pet || f;
              return favPet?._id === item._id;
            });

            // ⭐ dummy liked
            const dummyLiked = localFav.some((p) => p.id === item.id);

            const liked = backendLiked || dummyLiked;

            return (
              <TouchableOpacity
                style={styles.petCard}
                onPress={() =>
                  navigation.navigate('PetDetails', { pet: item })
                }>

                <Image source={{ uri: item.image }} style={styles.petImage} />

                <TouchableOpacity
                  style={styles.heartIcon}
                  onPress={() => handleFavorite(item)}>
                  <Ionicons
                    name={liked ? 'heart' : 'heart-outline'}
                    size={22}
                    color={liked ? 'red' : 'black'}
                  />
                </TouchableOpacity>

                <View style={styles.petInfoRow}>
                  <View>
                    <Text style={styles.petName}>{item.name}</Text>
                    <Text style={styles.petBreed}>{item.breed}</Text>
                  </View>

                  <View style={styles.ageBadge}>
                    <Text style={styles.ageText}>{item.age} YRS</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddPet')}>
        <Text style={styles.addButtonText}>+ Add Pet</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  welcomeText: { fontSize: 16, color: 'gray' },
  userName: { fontSize: 22, fontWeight: 'bold' },
  profileCircle: {
    width: 45,
    height: 45,
    borderRadius: 50,
    backgroundColor: '#f4a300',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  categoryTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  categoryCard: {
    width: 85,
    height: 90,
    backgroundColor: '#f3e5c3',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  selectedCategory: { backgroundColor: '#f4a300' },
  categoryIcon: { width: 40, height: 40, marginBottom: 5 },
  categoryText: { fontSize: 13, fontWeight: '500' },
  petCard: {
    marginTop: 30,
    width: width * 0.42,
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    marginBottom: 20,
  },
  petImage: {
    width: '100%',
    height: 130,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  heartIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 20,
  },
  petInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  petName: { fontWeight: 'bold', fontSize: 16 },
  petBreed: { color: 'gray', fontSize: 13 },
  ageBadge: {
    backgroundColor: '#ffe0a3',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'center',
  },
  ageText: { fontSize: 11, fontWeight: 'bold' },
  addButton: {
    marginTop: 20,
    backgroundColor: '#f4a300',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  sliderImage: {
    width: width * 0.9,
    height: 180,
    borderRadius: 15,
    marginRight: 15,
  },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
});
