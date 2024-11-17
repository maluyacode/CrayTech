import { FlatList, Pressable, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Text, useTheme, Searchbar, IconButton, Avatar } from 'react-native-paper'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux';
import axios from 'axios';
import baseURL from '@/assets/common/baseUrl';

/// TODO: REALTIME SOCKET FOR CHAT LIST FECTH

export default function ChatLists() {

    const appTheme = useTheme();

    const { token, user } = useSelector(state => state.auth)
    const [searchQuery, setSearchQuery] = useState('');
    const navigation = useNavigation();
    const [chats, setChats] = useState([]);

    const getChats = async () => {
        try {

            const { data } = await axios.get(`${baseURL}/chats/${user._id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            setChats(data.chats);

        } catch (err) {
            console.log(err);

        }
    }

    useFocusEffect(
        useCallback(() => {
            getChats()
        }, [])
    )

    return (
        <View style={{ flex: 1, backgroundColor: appTheme.colors.background }}>

            <View style={{ marginTop: 10, paddingHorizontal: 10, flexDirection: 'row' }}>
                <Searchbar
                    style={{ flex: 1, }}
                    placeholder="Search"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    right={() => (
                        <IconButton icon={'plus-circle'} size={25} onPress={() => navigation.navigate('SearchChat')} />
                    )}
                />

            </View>

            <View style={{ paddingHorizontal: 10, }}>

                <FlatList

                    data={chats}

                    renderItem={({ item }) =>
                        <Pressable key={item._id} onPress={() => navigation.navigate('Chat', item)}>
                            <View style={{
                                // backgroundColor: appTheme.colors.inverseOnSurface,
                                marginTop: 10,
                                padding: 5,
                                flexDirection: 'row',
                                gap: 10,
                                borderRadius: 5
                            }}>
                                {item.participants?.find(u => u._id !== user._id)?.profile?.avatar?.url ?
                                    <Avatar.Image size={50} source={{ uri: item.participants?.find(u => u._id !== user._id).profile?.avatar?.url }} />
                                    :
                                    <Avatar.Icon size={50} icon={'account'} />
                                }
                                <View style={{ alignSelf: 'center', marginTop: -5 }}>
                                    <Text variant='titleMedium'>{item.participants?.find(u => u._id !== user._id)?.username}</Text>
                                    <Text variant='bodySmall'>
                                        {item.last_message?.sender === user._id ?
                                            `You: ${truncateText(item?.last_message?.text_content)}` :
                                            `${truncateText(item?.last_message?.text_content)}`
                                        }

                                    </Text>
                                </View>
                                <View style={{ alignSelf: 'center', marginLeft: 'auto', marginTop: -5 }}>
                                    <Text></Text>
                                    <Text variant='bodySmall'>{convertToPHTTime(item?.last_message_delivered_at)}</Text>
                                </View>
                            </View>
                        </Pressable>
                    }

                    keyExtractor={item => item._id}
                />

            </View>

        </View>
    )
}

function truncateText(text, maxLength = 30) {
    if (!text) return ""; // If text is undefined or null, return an empty string
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

const convertToPHTTime = (utcDateStr) => {
    // Convert to a Date object
    const utcDate = new Date(utcDateStr);

    // Convert to Philippine Time (UTC+8) and format to get only the hour and minute
    const options = {
        timeZone: "Asia/Manila",
        hour12: true,
        hour: '2-digit',
        minute: '2-digit'
    };

    // Format the date to only display hour and minute in Philippine Time
    return utcDate.toLocaleTimeString("en-US", options);
}