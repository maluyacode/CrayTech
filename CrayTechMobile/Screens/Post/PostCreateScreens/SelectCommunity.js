import { Alert, FlatList, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Button, IconButton, Text, useTheme, TextInput as RNPInput, Card } from 'react-native-paper'
import { Ionicons, MaterialCommunityIcons } from "react-native-vector-icons";
import hideTabBar from '@/Utils/hideTabBar';
import { ScrollView } from 'react-native-gesture-handler';
import TextInput from '@/Components/TextInput';
import axios from 'axios';
import baseURL from '@/assets/common/baseUrl';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { getCommunitiesAPI } from '@/services/communityService';

export default function SelectCommunity({ navigation, route }) {

    const appTheme = useTheme()
    const postData = route.params
    const { token } = useSelector(state => state.auth);
    const [joinedCommunities, setJoinedCommunities] = useState([]);
    const [community, setCommunity] = useState(null);
    const [canGo, setCanGo] = useState(false);
    const [submiting, setSubmiting] = useState(false);


    const getCommunities = async () => {

        try {

            const data = await getCommunitiesAPI({
                token: token,
                query: 'filter=alljoined'
            })

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

    useEffect(() => {
        hideTabBar(navigation, appTheme);
    }, [navigation]);

    const onChangeCommunity = (id) => {
        if (id === community) {
            setCommunity(null)
        } else {
            setCommunity(id)
        }
    }

    useEffect(() => {
        if (!community) {
            setCanGo(false)
        } else {
            setCanGo(true)
        }
    }, [community])

    const submit = async () => {
        setSubmiting(true)
        try {

            const formData = new FormData();
            postData.community = community;

            Object.entries(postData).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    // Append each image file to formData individually
                    value.forEach((file, index) => {
                        formData.append(key, file);  // Assuming `image` is a File object
                    });
                } else {
                    formData.append(key, value);
                }
            })

            const { data } = await axios.post(`${baseURL}/post/create`, formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": 'multipart/form-data'
                }
            });
            setSubmiting(false)

            Alert.alert("", "Posted successfully!")

            navigation.navigate('HomeScreen');

        } catch (err) {
            setSubmiting(false)
            alert("Error occured");
            console.log(err)
        }

    }

    return (
        <View style={{ flex: 1, backgroundColor: appTheme.colors.background }}>
            <View style={{ flex: 1 }}>
                <View
                    style={{
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <IconButton
                        onPress={() => navigation.goBack()}
                        icon={() => (
                            <Ionicons
                                name="arrow-back-circle-outline"
                                size={35}
                                color={appTheme.colors.onSurface} // Set the color directly in Ionicons
                            />
                        )}
                    />
                    <Button compact mode="contained" style={{ alignSelf: "center" }}
                        onPress={submit}
                        disabled={!canGo || submiting}
                    >
                        {!submiting ? "Post" : "Posting..."}
                    </Button>
                </View>

                <View style={{ paddingHorizontal: 10 }}>
                    <Text variant='headlineMedium'>Select Community</Text>
                    <TextInput mode='outlined' label='Search community' style={{ height: 40 }}
                        right={<RNPInput.Icon icon="text-search" />}
                    />
                </View>

                <FlatList
                    showsHorizontalScrollIndicator={false}
                    style={{ paddingHorizontal: 10, marginTop: 10 }}
                    data={joinedCommunities}
                    renderItem={({ item }) => (
                        <Card onPress={() => onChangeCommunity(item._id)} mode='outlined'
                            style={[{ flex: 1, marginBottom: 10 }, item._id === community ? { borderColor: appTheme.colors.onSurface } : {}]}
                        >
                            <Card.Title
                                titleNumberOfLines={3}
                                title={item.name}
                                subtitle={<Text variant='bodySmall'>{item.members.length} members</Text>}
                                subtitleStyle={{ marginTop: -5 }}
                                right={() =>
                                    <>
                                        {item._id === community ?
                                            <MaterialCommunityIcons
                                                name="check-circle-outline"
                                                size={35}
                                                color={appTheme.colors.onSurface} // Set the color directly in Ionicons
                                            />
                                            : <></>
                                        }
                                    </>
                                }
                                rightStyle={{ marginRight: 8 }}
                            />
                        </Card>
                    )}
                />

            </View>
        </View>
    )
}