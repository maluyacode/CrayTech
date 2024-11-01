import { View } from 'react-native'
import React from 'react'
import { Avatar, Card, Text } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

const LeftContent = props => <Avatar.Icon {...props} icon="group" />

export default function CommunityCard({ community }) {

    const navigation = useNavigation()

    return (
        <Card onPress={() => navigation.navigate("CommunityDetails", community)} mode='outlined' style={{ width: 300, marginRight: 20 }}>
            <Card.Title
                titleNumberOfLines={3}
                title={community.name}
                subtitle={<Text variant='bodySmall'>{community.members.length} members</Text>}
                subtitleStyle={{ marginTop: -5 }}
                left={LeftContent}
            />
            <Card.Content>
                <Text variant="bodyMedium">{community.description}</Text>
            </Card.Content>
        </Card>
    )
}