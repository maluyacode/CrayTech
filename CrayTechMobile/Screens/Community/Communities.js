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
import { getCommunitiesAPI } from '@/services/communityService'

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
    const [moderatingCommunities, setModeratingCommunities] = useState([]);
    const [communities, setCommunities] = useState([]);
    const [otherCommunities, setOtherCommunities] = useState([]);

    const getModeratingCommunities = async () => {

        try {

            const data = await getCommunitiesAPI({
                token: token,
                query: 'filter=moderating'
            })

            setModeratingCommunities(data.communities);

        } catch (err) {
            console.error(err);
        }
    }

    const getJoinedCommunities = async () => {

        try {

            const data = await getCommunitiesAPI({
                token: token,
                query: 'filter=joined'
            })

            setJoinedCommunities(data.communities);

        } catch (err) {
            console.error(err);
        }
    }

    const getCommunities = async () => {
        try {

            const data = await getCommunitiesAPI({
                token: token,
                query: 'filter=others'
            })

            setOtherCommunities(data.communities);

        } catch (err) {
            console.error(err);
        }
    }

    useFocusEffect(
        useCallback(() => {
            getModeratingCommunities();
            getJoinedCommunities();
            getCommunities();
        }, [])
    )

    return (
        <View style={{ flex: 1, backgroundColor: appTheme.colors.background }}>
            <Button onPress={() => navigation.navigate("CommunityCreate")} mode='outlined' icon={"plus"} style={{ margin: 10 }}>
                Create Community
            </Button>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ marginBottom: 30 }}>
                    <View>
                        <Text style={{ paddingHorizontal: 10 }} variant='titleMedium'>Moderating</Text>

                        <View style={{ marginTop: 10 }}>
                            <CommunityLists communities={moderatingCommunities} />
                        </View>
                        {moderatingCommunities.length <= 0 &&
                            <View style={{ paddingHorizontal: 10, }}>
                                <Text>Create your own community</Text>
                            </View>
                        }
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Text style={{ paddingHorizontal: 10 }} variant='titleMedium'>Joined Communities</Text>

                        <View style={{ marginTop: 10 }}>
                            <CommunityLists communities={joinedCommunities} />
                        </View>
                        {joinedCommunities.length <= 0 &&
                            <View style={{ paddingHorizontal: 10, }}>
                                <Text>You are involve in any communities yet.</Text>
                            </View>
                        }
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Text style={{ paddingHorizontal: 10 }} variant='titleMedium'>Other Communities 💎</Text>

                        <View style={{ marginTop: 10 }}>
                            <CommunityLists communities={otherCommunities} />
                        </View>
                    </View>

                </View>
            </ScrollView>
        </View>
    )
}