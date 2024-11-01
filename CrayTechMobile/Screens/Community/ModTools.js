import { View, } from 'react-native'
import React, { useCallback, useTransition } from 'react'
import { useTheme, Text, List } from 'react-native-paper'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import hideTabBar from '@/Utils/hideTabBar';
import { Octicons, MaterialCommunityIcons } from 'react-native-vector-icons'

export default function ModTools({ route, navigation }) {

    const appTheme = useTheme();

    useFocusEffect(
        useCallback(() => {

            hideTabBar(navigation, appTheme);

        }, [])
    )

    return (
        <View style={{ flex: 1, backgroundColor: appTheme.colors.background }}>
            <List.Section>
                <List.Item title="Community Style"
                    right={() => (<Octicons size={30} name='arrow-right' color={appTheme.colors.primary} />)}
                />
                <List.Item
                    title="Description"
                    right={() => (<Octicons size={30} name='arrow-right' color={appTheme.colors.primary} />)}
                />
                <List.Item
                    title="Community Type"
                    right={() => (<Octicons size={30} name='arrow-right' color={appTheme.colors.primary} />)}
                />
                <List.Item
                    title="Members"
                    right={() => (<Octicons size={30} name='arrow-right' color={appTheme.colors.primary} />)}
                />
                <List.Item
                    title="Moderators"
                    right={() => (<Octicons size={30} name='arrow-right' color={appTheme.colors.primary} />)}
                />
                <List.Item
                    title="Banned Users"
                    right={() => (<Octicons size={30} name='arrow-right' color={appTheme.colors.primary} />)}
                />
                <List.Item
                    title="Deletion"
                    right={() => (<Octicons size={30} name='arrow-right' color={appTheme.colors.primary} />)}
                />
            </List.Section>
        </View>
    )
}