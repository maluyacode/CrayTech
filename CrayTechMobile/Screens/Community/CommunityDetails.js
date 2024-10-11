import { Image, ImageBackground, StatusBar, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import axios from 'axios';
import baseURL from '@/assets/common/baseUrl';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import hideTabBar from '@/Utils/hideTabBar';
import { useTheme, Text, Avatar, Button } from 'react-native-paper';

export default function CommunityDetails({ route }) {

    const navigation = useNavigation();
    const appTheme = useTheme();
    const id = route.params?._id
    const { token } = useSelector(state => state.auth);
    const [community, setCommunity] = useState({});

    const getCommunity = async () => {
        try {

            const { data } = await axios.get(`${baseURL}/community/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            setCommunity(data.community);

        } catch (err) {
            console.log("Cannot get community");
            console.log(err);
        }
    }

    useFocusEffect(
        useCallback(() => {

            hideTabBar(navigation, appTheme)
            getCommunity();

        }, [])
    )

    return (
        <View style={{ flex: 1, backgroundColor: appTheme.colors.background }}>
            <StatusBar translucent={true} />
            <View style={{ height: 100 }}>
                <ImageBackground
                    source={{ uri: community.banner?.url }}
                    style={{ height: 100 }}
                    imageStyle={{ opacity: 0.6 }} // Adjust the opacity for blending effect
                >
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: appTheme.colors.backdrop,
                            opacity: 0.4 // Adjust the background color opacity
                        }}
                    />
                </ImageBackground>
            </View>

            <View style={{ flex: 1, marginTop: -30, backgroundColor: appTheme.colors.background }}>

                <View style={{ padding: 10, }}>

                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <Avatar.Image size={90} source={{ uri: community.avatar?.url }} />
                        <View style={{ alignSelf: 'center' }}>
                            <Text variant='titleMedium'>{community.name}</Text>
                            <Text variant='labelSmall'>{community.members?.length} members</Text>
                        </View>
                        <Button mode='outlined' style={{ alignSelf: 'center', marginLeft: 'auto', }}
                            onPress={() => navigation.navigate("ModTools", { id: community._id })}
                        >Mods
                        </Button>
                    </View>

                    <Text variant='bodySmall' style={{ marginTop: 5 }}>{community.description}</Text>

                </View>

                <View style={{ height: 40, backgroundColor: appTheme.colors.tertiaryContainer }}>
                    {/* <Text variant='titleLarge'>TODO TOPICS DISPLAY</Text> */}
                </View>
            </View>

        </View>
    )
}