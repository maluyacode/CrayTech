import { View } from 'react-native'
import React from 'react'
import { Avatar, Card, Text } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

const LeftContent = props => <Avatar.Icon {...props} icon="group" />

export default function CommunityCard({ community, style }) {

    const navigation = useNavigation()

    return (
        <Card onPress={() => navigation.navigate("CommunityDetails", community)} mode='outlined' style={[{ width: 300, marginRight: 20 }, style]}>
            <Card.Title
                titleNumberOfLines={3}
                title={community.name}
                subtitle={<Text variant='bodySmall'>{community.members.length} members</Text>}
                subtitleStyle={{ marginTop: -5 }}
                left={props => (
                    <>
                        {community?.avatar?.url ?
                            <Avatar.Image {...props} source={{ uri: community?.avatar?.url }} />
                            :
                            <Avatar.Icon {...props} icon="group" />
                        }
                    </>
                )}
            />
            <Card.Content>
                <Text variant="bodyMedium">{community.description}</Text>
            </Card.Content>
        </Card>
    )
}