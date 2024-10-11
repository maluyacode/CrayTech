import { View } from 'react-native'
import React from 'react'
import { Button, Text, useTheme, Avatar, Card } from 'react-native-paper'

const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

export default function HomeScreen({ route, navigation }) {
    const appTheme = useTheme();
    return (
        <View style={{ flex: 1, backgroundColor: appTheme.colors.background }}>
            <Button onPress={() => navigation.navigate("PostCreate")} mode='outlined' style={{ margin: 10 }}>Create Post</Button>

            <View style={{ paddingHorizontal: 10, }}>
                <Card mode='contained'>
                    <Card.Title
                        title="GraduatingDev"
                        titleVariant='labelLarge'
                        subtitle="by: Dave Merc"
                        subtitleVariant='labelSmall'
                        left={LeftContent}
                        titleStyle={{ marginLeft: -5, marginBottom: -5 }}
                        subtitleStyle={{ marginLeft: -5, marginTop: -5 }}
                    />
                    <Card.Content>
                        <Text variant="titleMedium">Card content</Text>
                        <Text variant="bodySmall">Card content</Text>
                    </Card.Content>
                    {/* <Card.Cover source={{ uri: 'https://picsum.photos/700' }} /> */}
                    <Card.Actions>
                        <Button>Cancel</Button>
                        <Button>Ok</Button>
                    </Card.Actions>
                </Card>
            </View>
        </View>
    )
}
