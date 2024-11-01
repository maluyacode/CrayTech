import { View } from 'react-native'
import React from 'react'
import { Text, ActivityIndicator, useTheme } from 'react-native-paper'

export default function Loader({ children, isLoading = false }) {

    const appTheme = useTheme()

    return (
        <>
            {isLoading ?

                <View style={{ flex: 1, backgroundColor: appTheme.colors.background, height: 100, alignItems: 'center', justifyContent: 'center' }
                } >
                    <ActivityIndicator size={20} animating={isLoading} color={appTheme.colors.primary} />
                </View >

                :

                children
            }
        </>
    )
}