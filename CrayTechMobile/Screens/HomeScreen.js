import { FlatList, View } from 'react-native'
import React, { useCallback } from 'react'
import { Button, useTheme } from 'react-native-paper'
import { useFocusEffect } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from '@/state/postSlice'
import { getPostsAPI } from '@/services/postService'
import Post from '@/Components/PostLists/Post'

export default function HomeScreen({ navigation }) {

    const appTheme = useTheme();
    const { token } = useSelector(state => state.auth);
    const { posts } = useSelector(state => state.post);
    const dispatch = useDispatch();

    const getPosts = async () => {
        try {

            const data = await getPostsAPI({ token });

            data.posts = data.posts.map(post => ({
                ...post,
                post_type: post.videos.length > 0 ? "video" : post.images.length > 0 ? "image" : post.poll.length > 0 ? "poll" : "text"
            }))

            dispatch(
                setPosts(data.posts)
            );

        } catch (err) {
            console.log(JSON.stringify(err));
        }
    }

    useFocusEffect(
        useCallback(() => {
            getPosts();
        }, [])
    )


    return (
        <View style={{ flex: 1, backgroundColor: appTheme.colors.background }}>
            <Button onPress={() => navigation.navigate("PostCreate")} mode='outlined' style={{ margin: 10 }}>Create Post</Button>

            <View style={{ paddingHorizontal: 10, }}>

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
