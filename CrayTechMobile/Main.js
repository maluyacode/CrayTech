import AuthNavigation from "./Navigations/AuthNavigation";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import TabNavigations from "./Navigations/TabNavigations";
import { useSelector } from "react-redux";
import { useTheme } from "react-native-paper";
import { StatusBar } from "react-native";

export default function Main() {

  const { isLogin, user, token } = useSelector(state => state.auth);

  const appTheme = useTheme();

  const { theme } = useSelector(state => state.preferences);

  return (
    <NavigationContainer>

      <StatusBar backgroundColor={appTheme.colors.background} barStyle={theme === "light" ? "dark-content" : "light-content"} />

      {isLogin ?
        <TabNavigations />
        :
        <AuthNavigation />
      }
    </NavigationContainer>
  );
}
