import { View, Text } from 'react-native'
import React from 'react'
import AutoPostType from '../AutoPostType'
import CardTitle from './Parts/CardTitle'
import CardActions from './Parts/CardActions'
import { Card } from 'react-native-paper'

export default function Post({ post }) {

    return (
        <Card mode='outlined' style={{ marginBottom: 10 }}>

            <CardTitle post={post} />

            <AutoPostType post={post} />

            <CardActions post={post} />

        </Card>
    )
}