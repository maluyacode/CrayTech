import AuthNavigation from "./Navigations/AuthNavigation";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import TabNavigations from "./Navigations/TabNavigations";
import { useSelector } from "react-redux";
import { useTheme } from "react-native-paper";
import { StatusBar } from "react-native";
import { useEffect, useReducer, useState } from "react";

import { socket } from "./socket";

import notifee, { AndroidImportance, EventType } from "@notifee/react-native";
import messaging from '@react-native-firebase/messaging';
import { sendTokenToServer } from "./services/notificationService";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Main() {

  const { isLogin, user, token } = useSelector(state => state.auth);

  const appTheme = useTheme();

  const { theme } = useSelector(state => state.preferences);

  useEffect(() => {

    if (isLogin) {
      socket.connect();
      socket.emit("join", { userId: user._id });
    }

  }, [isLogin])

  return (
    <NavigationContainer>

      <StatusBar backgroundColor={appTheme.colors.background} barStyle={theme === "light" ? "dark-content" : "light-content"} />

      {isLogin ?
        <>
          <Notification />
          <TabNavigations />
        </>
        :
        <AuthNavigation />
      }
    </NavigationContainer>
  );
}


const Notification = () => {
  const { isLogin, user, token } = useSelector(state => state.auth);
  const [channelId, setChannelId] = useState('important');

  // Store user ID in AsyncStorage for background access
  useEffect(() => {
    if (user?._id) {
      AsyncStorage.setItem('userId', user._id);
    }
  }, [user]);

  // Initialize notifications and channels
  async function onAppBootstrap() {
    try {
      await messaging().registerDeviceForRemoteMessages();
      const notificationToken = await messaging().getToken();

      // Send the token to your server
      await sendTokenToServer({
        token: token,
        body: { notificationToken },
        id: user._id,
      });

      // Create a channel for notifications
      const newChannelId = await notifee.createChannel({
        id: 'important',
        name: 'Important Notifications',
        importance: AndroidImportance.HIGH,
      });
      setChannelId(newChannelId);

    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    onAppBootstrap();

    // Foreground message handler
    const unsubscribe = messaging().onMessage(async (message) => {
      try {
        const userId = message.data.userId;
        if (userId !== user._id) {
          await notifee.displayNotification(JSON.parse(message.data.notifee));
        }
      } catch (err) {
        console.log('Error in onMessage handler:', err);
      }
    });

    return () => unsubscribe();
  }, []);

  // Background message handler
  messaging().setBackgroundMessageHandler(async (message) => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      const userId = message.data.userId;

      if (userId !== storedUserId) {
        await notifee.displayNotification(JSON.parse(message.data.notifee));
      }

    } catch (err) {
      console.log('Error in background message handler:', err);
    }
  });

  // Handle Notifee background events
  notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;

    if (type === EventType.DISMISSED) {
      console.log('Notification was dismissed', notification);
    } else if (type === EventType.PRESS) {
      console.log('Notification was pressed', pressAction);
    }
  });

  return null; // No UI needed for this component
};