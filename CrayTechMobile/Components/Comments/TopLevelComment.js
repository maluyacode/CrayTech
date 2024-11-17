import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Avatar, Text, IconButton } from 'react-native-paper'
import CommentAction from './CommentAction'
import { deleteCommentAPI } from '@/services/commentService';
import { useSelector } from 'react-redux';

export default function TopLevelComment({ comment }) {

    const [textContent, setTextContent] = useState('');
    const { token } = useSelector(state => state.auth);

    const deleteComment = async () => {
        setTextContent('𝘊𝘰𝘮𝘮𝘦𝘯𝘵 𝘥𝘦𝘭𝘦𝘵𝘦𝘥!');
        try {

            const data = await deleteCommentAPI({ token: token, id: comment._id });

        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (comment.deleted) {
            setTextContent('𝘊𝘰𝘮𝘮𝘦𝘯𝘵 𝘥𝘦𝘭𝘦𝘵𝘦𝘥!');
        } else {
            setTextContent(comment.text_content);
        }
    }, [])

    return (
        <>
            {/* Title */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, }}>
                    <Avatar.Image source={{ uri: comment.commented_by?.profile?.avatar?.url || imageSample }} size={30} />
                    <View>
                        <Text variant='labelMedium'>{comment.commented_by?.username}</Text>
                    </View>
                </View>
            </View>

            {/* Content */}
            <View style={[{ marginTop: 5, }, textContent === '𝘊𝘰𝘮𝘮𝘦𝘯𝘵 𝘥𝘦𝘭𝘦𝘵𝘦𝘥!' ? { marginBottom: 20 } : {}]}>
                <Text variant='bodySmall'>{textContent}</Text>
            </View >
            {textContent !== '𝘊𝘰𝘮𝘮𝘦𝘯𝘵 𝘥𝘦𝘭𝘦𝘵𝘦𝘥!' && (
                <CommentAction
                    username={comment.commented_by.username}
                    commentId={comment._id}
                    postId={comment.post}
                    textContent={comment.text_content}
                    upvotes={comment.upvotes}
                    downvotes={comment.downvotes}
                    methods={{
                        deleteComment
                    }}
                    comment={comment}
                />
            )
            }
        </>
    )
}

const imageSample = 'https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100270.jpg?size=338&ext=jpg&ga=GA1.1.1023967583.1729468800&semt=ais_hybrid'
