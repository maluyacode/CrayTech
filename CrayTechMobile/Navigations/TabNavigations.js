import { View, Text } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeNavagations from './HomeNavagations';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons, FontAwesome } from 'react-native-vector-icons'
import { Button, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { removeAuth } from '@/state/authSlice';
import Communities from '@/Screens/Community/Communities';
import CommunityNavigations from './CommunityNavigations';
import Chat from '@/Screens/Chat';
import ChatNavigations from './ChatNavigations';
import { socket } from '@/socket';
import Setting from '@/Screens/Profile/Setting';
import SettingNavigations from './SettingNavigations';
import SearchNavigation from './SearchNavigation';

const Tab = createMaterialTopTabNavigator();

const Notification = () => {
    return (
        <View>
            <Text>Notification</Text>
        </View>
    )
}

const Settings = () => {
    const dispatch = useDispatch();
    return (
        <View style={{ flex: 1 }}>
            <Text>Notification</Text>
            <Button onPress={() => {

                socket.disconnect();
                dispatch(removeAuth())

            }}>Logout</Button>
        </View>
    )
}

export default function TabNavigations() {

    const appTheme = useTheme();
    const { theme } = useSelector(state => state.preferences);

    return (
        <SafeAreaView style={{ flex: 1, }}>
            <Tab.Navigator
                tabBarPosition='top'
                screenOptions={{
                    swipeEnabled: false,
                    animationEnabled: false,
                    tabBarStyle: {
                        backgroundColor: appTheme.colors.surfaceVariant
                    },
                    tabBarActiveTintColor: appTheme.colors.primary,
                    tabBarInactiveTintColor: appTheme.colors.tertiary,
                }}
            >
                <Tab.Screen name='Home' component={HomeNavagations}
                    options={{
                        tabBarShowLabel: false,
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="home" color={color} size={26} />
                        )
                    }}

                />

                <Tab.Screen name='CommunityNavigation' component={CommunityNavigations}
                    options={{
                        tabBarShowLabel: false,
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="account-group" color={color} size={26} />
                        )
                    }}
                />

                <Tab.Screen name='ChatNavigations' component={ChatNavigations}
                    options={{
                        tabBarShowLabel: false,
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="chat" color={color} size={26} />
                        ),
                    }}
                />

                {/* <Tab.Screen name='Notification' component={Notification}
                    options={{
                        tabBarShowLabel: false,
                        tabBarIcon: ({ color }) => (
                            <Ionicons name="notifications" color={color} size={26} />
                        )
                    }}
                /> */}

                <Tab.Screen name='Search' component={SearchNavigation}
                    options={{
                        tabBarShowLabel: false,
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="feature-search" color={color} size={26} />
                        )
                    }}
                />

                <Tab.Screen name='Settings' component={SettingNavigations}
                    options={{
                        tabBarShowLabel: false,
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="menu" color={color} size={26} />
                        )
                    }}
                />

            </Tab.Navigator>
        </SafeAreaView >
    )
}