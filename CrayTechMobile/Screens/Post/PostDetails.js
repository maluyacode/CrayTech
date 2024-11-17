import { ScrollView, View } from 'react-native'
import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { getPostAPI } from '@/services/postService';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native'
import { Avatar, Button, Divider, IconButton, Text, useTheme, ActivityIndicator } from 'react-native-paper'
import CardActions from '@/Components/PostLists/Parts/CardActions';
import CardTitle from '@/Components/PostLists/Parts/CardTitle';
import VideoPostContent from '@/Components/PostContents/VideoPostContent';
import AutoPostType from '@/Components/AutoPostType';
import TopLevelComment from '@/Components/Comments/TopLevelComment';
import Reply from '@/Components/Comments/Reply';
import { setComments } from '@/state/postSlice';
import hideTabBar from '@/Utils/hideTabBar';
import ReplyForm from '@/Components/Comments/ReplyForm';
import Loader from '@/Components/Loader';

export default function PostDetails({ navigation, route }) {

    const appTheme = useTheme();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const { _id } = route.params;
    const [post, setPost] = useState();
    const { token } = useSelector(state => state.auth);
    const { posts, comments, } = useSelector(state => state.post);

    const getPost = async () => {
        setIsLoading(true)
        try {

            const { post, comments, commentsCount } = await getPostAPI({ token, id: _id });
            post.post_type = post.videos.length > 0 ? "video" : post.images.length > 0 ? "image" : post.poll.length > 0 ? "poll" : "text"

            setPost(post);

            dispatch(
                setComments(comments)
            )

            setIsLoading(false)

        } catch (err) {
            setIsLoading(false)
            console.log(err);
        }
    }

    useFocusEffect(
        useCallback(() => {

            getPost();

        }, [posts])
    )

    const Replies = (replies) => {
        if (!replies || replies.length === 0) {
            return null; // Stop recursion if there are no replies
        }

        return replies.map(reply => (
            <Fragment key={reply._id}>
                <Reply reply={reply} />
                <View style={{ marginLeft: 10, }}>
                    {Replies(reply.replies)}
                </View>
            </Fragment>
        ));
    };

    useEffect(() => {
        console.log("ASd")
        hideTabBar(navigation, appTheme);
    }, [navigation]);

    return (
        <View style={{ flex: 1, backgroundColor: appTheme.colors.background }}>

            <ReplyForm
                commentId={post?._id}
                postId={post?._id}
                textContent={post?.title}
                username={post?.author.username}
            />

            <ScrollView>

                <View style={{ flex: 1, backgroundColor: appTheme.colors.background }}>

                    <Loader isLoading={isLoading}>

                        <CardTitle post={post} />

                        <AutoPostType post={post} />

                        <CardActions post={post} />

                    </Loader>

                    <Divider theme={{ colors: { primary: 'green' } }} />

                    <Loader isLoading={isLoading}>

                        {!comments.length && (
                            <Text variant='titleMedium' style={{ textAlign: 'center', padding: 10, }}>No comments yet</Text>
                        )}

                        {comments?.map(comment => (
                            <View key={comment._id} style={{ margin: 10, borderRadius: 5, padding: 15, borderWidth: 0.2, borderColor: appTheme.colors.onSurface }}>
                                <TopLevelComment comment={comment} />
                                {/* Render Replies Recursively */}
                                {Replies(comment.replies)}
                            </View>
                        ))}
                    </Loader>
                </View>

            </ScrollView>


        </View>
    )
}
const imageSample = 'https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100270.jpg?size=338&ext=jpg&ga=GA1.1.1023967583.1729468800&semt=ais_hybrid'