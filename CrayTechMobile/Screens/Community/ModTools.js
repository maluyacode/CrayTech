import { View, } from 'react-native'
import React, { useCallback, useTransition } from 'react'
import { useTheme, Text, List } from 'react-native-paper'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import hideTabBar from '@/Utils/hideTabBar';
import { Octicons, MaterialCommunityIcons } from 'react-native-vector-icons'

export default function ModTools({ route }) {

    const appTheme = useTheme();
    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {

            hideTabBar(navigation, appTheme);

        }, [])
    )

    return (
        <View style={{ flex: 1, backgroundColor: appTheme.colors.background }}>
            <List.Section>
                <List.Item
                    onPress={() => navigation.navigate('CommunityStyleUpdate', route.params)}
                    title="Community Style"
                    right={() => (<Octicons size={30} name='arrow-right' color={appTheme.colors.primary} />)}
                />
                <List.Item
                    onPress={() => navigation.navigate('CommunityUpdateDetails', route.params)}
                    title="Description"
                    right={() => (<Octicons size={30} name='arrow-right' color={appTheme.colors.primary} />)}
                />
                <List.Item
                    onPress={() => navigation.navigate('CommunityTypeUpdate', route.params)}
                    title="Community Type"
                    right={() => (<Octicons size={30} name='arrow-right' color={appTheme.colors.primary} />)}
                />
                <List.Item
                    onPress={() => navigation.navigate('CommunityMembers', route.params)}
                    title="Members"
                    right={() => (<Octicons size={30} name='arrow-right' color={appTheme.colors.primary} />)}
                />
                {/* <List.Item
                    title="Moderators"
                    right={() => (<Octicons size={30} name='arrow-right' color={appTheme.colors.primary} />)}
                /> */}
                <List.Item
                    onPress={() => navigation.navigate('BanUsers', route.params)}
                    title="Banned Users"
                    right={() => (<Octicons size={30} name='arrow-right' color={appTheme.colors.primary} />)}
                />
                <List.Item
                    onPress={() => navigation.navigate('DeleteCommunity', route.params)}
                    title="Deletion"
                    right={() => (<Octicons size={30} name='arrow-right' color={appTheme.colors.primary} />)}
                />
            </List.Section>
        </View>
    )
}