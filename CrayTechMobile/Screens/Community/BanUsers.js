import { FlatList, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useTheme, Text, Divider, Avatar, Button, Portal, Modal } from 'react-native-paper'
import { useFocusEffect } from '@react-navigation/native'
import hideTabBar from '@/Utils/hideTabBar'
import { useSelector } from 'react-redux'
import { getCommunityAPI, updateCommunityAPI } from '@/services/communityService'
import useModal from '@/hooks/useModal'
import { getUsersAPI } from '@/services/userService'

export default function BanUsers({ navigation, route }) {

    const appTheme = useTheme()
    const { id } = route.params
    const { token } = useSelector(state => state.auth);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { visible, showModal, hideModal } = useModal();

    const [bannedUsers, setBannedUsers] = useState([]);
    const [users, setUsers] = useState([]);

    const getCommunity = async () => {
        try {

            const data = await getCommunityAPI({ id: id, token: token })

            setBannedUsers(data.community.banned_users || []);

        } catch (err) {
            console.log("Cannot get community");
            console.log(err);
        }
    }

    const getUsers = async () => {
        try {

            const data = await getUsersAPI({ token: token })

            setUsers(data.users);

        } catch (err) {
            console.log(err);
        }
    }

    useFocusEffect(
        useCallback(() => {

            hideTabBar(navigation, appTheme);
            getCommunity();
            getUsers();
        }, [])
    )

    const updateBannedUsers = async (bannedUsersId) => {
        try {

            const formData = new FormData;
            formData.append('banned_users', JSON.stringify(bannedUsersId))

            const data = await updateCommunityAPI({
                token: token,
                id: id,
                body: formData
            });
        } catch (err) {
            
            console.log(err);
        }
    }

    const updateUsersList = () => {
        let bannedUsersId = bannedUsers.map((user) => {
            return user._id;
        });

        setUsers(
            users.filter(user => !bannedUsersId.includes(user._id))
        )
    }

    const addBanUser = async (id) => {
        const user = users.find(user => user._id === id);
        setBannedUsers(prev => [...prev, user]);
    }

    const removeBanUser = async (id) => {
        const user = bannedUsers.find(user => user._id === id);
        setBannedUsers(prev => prev.filter(user => user._id !== id));
        setUsers(prev => [user, ...prev]);
    }

    useEffect(() => {

        updateUsersList()
        updateBannedUsers(bannedUsers.map(user => {
            return user._id
        }))

    }, [bannedUsers])

    return (
        <View style={{ flex: 1, backgroundColor: appTheme.colors.background }}>

            <View style={{ padding: 10 }}>
                <FlatList
                    data={bannedUsers}
                    ItemSeparatorComponent={() => (
                        <View style={{ marginVertical: 10 }} />
                    )}
                    ListHeaderComponent={() => (
                        <View style={{ marginBottom: 10, }}>
                            <Button
                                onPress={() => {
                                    updateUsersList()
                                    showModal()
                                }}
                                mode='outlined'
                            >
                                Add
                            </Button>
                        </View>
                    )}
                    ListFooterComponent={() => (
                        <>
                            {bannedUsers.length > 0 ?
                                <></>
                                :
                                <View style={{ marginBottom: 250, }} >
                                    <Text variant='labelLarge' style={{ textAlign: 'center' }}> No banned users </Text>
                                </View>
                            }
                        </>
                    )}
                    keyExtractor={item => item._id}
                    renderItem={({ item }) => (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', gap: 15 }}>
                                {item?.profile?.avatar?.url ?
                                    <Avatar.Image source={{ uri: item?.profile?.avatar?.url }} size={50} />
                                    :
                                    <Avatar.Icon icon={'account'} size={50} />
                                }
                                <View style={{ alignSelf: 'center', marginTop: -5 }}>
                                    <Text variant='titleMedium'>{item.username}</Text>
                                    {item?.profile?.preferences?.privacy?.showEmail &&
                                        <Text variant='bodyMedium'>{item.email}</Text>
                                    }
                                </View>
                            </View>

                            <View style={{ alignSelf: 'center' }}>
                                <Button
                                    onPress={() => removeBanUser(item._id)}
                                    mode='outlined'
                                >
                                    Remove
                                </Button>
                            </View>
                        </View>
                    )}
                />
            </View>

            <Portal>
                <Modal visible={visible} onDismiss={hideModal}
                    contentContainerStyle={{
                        backgroundColor: appTheme.colors.background,
                        flex: 1,
                    }}
                >
                    <View style={{ marginBottom: 10, marginTop: 50, padding: 5, backgroundColor: appTheme.colors.onBackground }}>
                        <Text variant='titleSmall' style={{ textAlign: 'center', color: appTheme.colors.background, }}>Ban a user</Text>
                    </View>
                    <View style={{ paddingHorizontal: 10, }}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={users}
                            ItemSeparatorComponent={() => (
                                <View style={{ marginVertical: 10 }} />
                            )}
                            ListFooterComponent={() => (
                                <View style={{ marginBottom: 70, }}></View>
                            )}
                            keyExtractor={item => item._id}
                            renderItem={({ item }) => (
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row', gap: 15 }}>
                                        {item?.profile?.avatar?.url ?
                                            <Avatar.Image source={{ uri: item?.profile?.avatar?.url }} size={50} />
                                            :
                                            <Avatar.Icon icon={'account'} size={50} />
                                        }
                                        <View style={{ alignSelf: 'center', marginTop: -5 }}>
                                            <Text variant='titleMedium'>{item.username}</Text>
                                            {item?.profile?.preferences?.privacy?.showEmail &&
                                                <Text variant='bodyMedium'>{item.email}</Text>
                                            }
                                        </View>
                                    </View>

                                    <View style={{ alignSelf: 'center' }}>
                                        <Button
                                            onPress={() => addBanUser(item._id)}
                                            mode='outlined'
                                        >
                                            Add
                                        </Button>
                                    </View>
                                </View>
                            )}
                        />
                    </View>

                </Modal>
            </Portal>

        </View >
    )
}