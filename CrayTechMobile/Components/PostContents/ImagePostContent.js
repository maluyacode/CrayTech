import { Image, ScrollView, View } from 'react-native'
import React from 'react'
import { Card, Text } from 'react-native-paper'

export default function ImagePostContent({ post = {} }) {

    return (
        <Card.Content style={{ paddingBottom: 10, }}>
            <Text variant="titleSmall">{post.title}</Text>
            <Text variant="bodySmall">{post.body}</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                <View style={{ marginTop: 10, flexDirection: 'row', gap: 10 }}>
                    {post.images.map(image => (
                        <Image key={image?.public_id} resizeMode='cover' source={{ uri: image?.url || placeHolder }} style={{ width: 308, height: 300, borderRadius: 10 }} />
                    ))}
                </View>
            </ScrollView>
        </Card.Content>
    )
}

const placeHolder = 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
