import { View, Text } from "react-native";
import React from "react";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";

import Login from "@/Screens/Auth/Login";
import Register from "@/Screens/Auth/Register";
import AvatarUsername from "@/Screens/Auth/RegisterScreens/AvatarUsername";
import Topics from "@/Screens/Auth/RegisterScreens/Topics";

const Stack = createStackNavigator();

export default function AuthNavigation() {
  return (

    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true, // Enable swipe gestures
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,

      }}
    >

      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Topics" component={Topics} />
      <Stack.Screen name="AvatarUsername" component={AvatarUsername} />

    </Stack.Navigator>

  );
}
