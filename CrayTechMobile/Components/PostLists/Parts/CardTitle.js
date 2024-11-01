import { View, ScrollView, Image } from 'react-native'
import React from 'react'
import { Avatar, Card, IconButton, Surface } from 'react-native-paper'

export default function CardTitle({ post = {} }) {
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
                <IconButton icon={'dots-grid'} style={{ marginTop: -10 }} />
            )}
        />
    )
}