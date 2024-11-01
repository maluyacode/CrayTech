import { View, FlatList } from 'react-native'
import React from 'react'
import CommunityCard from './CommunityCard'

export default function CommunityLists({ communities }) {
    return (
        <FlatList
            showsHorizontalScrollIndicator={false}
            style={{ paddingHorizontal: 10 }}
            horizontal={true}
            data={communities}
            renderItem={({ item }) => (
                <CommunityCard community={item} />
            )}
        />
    )
}