import { View, Text } from 'react-native'
import React from 'react'
import AutoPostType from '../AutoPostType'
import CardTitle from './Parts/CardTitle'
import CardActions from './Parts/CardActions'
import { Card } from 'react-native-paper'

export default function Post({
    post,
    displayCardAction = true,
    CustomCardAction = null,
    displayCardTitle = true,
    CustomCardTitle = null
}) {

    return (
        <Card mode='outlined' style={{ marginBottom: 10 }}>

            {/* <CardTitle post={post} /> */}

            {displayCardTitle &&
                <>
                    {CustomCardTitle ?
                        <CustomCardTitle /> :
                        <CardTitle post={post} />
                    }
                </>
            }

            <AutoPostType post={post} />

            {displayCardAction &&
                <>
                    {CustomCardAction ?
                        <CustomCardAction /> :
                        <CardActions post={post} />
                    }
                </>
            }

        </Card>
    )
}