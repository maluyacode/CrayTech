import { View, } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Avatar, Text, IconButton } from 'react-native-paper'
import CommentAction from './CommentAction'

export default function Reply({ reply }) {

    const [textContent, setTextContent] = useState('');

    const deleteComment = () => {
        setTextContent('𝘊𝘰𝘮𝘮𝘦𝘯𝘵 𝘥𝘦𝘭𝘦𝘵𝘦𝘥!');
    }

    useEffect(() => {
        setTextContent(reply.text_content);
    }, [])

    return (
        <View key={reply._id} style={{ marginLeft: 10, }} >

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Avatar.Image source={{ uri: reply.commented_by?.profile?.avatar?.url || imageSample }} size={20} />
                    <View>
                        <Text variant='labelMedium'>{reply.commented_by?.username}</Text>
                    </View>
                </View>
            </View>

            <View style={[{ marginTop: 5, }, textContent === '𝘊𝘰𝘮𝘮𝘦𝘯𝘵 𝘥𝘦𝘭𝘦𝘵𝘦𝘥!' ? { marginBottom: 20 } : {}]}>
                <Text variant='bodySmall'>{textContent}</Text>
            </View>
            {textContent !== '𝘊𝘰𝘮𝘮𝘦𝘯𝘵 𝘥𝘦𝘭𝘦𝘵𝘦𝘥!' && (
                <CommentAction
                    username={reply.commented_by.username}
                    commentId={reply._id}
                    postId={reply.post}
                    textContent={reply.text_content}
                    upvotes={reply.upvotes}
                    downvotes={reply.downvotes}
                    methods={{
                        deleteComment
                    }}
                />
            )}
        </View>
    )
}

const imageSample = 'https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100270.jpg?size=338&ext=jpg&ga=GA1.1.1023967583.1729468800&semt=ais_hybrid'
