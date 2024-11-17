import { FlatList, Pressable, ScrollView, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme, Text, Searchbar, Avatar, IconButton, TextInput, Button } from 'react-native-paper'
import axios from 'axios';
import baseURL from '@/assets/common/baseUrl';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native'
import hideTabBar from '@/Utils/hideTabBar';
export default function SearchChat() {

    const appTheme = useTheme();
    const navigation = useNavigation();

    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);
    const { token, user } = useSelector(state => state.auth)
    const [filteredUsers, setFilteredUsers] = useState();
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getUsers = async () => {
        try {

            const { data } = await axios.get(`${baseURL}/users/all`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            setUsers(data.users);
            setFilteredUsers(data.users)

        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getUsers();
    }, [])

    const filterUsers = (key) => {
        console.log("Asd")
        const result = users.filter(u =>
            u.username.toLowerCase().includes(key.toLowerCase())
        );
        setFilteredUsers(result);
    }

    const sendMessage = async () => {
        setIsSubmitting(true)
        try {

            const { data } = await axios.post(`${baseURL}/message/send`, {
                participants: [
                    selectedUser._id,
                    user._id
                ],
                is_group: false,
                sender: user._id,
                text_content: message,
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            setIsSubmitting(false)
            navigation.navigate('ChatLists');

        } catch (err) {
            setIsSubmitting(false)
            console.log(err);
        }
    }


    useEffect(() => {
        hideTabBar(navigation, appTheme);
    }, [navigation]);

    return (
        <View style={{ flex: 1, backgroundColor: appTheme.colors.background }}>
            {!selectedUser &&
                <View style={{ paddingHorizontal: 5, marginTop: 10, }}>
                    <Searchbar
                        placeholder="Search"
                        onChangeText={(key) => {
                            filterUsers(key)
                            setSearchQuery(key);
                        }}
                        value={searchQuery}
                        onClearIconPress={() => {
                            filterUsers('')
                        }}
                    />
                </View>
            }
            {!selectedUser ?
                <View style={{ paddingHorizontal: 20, zIndex: -10 }}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={filteredUsers}

                        renderItem={({ item }) =>
                            <Pressable onPress={() => setSelectedUser(item)}>
                                <View style={{
                                    // backgroundColor: appTheme.colors.inverseOnSurface,
                                    marginTop: 10,
                                    padding: 5,
                                    flexDirection: 'row',
                                    gap: 10,
                                    borderRadius: 5
                                }}>
                                    {item.profile?.avatar?.url ?
                                        <Avatar.Image size={50} source={{ uri: item.profile?.avatar?.url }} />
                                        :
                                        <Avatar.Icon icon={'account'} size={50} />
                                    }
                                    <View style={{ alignSelf: 'center', marginTop: -5 }}>
                                        <Text style={{ fontSize: 18, }}>{item.username}</Text>
                                    </View>

                                </View>
                            </Pressable>
                        }

                        keyExtractor={item => item._id}
                    />
                </View>
                :

                <ScrollView>
                    <View style={{ paddingHorizontal: 20, zIndex: -10, gap: 20, paddingBottom: 20, }}>
                        <Pressable>
                            <View style={{
                                // backgroundColor: appTheme.colors.inverseOnSurface,
                                marginTop: 10,
                                padding: 5,
                                flexDirection: 'row',
                                gap: 10,
                                borderRadius: 5
                            }}>
                                {selectedUser.profile?.avatar?.url ?
                                    <Avatar.Image size={50} source={{ uri: selectedUser.profile?.avatar?.url }} />
                                    :
                                    <Avatar.Icon icon={'account'} size={50} />
                                }
                                <View style={{ alignSelf: 'center', marginTop: -5 }}>
                                    <Text style={{ fontSize: 18, }}>{selectedUser.username}</Text>
                                </View>
                                <IconButton onPress={() => setSelectedUser(null)} style={{ marginLeft: 'auto' }} icon={'account-remove'} />
                            </View>
                        </Pressable>

                        <TextInput
                            multiline
                            numberOfLines={15}
                            placeholder='Your message'
                            value={message}
                            onChangeText={(value) => setMessage(value)}
                        />
                        <Button loading={isSubmitting} onPress={sendMessage} disabled={!Boolean(message) || isSubmitting} mode='contained' style={{ marginTop: 'auto' }}> Send </Button>
                    </View>
                </ScrollView>
            }
        </View>
    )
}