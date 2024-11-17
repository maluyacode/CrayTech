import { Alert, FlatList, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useTheme, Text, Card, Avatar, IconButton, Menu, Divider, Button } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import hideTabBar from '@/Utils/hideTabBar';
import { getPostsAPI } from '@/services/postService';
import Loader from '@/Components/Loader';
import Post from '@/Components/PostLists/Post';
import axios from 'axios';
import baseURL from '@/assets/common/baseUrl';

export default function UserPosts({ navigation }) {

    const appTheme = useTheme();
    const [loading, setLoading] = useState(false);
    const { token } = useSelector(state => state.auth);
    const [posts, setPosts] = useState([]);

    const getPosts = async () => {
        setLoading(true)
        try {

            const query = `filter_type=my-post`

            const data = await getPostsAPI({ token, query: query });

            data.posts = data.posts.map(post => ({
                ...post,
                post_type: post.videos.length > 0 ? "video" : post.images.length > 0 ? "image" : post.poll.length > 0 ? "poll" : "text"
            }))

            setPosts(data.posts)
            setLoading(false)
        } catch (err) {
            setLoading(false)
            console.log(JSON.stringify(err));
        }
    }

    useFocusEffect(
        useCallback(() => {

            hideTabBar(navigation, appTheme);
            getPosts();

        }, [])
    )

    return (
        <View style={{ flex: 1, backgroundColor: appTheme.colors.background }}>
            <View style={{ padding: 10, }}>

                <Text variant='titleMedium' style={{ marginBottom: 10, }}>Your Posts</Text>

                <FlatList
                    data={posts}
                    keyExtractor={item => item._id}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={() => (
                        <View style={{ height: 60 }}>
                            <Loader isLoading={loading} />
                            {posts.length <= 0 &&
                                <Text style={{ textAlign: 'center' }}>No Available Posts</Text>
                            }
                        </View>
                    )}
                    renderItem={({ item, index }) => (
                        <>
                            {!loading &&
                                <Post
                                    key={item._id}
                                    post={item}
                                    displayCardAction={false}
                                    CustomCardTitle={() => (
                                        <CardTitle post={item} refresher={getPosts} />
                                    )}
                                />
                            }
                        </>
                    )}
                />

            </View>
        </View>
    )
}

const CardTitle = ({ post, refresher }) => {

    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const { token } = useSelector(state => state.auth);

    const navigation = useNavigation();

    const handleEdit = (id) => {
        closeMenu()
        navigation.navigate('UpdatePost', { id: post._id })
    }

    const deletePost = async (id) => {
        try {

            const { data } = await axios.delete(`${baseURL}/post/delete/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            })

            Alert.alert('', 'Post deleted!')
            refresher();

        } catch (err) {

        }
    }

    const handleDelete = async (id) => {
        closeMenu()
        Alert.alert(
            '',
            'Are you sure do you want to delete this post?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Yes', onPress: () => deletePost(id) }
            ]
        )
    }

    return (
        <Card.Title
            title={post.community?.name}
            titleVariant='labelLarge'
            subtitle={`by:${post.author?.username}`}
            subtitleVariant='labelSmall'
            subtitleStyle={{ marginLeft: -5, marginTop: -5 }}
            titleStyle={{ marginLeft: -5, marginBottom: -5 }}

            left={(props) => (
                <Avatar.Image {...props} source={{ uri: post.community?.avatar?.url }} icon="folder" />
            )}

            right={(props) => (

                <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={
                        <IconButton onPress={openMenu} icon={'dots-grid'} style={{ marginTop: -10 }} />
                    }>

                    <Menu.Item onPress={handleEdit} title="Edit" />
                    <Menu.Item onPress={() => { handleDelete(post._id) }} title="Delete" />
                </Menu>
            )}
        />
    )
}