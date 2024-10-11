import { View } from 'react-native'
import React from 'react'
import { Button, Text, useTheme } from 'react-native-paper'

export default function HomeScreen({ route, navigation }) {
    const appTheme = useTheme();
    return (
        <View style={{ flex: 1, backgroundColor: appTheme.colors.background }}>
            <Button onPress={() => navigation.navigate("PostCreate")} mode='outlined' style={{ margin: 10 }}>Create Post</Button>
        </View>
    )
}