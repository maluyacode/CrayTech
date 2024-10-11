import { FlatList, View, } from 'react-native'
import React, { useCallback, useState } from 'react'
import { Button, useTheme, Text, Card, Avatar } from 'react-native-paper'
import { Entypo } from 'react-native-vector-icons'
import axios from 'axios'
import baseURL from '@/assets/common/baseUrl'
import { useSelector } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native';

const LeftContent = props => <Avatar.Icon {...props} icon="group" />
const RightContent = (props) => {
    return (
        <Button mode='outlined' style={{ marginRight: 10 }}>Join</Button>
    )
}

export default function Communities({ navigation }) {

    const appTheme = useTheme();
    const { token } = useSelector(state => state.auth);
    const [joinedCommunities, setJoinedCommunities] = useState([]);

    const getCommunities = async () => {

        try {

            const { data } = await axios.get(`${baseURL}/communities?filter=auth`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            setJoinedCommunities(data.communities);

        } catch (err) {
            console.error(err);
        }
    }

    useFocusEffect(
        useCallback(() => {

            getCommunities();

        }, [])
    )

    return (
        <View style={{ flex: 1, backgroundColor: appTheme.colors.background }}>
            <Button onPress={() => navigation.navigate("CommunityCreate")} mode='outlined' icon={"plus"} style={{ margin: 10 }}>
                Create Community
            </Button>

            <View>
                <Text style={{ paddingHorizontal: 10 }}>Moderating</Text>

                <View style={{ marginTop: 10 }}>
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        style={{ paddingHorizontal: 10 }}
                        horizontal={true}
                        data={joinedCommunities}
                        renderItem={({ item }) => (
                            <Card onPress={() => navigation.navigate("CommunityDetails", item)} mode='outlined' style={{ width: 300, marginRight: 20 }}>
                                <Card.Title
                                    titleNumberOfLines={3}
                                    title={item.name}
                                    subtitle={<Text variant='bodySmall'>{item.members.length} members</Text>}
                                    subtitleStyle={{ marginTop: -5 }}
                                    left={LeftContent}
                                />
                                <Card.Content>
                                    <Text variant="bodyMedium">{item.description}</Text>
                                </Card.Content>
                            </Card>
                        )}
                    />
                </View>
            </View>

        </View>
    )
}