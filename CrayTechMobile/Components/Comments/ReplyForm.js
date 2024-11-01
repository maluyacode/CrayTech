import { View } from 'react-native'
import React, { useState } from 'react'
import { Button, Divider, Modal, Portal, Text, useTheme } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux';
import { postCommentAPI } from '@/services/commentService';
import { setComments } from '@/state/postSlice';
import TextInput from '../TextInput';

export default function ReplyForm({ commentId, postId, textContent, username, }) {

    const [visible, setVisible] = useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const appTheme = useTheme();
    const [loading, setLoading] = useState();

    const { token, user } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const [textComment, setTextComment] = useState('');

    const postComment = async () => {

        setLoading(true);
        try {

            const body = {
                post: postId,
                replied_to: commentId,
                commented_by: user._id,
                text_content: textComment,
            }

            console.log(body);

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

    return (
        <>
            <Portal >
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
            <View style={{ backgroundColor: appTheme.colors.background, padding: 10 }}>
                <Button mode='outlined' onPress={showModal}>Any thoughts on this?</Button>
            </View>
        </>
    )
}