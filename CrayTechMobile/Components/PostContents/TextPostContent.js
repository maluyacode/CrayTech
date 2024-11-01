import { View } from 'react-native'
import React from 'react'
import { Card, Text } from 'react-native-paper'

export default function TextPostContent({ post = {} }) {
    return (
        <Card.Content>
            <Text variant="titleSmall">{post.title}</Text>
            <Text variant="bodySmall">{post.body}</Text>
        </Card.Content>
    )
}