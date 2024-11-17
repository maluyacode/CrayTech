import { FlatList, Image, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTheme, Text, Searchbar, Button, TextInput, SegmentedButtons, Avatar, Divider } from 'react-native-paper';
import hideTabBar from '@/Utils/hideTabBar';
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import axios from 'axios';
import baseURL from '@/assets/common/baseUrl';
import { useSelector } from 'react-redux';
import Post from '@/Components/PostLists/Post';
import CommunityCard from '@/Components/CommunityCard';

export default function SearchMain() {

    const appTheme = useTheme();
    const navigation = useNavigation();
    const { token } = useSelector(state => state.auth);

    const [keyword, setKeyword] = useState(null);
    const [searchType, setSearchType] = useState('users');

    const [posts, setPosts] = useState(null);
    const [users, setUsers] = useState(null);
    const [communities, setCommunities] = useState(null);

    useEffect(() => {
        hideTabBar(navigation, appTheme);
    }, [navigation]);

    const searchUsers = async () => {
        try {

            const { data } = await axios.get(`${baseURL}/users/all?keyword=${keyword}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            console.log(data.users);

            setUsers(data.users);

        } catch (err) {
            console.log(err);
        }
    }

    const searchPosts = async () => {
        try {

            const { data } = await axios.get(`${baseURL}/posts?keyword=${keyword}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            data.posts = data.posts.map(post => ({
                ...post,
                post_type: post.videos.length > 0 ? "video" : post.images.length > 0 ? "image" : post.poll.length > 0 ? "poll" : "text"
            }))


            setPosts(data.posts);

        } catch (err) {
            console.log(err);
        }
    }

    const searchCommunities = async () => {
        try {

            const { data } = await axios.get(`${baseURL}/communities?keyword=${keyword}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })


            setCommunities(data.communities);

        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {

        setUsers(null);
        setCommunities(null);
        setPosts(null);

    }, [keyword])

    console.log(users)
    console.log(searchType)

    return (
        <View style={{ flex: 1, backgroundColor: appTheme.colors.background }}>
            <View style={{ padding: 10, }}>

                <Searchbar
                    onSubmitEditing={async () => {
                        await searchCommunities();
                        await searchPosts();
                        await searchUsers();
                    }}
                    placeholder='Search keyword'
                    value={keyword}
                    onChangeText={value => setKeyword(value)}
                />

                <SegmentedButtons
                    style={{ marginTop: 15, }}
                    value={searchType}
                    onValueChange={setSearchType}
                    buttons={[
                        {
                            value: 'users',
                            label: 'Users',
                            labelStyle: { fontSize: 13 }
                        },
                        {
                            value: 'posts',
                            label: 'Posts',
                            labelStyle: { fontSize: 13 }
                        },
                        {
                            value: 'communities',
                            label: 'Communities',
                            labelStyle: { fontSize: 13 }
                        },
                        // { value: 'drive', label: 'Driving' },
                    ]}
                />

                {!users && !posts && !communities &&

                    <View style={{ marginTop: 30, }}>
                        <Text style={{ textAlign: 'center', fontSize: 18 }}>-- Search Something --</Text>
                    </View>

                }

                <View style={{ marginTop: 20, }} key={searchType}>
                    {console.log("Asd")}
                    <FlatList
                        data={searchType === 'users' ? users : searchType === 'posts' ? posts : communities}
                        ItemSeparatorComponent={() => (
                            <View style={{ marginVertical: 10 }} />
                        )}
                        ListFooterComponent={() => (
                            <>
                                {users && posts && communities &&
                                    <View style={{ marginBottom: 250, }} >
                                        <Divider style={{ marginVertical: 20, width: 300, alignSelf: 'center' }} />
                                        <Text variant='labelLarge' style={{ textAlign: 'center' }}> Wala na po! </Text>
                                    </View>
                                }
                            </>
                        )}
                        keyExtractor={item => item._id}
                        renderItem={({ item }) => (
                            <>
                                {searchType === 'users' ?
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row', gap: 15 }}>
                                            {item?.profile?.avatar?.url ?
                                                <Avatar.Image source={{ uri: item?.profile?.avatar?.url }} />
                                                :
                                                <Avatar.Icon icon={'account'} />
                                            }
                                            <View style={{ alignSelf: 'center', marginTop: -5 }}>
                                                <Text variant='titleMedium'>{item.username}</Text>
                                                {item?.profile?.preferences?.privacy?.showEmail &&
                                                    <Text variant='bodyMedium'>{item.email}</Text>
                                                }
                                            </View>
                                        </View>

                                        <View style={{ alignSelf: 'center' }}>
                                            <Button mode='outlined' >Stalk</Button>
                                        </View>
                                    </View>
                                    : searchType === 'posts' ?
                                        <Post key={item._id} post={item} /> :
                                        <CommunityCard community={item} style={{ width: '100%' }} />
                                }
                            </>
                        )}
                    />
                </View>
            </View>
        </View>
    )
}