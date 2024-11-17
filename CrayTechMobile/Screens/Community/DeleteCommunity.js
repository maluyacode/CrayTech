import { Alert, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useTheme, Text, Button } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native'
import hideTabBar from '@/Utils/hideTabBar';

export default function DeleteCommunity({ navigation, route }) {

    const appTheme = useTheme();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { id } = route.params
    const { token } = useSelector(state => state.auth);


    const deleteCommunity = () => {
        console.log("Asd")
        Alert.alert(
            '',
            'Are you sure you want to delete this community?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', onPress: () => console.log('Delete confirmed') }
            ]
        );
    }

    useFocusEffect(
        useCallback(() => {

            hideTabBar(navigation, appTheme);

        }, [])
    )

    return (
        <View style={{ flex: 1, backgroundColor: appTheme.colors.background }}>
            <View style={{ padding: 10, gap: 30, flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                <Text variant='titleMedium'>This will never be reverted. If you delete your community you will be able to recover it.</Text>
                <Button mode='outlined'
                    style={{ width: '100%' }}
                    onPress={deleteCommunity}
                    buttonColor={appTheme.colors.errorContainer}
                    textColor={appTheme.colors.onBackground}
                >Delete Community</Button>
            </View>
        </View>
    )
}