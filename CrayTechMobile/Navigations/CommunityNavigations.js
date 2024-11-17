import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { MaterialCommunityIcons } from 'react-native-vector-icons'

import Communities from '@/Screens/Community/Communities';
import CommunityCreate from '@/Screens/Community/CommunityCreate';
import CommunityStyle from '@/Screens/Community/CreateScreens/CommunityStyle';
import SelectTopics from '@/Screens/Community/CreateScreens/SelectTopics';
import CommunityType from '@/Screens/Community/CreateScreens/CommunityType';
import CommunityDetails from '@/Screens/Community/CommunityDetails';
import { Text, useTheme } from 'react-native-paper';
import ModTools from '@/Screens/Community/ModTools';
import { Pressable, View } from 'react-native';
import CommunityStyleUpdate from '@/Screens/Community/UpdateScreens/CommunityStyleUpdate';
import BanUsers from '@/Screens/Community/BanUsers';
import CommunityUpdateDetails from '@/Screens/Community/UpdateScreens/CommunityUpdateDetails';
import CommunityTypeUpdate from '@/Screens/Community/UpdateScreens/CommunityTypeUpdate';
import CommunityMembers from '@/Screens/Community/UpdateScreens/CommunityMembers';
import DeleteCommunity from '@/Screens/Community/DeleteCommunity';

const Stack = createStackNavigator();

export default function CommunityNavigations() {

    const appTheme = useTheme();

    return (
        <Stack.Navigator
            initialRouteName='Communities'
        >

            <Stack.Screen
                options={{
                    headerShown: false,
                }}
                name='Communities' component={Communities}
            />

            <Stack.Screen
                options={{
                    headerShown: false,
                }}
                name='CommunityCreate' component={CommunityCreate}
            />

            <Stack.Screen
                options={{
                    headerShown: false,
                }}
                name='CommunityStyle' component={CommunityStyle}
            />

            <Stack.Screen
                options={{
                    headerShown: false,
                }}
                name='SelectTopics' component={SelectTopics}
            />

            <Stack.Screen
                options={{
                    headerShown: false,
                }}
                name='CommunityType' component={CommunityType}
            />

            <Stack.Screen
                options={{
                    header: ({ navigation }) => {
                        return (
                            <View style={{ backgroundColor: useTheme().colors.background, height: 50, paddingHorizontal: 10, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                                <Pressable onPress={() => navigation.goBack()}>
                                    <MaterialCommunityIcons size={30} name='keyboard-return' color={appTheme.colors.primary} />
                                </Pressable>
                                <Text variant='titleMedium'>Community</Text>
                            </View>
                        )
                    }

                }}
                name='CommunityDetails' component={CommunityDetails}
            />

            <Stack.Screen
                options={{
                    headerShown: true,
                    header: ({ navigation }) => {
                        return (
                            <View style={{ backgroundColor: useTheme().colors.background, height: 50, paddingHorizontal: 10, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                                <Pressable onPress={() => navigation.goBack()}>
                                    <MaterialCommunityIcons size={30} name='keyboard-return' color={appTheme.colors.primary} />
                                </Pressable>
                                <Text variant='titleMedium'>Modification Tools</Text>
                            </View>
                        )
                    }
                }}
                name='ModTools' component={ModTools}
            />

            <Stack.Screen
                options={{
                    headerShown: true,
                    header: ({ navigation }) => {
                        return (
                            <View style={{ backgroundColor: useTheme().colors.background, height: 50, paddingHorizontal: 10, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                                <Pressable onPress={() => navigation.goBack()}>
                                    <MaterialCommunityIcons size={30} name='keyboard-return' color={appTheme.colors.primary} />
                                </Pressable>
                                <Text variant='titleMedium'>Community Style</Text>
                            </View>
                        )
                    }
                }}
                name='CommunityStyleUpdate' component={CommunityStyleUpdate}
            />


            <Stack.Screen
                options={{
                    headerShown: true,
                    header: ({ navigation }) => {
                        return (
                            <View style={{ backgroundColor: useTheme().colors.background, height: 50, paddingHorizontal: 10, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                                <Pressable onPress={() => navigation.goBack()}>
                                    <MaterialCommunityIcons size={30} name='keyboard-return' color={appTheme.colors.primary} />
                                </Pressable>
                                <Text variant='titleMedium'>Banned Users</Text>
                            </View>
                        )
                    }
                }}
                name='BanUsers' component={BanUsers}
            />

            <Stack.Screen
                options={{
                    headerShown: true,
                    header: ({ navigation }) => {
                        return (
                            <View style={{ backgroundColor: useTheme().colors.background, height: 50, paddingHorizontal: 10, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                                <Pressable onPress={() => navigation.goBack()}>
                                    <MaterialCommunityIcons size={30} name='keyboard-return' color={appTheme.colors.primary} />
                                </Pressable>
                                <Text variant='titleMedium'>Community Details</Text>
                            </View>
                        )
                    }
                }}
                name='CommunityUpdateDetails' component={CommunityUpdateDetails}
            />

            <Stack.Screen
                options={{
                    headerShown: true,
                    header: ({ navigation }) => {
                        return (
                            <View style={{ backgroundColor: useTheme().colors.background, height: 50, paddingHorizontal: 10, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                                <Pressable onPress={() => navigation.goBack()}>
                                    <MaterialCommunityIcons size={30} name='keyboard-return' color={appTheme.colors.primary} />
                                </Pressable>
                                <Text variant='titleMedium'>Community Type</Text>
                            </View>
                        )
                    }
                }}
                name='CommunityTypeUpdate' component={CommunityTypeUpdate}
            />


            <Stack.Screen
                options={{
                    headerShown: true,
                    header: ({ navigation }) => {
                        return (
                            <View style={{ backgroundColor: useTheme().colors.background, height: 50, paddingHorizontal: 10, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                                <Pressable onPress={() => navigation.goBack()}>
                                    <MaterialCommunityIcons size={30} name='keyboard-return' color={appTheme.colors.primary} />
                                </Pressable>
                                <Text variant='titleMedium'>Community Members</Text>
                            </View>
                        )
                    }
                }}
                name='CommunityMembers' component={CommunityMembers}
            />

            <Stack.Screen
                options={{
                    headerShown: true,
                    header: ({ navigation }) => {
                        return (
                            <View style={{ backgroundColor: useTheme().colors.background, height: 50, paddingHorizontal: 10, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                                <Pressable onPress={() => navigation.goBack()}>
                                    <MaterialCommunityIcons size={30} name='keyboard-return' color={appTheme.colors.primary} />
                                </Pressable>
                                <Text variant='titleMedium'>Community Deletion</Text>
                            </View>
                        )
                    }
                }}
                name='DeleteCommunity' component={DeleteCommunity}
            />

        </Stack.Navigator>
    )
}