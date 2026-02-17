import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./Screens/LoginScreen";
import AuthScreen from "./Screens/AuthScreen";
import RegisterScreen from "./Screens/RegisterScreen";
import HomeTabs from "./navigation/HomeTabs";
import PetDetailsScreen from "./Screens/DetailsScreen";
import AddPetScreen from './Screens/AddPetScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* AFTER LOGIN → SHOW TABS */}
        <Stack.Screen name="Home" component={HomeTabs} />
        <Stack.Screen name="PetDetails" component={PetDetailsScreen} />
        <Stack.Screen name="AddPet" component={AddPetScreen} />


      </Stack.Navigator>
    </NavigationContainer>
  );
}
