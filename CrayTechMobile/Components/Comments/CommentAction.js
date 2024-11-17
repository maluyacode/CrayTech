import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { IconButton, Text, Modal, Portal, Button, PaperProvider, useTheme, Divider, Menu } from 'react-native-paper'
import TextInput from '../TextInput';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { downvoteCommentAPI, postCommentAPI, upvoteCommentAPI } from '@/services/commentService';
import { setComments } from '@/state/postSlice';

export default function CommentAction({ commentId, postId, textContent, username, upvotes, downvotes, methods, comment }) {

    const [visible, setVisible] = useState(false);
    const appTheme = useTheme();

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const [loading, setLoading] = useState();

    const { token, user } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const [textComment, setTextComment] = useState('');

    const [usersUpvotes, setUsersUpvotes] = useState([]);
    const [usersDownvotes, setUsersDownvotes] = useState([]);


    const upvote = () => {

        setUsersDownvotes(prevUpvotes => prevUpvotes.filter(vote => vote !== user._id));

        if (usersUpvotes.find(vote => vote === user._id)) {
            setUsersUpvotes(prevUpvotes => prevUpvotes.filter(vote => vote !== user._id));
        } else {
            setUsersUpvotes(prevUpvotes => [...prevUpvotes, user._id]);
        }

        try {
            upvoteCommentAPI({ token, id: commentId, body: { userId: user._id } })
        } catch (err) {
            console.log(err);
        }
    }

    const downvote = () => {

        setUsersUpvotes(prevUpvotes => prevUpvotes.filter(vote => vote !== user._id));

        if (usersDownvotes.find(vote => vote === user._id)) {
            setUsersDownvotes(prevUpvotes => prevUpvotes.filter(vote => vote !== user._id));
        } else {
            setUsersDownvotes(prevDownvotes => [...prevDownvotes, user._id]);
        }

        try {
            downvoteCommentAPI({ token, id: commentId, body: { userId: user._id } })
        } catch (err) {

        }
    }

    const postComment = async () => {

        setLoading(true);
        try {

            const body = {
                post: postId,
                replied_to: commentId,
                commented_by: user._id,
                text_content: textComment,
            }

            const data = await postCommentAPI({ token, body, });

            dispatch(
                setComments(data.latestComments)
            );

            setLoading(false);
            hideModal();

        } catch (err) {
            setLoading(false);
            console.log(err);
        }
    }

    useEffect(() => {

        setUsersUpvotes(upvotes);
        setUsersDownvotes(downvotes);

    }, [upvotes, downvotes])


    const [visibleMenu, setVisibleMenu] = React.useState(false);

    const openMenu = () => setVisibleMenu(true);

    const closeMenu = () => setVisibleMenu(false);

    return (
        <>
            <Portal>
                <Modal visible={visible} onDismiss={hideModal}
                    contentContainerStyle={{ justifyContent: 'flex-start', backgroundColor: appTheme.colors.background, height: '100%', padding: 20, }}
                >
                    <View style={{ flex: 1, gap: 20 }}>

                        <View style={{ gap: 10 }}>
                            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                                <Text variant='labelLarge'>{username} </Text>
                                {/* <Text variant='bodySmall'>1min ago</Text> */}
                            </View>
                            <Text variant='bodyMedium'>{textContent}</Text>
                        </View>

                        <Divider />
                        <TextInput disabled={loading} mode='outlined' multiline={true} numberOfLines={20} style={{ paddingTop: 10 }} placeholder={"Your reply"}
                            onChangeText={setTextComment}
                        />
                        <Button disabled={loading} loading={loading} mode='contained' onPress={postComment} >Post</Button>
                    </View>
                </Modal>
            </Portal>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Menu
                        visible={visibleMenu}
                        onDismiss={closeMenu}
                        anchor={
                            <IconButton onPress={openMenu} icon={'dots-vertical'} size={20} />
                        }>

                        {comment?.commented_by._id === user._id &&
                            <Menu.Item onPress={() => { }} title="Edit" />
                        }

                        {comment?.commented_by._id === user._id &&
                            <Menu.Item onPress={() => {
                                closeMenu()
                                methods?.deleteComment()
                            }} title="Delete" />
                        }

                        <Menu.Item onPress={() => { }} title="Report" />
                    </Menu>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IconButton onPress={upvote}
                        icon={usersUpvotes.find(vote => vote === user._id) ? 'arrow-up-bold-circle' : 'arrow-up-bold-circle-outline'}
                    />
                    <Text>{usersUpvotes?.length}</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IconButton onPress={downvote}
                        icon={usersDownvotes.find(vote => vote === user._id) ? 'arrow-down-bold-circle' : 'arrow-down-bold-circle-outline'}
                    />
                    <Text>{usersDownvotes?.length}</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <IconButton icon={'reply-circle'} onPress={showModal} />
                </View>
            </View>
        </>
    )
}