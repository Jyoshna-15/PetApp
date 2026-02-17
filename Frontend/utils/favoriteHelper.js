import AsyncStorage from "@react-native-async-storage/async-storage";

export const getFavorites = async () => {
  const fav = await AsyncStorage.getItem("favorites");
  return fav ? JSON.parse(fav) : [];
};

export const toggleFavorite = async (pet) => {
  const favorites = await getFavorites();

  const exists = favorites.find((p) => p.id === pet.id);

  let updatedFavorites;

  if (exists) {
    updatedFavorites = favorites.filter((p) => p.id !== pet.id);
  } else {
    updatedFavorites = [...favorites, pet];
  }

  await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));

  return updatedFavorites;
};

export const isFavorite = async (petId) => {
  const favorites = await getFavorites();
  return favorites.some((p) => p.id === petId);
};
