import { View, Text } from 'react-native'
import React from 'react'
import VideoPostContent from './PostContents/VideoPostContent'
import ImagePostContent from './PostContents/ImagePostContent'
import PollPostContent from './PostContents/PollPostContent'
import TextPostContent from './PostContents/TextPostContent'

export default function AutoPostType({ post = {} }) {
    return (
        <>
            {post.post_type === 'video' &&
                <VideoPostContent post={post} />
            }

            {post.post_type === 'image' &&
                <ImagePostContent post={post} />
            }

            {post.post_type === 'poll' &&
                <PollPostContent post={post} />
            }

            {post.post_type === 'text' &&
                <TextPostContent post={post} />
            }
        </>
    )
}