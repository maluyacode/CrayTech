import { Pressable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Card, Text, useTheme } from 'react-native-paper'
import { Ionicons } from 'react-native-vector-icons'
import { useDispatch, useSelector } from 'react-redux';
import { downvoteAPI, upvoteAPI } from '@/services/postService';
import { setPosts } from '@/state/postSlice';
import { useNavigation } from '@react-navigation/native'

export default function CardActions({ post = {}, }) {

    const appTheme = useTheme();
    const { token, user } = useSelector(state => state.auth);
    const { posts } = useSelector(state => state.post);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const updatePostState = (data) => {
        const updatedPost = data.post;

        const index = posts.findIndex(item => item._id === updatedPost._id)

        let copyPosts = JSON.parse(JSON.stringify(posts));

        if (index !== -1) {
            copyPosts[index] = {
                ...copyPosts[index],
                ...updatedPost
            };
        }

        dispatch(
            setPosts(copyPosts)
        )
    }

    const upVote = async () => {
        try {

            const data = await upvoteAPI({
                token,
                post_id: post._id,
                body: {
                    user_id: user._id
                }
            })

            updatePostState(data);

        } catch (err) {
            console.log(err);
        }

    }

    const downvote = async () => {
        try {

            const data = await downvoteAPI({
                token,
                post_id: post._id,
                body: {
                    user_id: user._id
                }
            })

            updatePostState(data);

        } catch (err) {
            console.log(err);
        }
    }

    const checkIfExist = (votes) => {
        return votes?.find(vote => vote === user._id) ? true : false
    }

    return (
        <Card.Actions>
            <View style={{ width: '100%', padding: 5, flexDirection: 'row', gap: 10, }}>

                <View style={{ flexDirection: 'row', borderWidth: 0.2, paddingVertical: 4, paddingHorizontal: 10, borderColor: appTheme.colors.secondary, borderRadius: 10 }}>

                    <TouchableOpacity style={{ flexDirection: 'row' }}
                        onPress={upVote}
                    >
                        <Ionicons
                            name={checkIfExist(post?.upvotes) ? 'arrow-up-circle' : 'arrow-up-circle-outline'}
                            size={25}
                            color={appTheme.colors.secondary}
                        />
                        <Text style={{ marginRight: 10, marginLeft: 5 }} variant='bodyLarge'>{post.upvotes?.length}</Text>
                    </TouchableOpacity>

                    <View style={{ borderRightWidth: 0.3, borderRightColor: appTheme.colors.secondary, marginRight: 6 }} />

                    <TouchableOpacity style={{ flexDirection: 'row' }}
                        onPress={downvote}
                    >
                        <Ionicons
                            name={checkIfExist(post.downvotes) ? 'arrow-down-circle' : 'arrow-down-circle-outline'}
                            size={25}
                            color={appTheme.colors.secondary} />
                        <Text style={{ marginRight: 10, marginLeft: 5 }} variant='bodyLarge'>{post.downvotes?.length}</Text>
                    </TouchableOpacity>

                </View>

                <TouchableOpacity onPress={() => navigation.navigate('PostDetails', { _id: post._id })}>
                    <View style={{ flexDirection: 'row', borderWidth: 0.2, paddingVertical: 4, paddingHorizontal: 10, borderColor: appTheme.colors.secondary, borderRadius: 10 }}>
                        <Ionicons name='chatbubbles' size={25} color={appTheme.colors.secondary} />
                        <Text style={{ alignSelf: 'center', marginRight: 5, marginLeft: 5 }} variant='bodyLarge'>{post.comments?.length}</Text>
                    </View>
                </TouchableOpacity>

                <View style={{ marginLeft: 'auto', flexDirection: 'row', borderWidth: 0.2, paddingVertical: 4, paddingHorizontal: 10, borderColor: appTheme.colors.secondary, borderRadius: 10 }}>
                    <Ionicons name='share-outline' size={25} color={appTheme.colors.secondary} />
                    <Text style={{ alignSelf: 'center', marginRight: 5, marginLeft: 5 }} variant='bodyLarge'>{post.shares?.length}</Text>
                </View>

            </View>
        </Card.Actions>
    )
}