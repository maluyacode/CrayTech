import { View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useTheme, Text, Divider, Avatar, Button } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native'
import hideTabBar from '@/Utils/hideTabBar';
import { getCommunityAPI, updateCommunityAPI } from '@/services/communityService';
import { FlatList } from 'react-native-gesture-handler';

export default function CommunityMembers({ navigation, route }) {

    const appTheme = useTheme();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { id } = route.params
    const { token } = useSelector(state => state.auth);

    const [community, setCommunity] = useState({});
    const [members, setMembers] = useState([]);

    const getCommunity = async () => {
        try {

            const data = await getCommunityAPI({ id: id, token: token })

            setCommunity(data.community);
            setMembers(data.members);

        } catch (err) {
            console.log("Cannot get community");
            console.log(err.data);
        }
    }

    useEffect(() => {
        getCommunity()
    }, [])

    useFocusEffect(
        useCallback(() => {

            hideTabBar(navigation, appTheme);

        }, [])
    )

    const submit = async (members) => {

        const updatedMembers = members.map(member => {
            return member.members
        })

        setIsSubmitting(true)
        try {

            const data = await updateCommunityAPI({
                id: id,
                token: token,
                body: {
                    members: JSON.stringify(updatedMembers),
                }
            })

            setIsSubmitting(false)
        } catch (err) {
            setIsSubmitting(false)
            console.log(err);
        }

    }

    const removeMember = async (userId) => {
        try {

            const updatedMembers = members.filter(member => member.members._id !== userId)

            setMembers(updatedMembers)
            submit(updatedMembers)

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: appTheme.colors.background }}>
            <View style={{ padding: 10, }}>

                <FlatList
                    data={members}
                    ItemSeparatorComponent={() => (
                        <View style={{ marginVertical: 10 }} />
                    )}
                    ListFooterComponent={() => (
                        <>
                            {members.length <= 0 &&
                                <View style={{ marginBottom: 250, }} >
                                    <Divider style={{ marginVertical: 20, width: 300, alignSelf: 'center' }} />
                                    <Text variant='labelLarge' style={{ textAlign: 'center' }}> Wala na po! </Text>
                                </View>
                            }
                        </>
                    )}
                    keyExtractor={item => item.members._id}
                    renderItem={({ item }) => (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', gap: 15 }}>
                                {item?.membersInfo?.profile?.avatar?.url ?
                                    <Avatar.Image source={{ uri: item?.membersInfo?.profile?.avatar?.url }} />
                                    :
                                    <Avatar.Icon icon={'account'} />
                                }
                                <View style={{ alignSelf: 'center', marginTop: -5 }}>
                                    <Text variant='titleMedium'>{item.membersInfo.username}</Text>
                                    {item?.membersInfo?.profile?.preferences?.privacy?.showEmail &&
                                        <Text variant='bodyMedium'>{item?.membersInfo?.email}</Text>
                                    }
                                </View>
                            </View>

                            <View style={{ alignSelf: 'center' }}>
                                <Button mode='outlined'
                                    onPress={() => removeMember(item.members._id)}
                                    loading={isSubmitting}
                                    disabled={isSubmitting || item.members.role === 'moderator'}
                                >
                                    {item.members.role === 'moderator' ? "Moderator" : "Remove"}
                                </Button>
                            </View>
                        </View>
                    )}
                />

            </View>
        </View>
    )
}