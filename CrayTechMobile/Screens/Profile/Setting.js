import { ScrollView, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme, Text, Avatar, Switch, Button } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux';
import { List, MD3Colors } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'
import { socket } from '@/socket';
import { removeAuth, setAuth } from '@/state/authSlice';
import axios from 'axios';
import baseURL from '@/assets/common/baseUrl';

export default function Setting() {

    const appTheme = useTheme();
    const { user, token } = useSelector(state => state.auth);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [isDarkMode, setIsDarkMode] = useState(user.profile.preferences.theme === 'dark');
    const [isEmailShow, setIsEmailShow] = useState(user.profile.preferences?.privacy?.showEmail);
    const [replyNotify, setReplyNotify] = useState(user.profile.preferences?.notifications?.replies);
    const [commentNotify, setCommentNotify] = useState(user.profile.preferences?.notifications?.comments);
    const [communityNotify, setCommunityNotify] = useState(user.profile?.preferences?.notifications?.communityUpdates);
    const [messageNotify, setMessageNotify] = useState(user.profile.preferences?.notifications?.messageNotify);

    const handleLogout = () => {
        socket.disconnect();
        dispatch(removeAuth())
    }

    const submit = async () => {
        try {
            const formData = new FormData();

            formData.append('preferences', JSON.stringify({
                theme: isDarkMode ? 'dark' : 'light',
                notifications: {
                    replies: replyNotify,
                    comments: commentNotify,
                    communityUpdates: communityNotify,
                    messageNotify: messageNotify,
                },
                privacy: {
                    showEmail: isEmailShow,
                },
            }));



            const { data } = await axios.put(`${baseURL}/user/update/profile/${user._id}`, formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            dispatch(
                setAuth({
                    user: data.user,
                    token: token,
                })
            )


            navigation.navigate('Setting');


        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    }


    const handleToggle = async (booleanValue, setBoolean) => {
        setBoolean(booleanValue)
    }

    useEffect(() => {
        submit();
    }, [
        isDarkMode,
        isEmailShow,
        replyNotify,
        commentNotify,
        communityNotify,
        messageNotify,
    ])

    return (
        <View style={{ flex: 1, backgroundColor: appTheme.colors.background }}>
            <ScrollView>

                <View
                    style={{ padding: 10, alignItems: 'center', gap: 5, marginTop: 5, }}
                >
                    <Avatar.Image
                        source={{ uri: user.profile?.avatar?.url || placeHolder }}
                        size={100}
                    />
                    <Text variant='titleMedium'>{user.username} </Text>

                </View>

                <View>

                    <List.Section>

                        <List.Subheader>Profile</List.Subheader>

                        <List.Item
                            onPress={() => navigation.navigate('UserPosts')}
                            title="Posts"
                            right={() => <List.Icon icon={'arrow-right'} />}
                        />

                        <List.Item
                            onPress={() => navigation.navigate('ChangeAvatar')}
                            title="Change Avatar"
                            right={() => <List.Icon icon={'arrow-right'} />}
                        />

                        <List.Item
                            onPress={() => navigation.navigate('ChangeUsername')}
                            title="Change Username"
                            right={() => <List.Icon icon={'arrow-right'} />}
                        />

                        <List.Item
                            onPress={() => navigation.navigate('ChangePassword')}
                            title="Change Password"
                            right={() => <List.Icon icon={'arrow-right'} />}
                        />

                        <List.Subheader>Preferences</List.Subheader>

                        <List.Item
                            title="Dark Mode"
                            right={() =>
                                <Switch
                                    value={isDarkMode}
                                    onValueChange={() => handleToggle(!isDarkMode, setIsDarkMode)}
                                    style={{ height: 20 }}
                                />
                            }
                        />

                        <List.Item
                            title="Show Email"
                            right={() => <Switch
                                value={isEmailShow}
                                onValueChange={() => handleToggle(!isEmailShow, setIsEmailShow)}
                                style={{ height: 20 }}
                            />}
                        />

                        <List.Subheader>Notifications</List.Subheader>

                        <List.Item
                            title="Messages"
                            right={() => <Switch
                                value={messageNotify}
                                onValueChange={() => handleToggle(!messageNotify, setMessageNotify)}
                                style={{ height: 20 }}
                            />}
                        />

                        <List.Item
                            title="Replies"
                            right={() => <Switch
                                value={replyNotify}
                                onValueChange={() => handleToggle(!replyNotify, setReplyNotify)}
                                style={{ height: 20 }}
                            />}
                        />

                        <List.Item
                            title="Comments"
                            right={() => <Switch
                                value={commentNotify}
                                onValueChange={() => handleToggle(!commentNotify, setCommentNotify)}
                                style={{ height: 20 }}
                            />}
                        />

                        <List.Item
                            title="Community Updates"
                            right={() => <Switch
                                value={communityNotify}
                                onValueChange={() => handleToggle(!communityNotify, setCommunityNotify)}
                                style={{ height: 20 }}
                            />}
                        />

                    </List.Section>
                </View>

                <View style={{ padding: 10, }}>
                    <Button
                        icon={'logout'}
                        onPress={handleLogout}
                        mode='outlined'
                    >
                        Logout
                    </Button>
                </View>

            </ScrollView>

        </View>
    )
}

const placeHolder = 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
