import { FlatList, Image, ImageBackground, StatusBar, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios';
import baseURL from '@/assets/common/baseUrl';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import hideTabBar from '@/Utils/hideTabBar';
import { useTheme, Text, Avatar, Button } from 'react-native-paper';
import Post from '@/Components/PostLists/Post';

export default function CommunityDetails({ route }) {

    const navigation = useNavigation();
    const appTheme = useTheme();
    const id = route.params?._id
    const { token } = useSelector(state => state.auth);
    const [community, setCommunity] = useState({});
    const [posts, setPosts] = useState([]);

    const getCommunity = async () => {
        try {

            const { data } = await axios.get(`${baseURL}/community/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            setCommunity(data.community);

            data.posts = data.posts.map(post => ({
                ...post,
                post_type: post.videos.length > 0 ? "video" : post.images.length > 0 ? "image" : post.poll.length > 0 ? "poll" : "text"
            }))
            setPosts(data.posts);

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


            <View style={{ padding: 10, }}>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <Avatar.Image size={90} source={{ uri: community.avatar?.url }} />
                    <View style={{ alignSelf: 'center' }}>
                        <Text variant='titleMedium'>{community.name}</Text>
                        <Text variant='labelSmall'>{community.members?.length} members</Text>
                    </View>

                    <ButtonAction community={community} />

                </View>

                <Text variant='bodySmall' style={{ marginTop: 5 }}>{community.description}</Text>

            </View>

            <View style={{ height: 1, backgroundColor: appTheme.colors.tertiaryContainer }}>

            </View>

            <View style={{ padding: 10, marginBottom: 100 }}>
                <FlatList
                    style={{ marginBottom: 60 }}
                    data={posts}
                    renderItem={({ item }) => (
                        <Post key={item._id} post={item} />
                    )}
                    keyExtractor={item => item._id}
                />
            </View>

        </View>
    )
}

const ButtonAction = ({ community }) => {

    const navigation = useNavigation();
    const { token, user } = useSelector(state => state.auth);
    const [members, setMembers] = useState([]);

    const appTheme = useTheme();

    const updateCommunity = async (members) => {
        try {

            const { data } = await axios.put(`${baseURL}/community/update/${community._id}`,
                { members: JSON.stringify(members) },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            )

            console.log(data.members);

        } catch (err) {
            console.log(err);
        }
    }

    const joinCommunity = async () => {
        const newMembers = [...members, { _id: user._id }];
        setMembers(newMembers); // Update the state
        await updateCommunity(newMembers); // Pass the new state directly to the update function
    }

    const unjoinCommunity = async () => {
        const updatedMembers = members.filter(member => member._id !== user._id);
        setMembers(updatedMembers);
        await updateCommunity(updatedMembers);
    }


    useEffect(() => {
        setMembers(community.members)
    }, [community.members])

    return (

        <>
            {
                members?.find(member => member._id === user._id) ?

                    <>
                        {members?.find(member => member._id === user._id).role === 'moderator' ?
                            <Button mode='outlined' style={{ alignSelf: 'center', marginLeft: 'auto', }}
                                onPress={() => navigation.navigate("ModTools", { id: community._id })}
                            >
                                Mods
                            </Button >

                            :

                            <Button mode='outlined'
                                style={{ alignSelf: 'center', marginLeft: 'auto', }}
                                onPress={unjoinCommunity}
                            >
                                Joined
                            </Button>
                        }
                    </>

                    :

                    <Button mode='outlined' style={{ alignSelf: 'center', marginLeft: 'auto', }}
                        onPress={joinCommunity}
                    >
                        Join
                    </Button>
            }
        </>
    )
}