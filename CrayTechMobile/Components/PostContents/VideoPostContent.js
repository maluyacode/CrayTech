import { ScrollView, View } from 'react-native'
import React from 'react'
import { ResizeMode, Video } from 'expo-av'
import { Card, Text } from 'react-native-paper'

export default function VideoPostContent({ post = {} }) {
    return (
        <Card.Content style={{ paddingBottom: 10, }}>
            <Text variant="titleSmall">{post.title}</Text>
            <Text variant="bodySmall">{post.body}</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                <View style={{ marginTop: 10, flexDirection: 'row', gap: 10 }}>
                    {post.videos.map(video => (
                        <Video
                            key={video?.public_id}
                            style={{ height: 400, width: 308 }}
                            source={{
                                uri: video?.url,
                            }}
                            useNativeControls
                            resizeMode={ResizeMode.COVER}
                        />
                    ))}
                </View>
            </ScrollView>
        </Card.Content>
    )
}