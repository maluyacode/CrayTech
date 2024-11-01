import { FlatList, View, } from 'react-native'
import React, { useCallback, useState } from 'react'
import { Button, useTheme, Text, Card, Avatar } from 'react-native-paper'
import { Entypo } from 'react-native-vector-icons'
import axios from 'axios'
import baseURL from '@/assets/common/baseUrl'
import { useSelector } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native';
import CommunityCard from '@/Components/CommunityCard'
import CommunityLists from '@/Components/CommunityLists'
import { ScrollView } from 'react-native-gesture-handler'

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
    const [communities, setCommunities] = useState([]);

    const getJoinedCommunities = async () => {

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

    const getCommunities = async () => {
        try {

            const { data } = await axios.get(`${baseURL}/communities`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            setCommunities(data.communities);

            console.log(data.communities.length)

        } catch (err) {
            console.error(err);
        }
    }

    useFocusEffect(
        useCallback(() => {

            getJoinedCommunities();
            getCommunities();

        }, [])
    )

    return (
        <View style={{ flex: 1, backgroundColor: appTheme.colors.background }}>
            <Button onPress={() => navigation.navigate("CommunityCreate")} mode='outlined' icon={"plus"} style={{ margin: 10 }}>
                Create Community
            </Button>
            <ScrollView>
                <View>
                    <Text style={{ paddingHorizontal: 10 }}>Moderating</Text>

                    <View style={{ marginTop: 10 }}>
                        <CommunityLists communities={joinedCommunities} />
                    </View>
                </View>

                <View style={{ marginTop: 20 }}>
                    <Text style={{ paddingHorizontal: 10 }}>Recommended 💎</Text>

                    <View style={{ marginTop: 10 }}>
                        <CommunityLists communities={communities} />
                    </View>
                </View>

                <View style={{ marginTop: 20 }}>
                    <Text style={{ paddingHorizontal: 10 }}>Popular 🔥</Text>

                    <View style={{ marginTop: 10 }}>
                        <CommunityLists communities={communities} />
                    </View>
                </View>

                <View style={{ marginTop: 20 }}>
                    <Text style={{ paddingHorizontal: 10 }}>Other Communities</Text>

                    <View style={{ marginTop: 10 }}>
                        <CommunityLists communities={communities} />
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}