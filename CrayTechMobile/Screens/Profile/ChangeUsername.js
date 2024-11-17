import { Alert, Image, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Avatar, Button, Text, TextInput, useTheme } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import baseURL from '@/assets/common/baseUrl';
import mime from "mime"
import { setAuth } from '@/state/authSlice';
import { useNavigation } from '@react-navigation/native'

export default function ChangeUsername() {

    const appTheme = useTheme();
    const { user, token } = useSelector(state => state.auth);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [username, setUsername] = useState()
    const dispatch = useDispatch();
    const navigation = useNavigation();


    const submit = async () => {
        setIsSubmitting(true);
        try {

            const formData = new FormData();

            formData.append('username', username);

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

            setIsSubmitting(false);

            navigation.navigate('Setting');

        } catch (err) {
            setIsSubmitting(false);
            console.log(err);
        }
    }

    useEffect(() => {
        setUsername(user.username)
        console.log(user)
    }, [user])

    return (
        <View style={{ flex: 1, backgroundColor: appTheme.colors.background }}>

            <View style={{ paddingHorizontal: 10, flex: 1, gap: 30, justifyContent: 'center' }}>
                <TextInput
                    mode='outlined'
                    value={username}
                    onChangeText={value => setUsername(value)}
                    label={'Username'}
                />
                <Button
                    mode='contained'
                    disabled={isSubmitting || username === user.username || username?.length < 5}
                    loading={isSubmitting}
                    onPress={submit}
                >
                    Submit
                </Button>
            </View>

        </View>
    )
}