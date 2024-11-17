import { Alert, Image, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Avatar, Button, Text, useTheme } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import baseURL from '@/assets/common/baseUrl';
import mime from "mime"
import { setAuth } from '@/state/authSlice';
import { useNavigation } from '@react-navigation/native'

export default function ChangeAvatar() {

    const appTheme = useTheme();
    const { user, token } = useSelector(state => state.auth);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [avatar, setAvatar] = useState()
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const pickImage = async () => {

        const c = await ImagePicker.requestCameraPermissionsAsync();

        if (c.status !== "granted") {
            Alert.alert("", "We need your permission to proceed")
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const submit = async () => {
        setIsSubmitting(true);
        try {

            const newImageUri = "file:///" + avatar?.split("file:/").join("");
            const formData = new FormData();
            formData.append('avatar', {
                uri: newImageUri,
                type: mime.getType(newImageUri),
                name: newImageUri?.split("/").pop()
            })

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

        setAvatar(user.profile?.avatar?.url);

    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: appTheme.colors.background }}>

            <View
                style={{ padding: 5, gap: 20, marginTop: 30, }}
            >
                <Image
                    source={{ uri: avatar }}
                    style={{ alignSelf: 'center', borderWidth: 0.3, borderColor: appTheme.colors.primary, maxWidth: 400, }}
                    height={300}
                    width={'100%'}
                    size={150}
                />

                <Button
                    onPress={avatar === user.profile?.avatar?.url || !user.profile?.avatar?.url ?
                        pickImage
                        :
                        () => setAvatar(user.profile?.avatar?.url || null)
                    }
                >
                    {avatar === user.profile?.avatar?.url || !user.profile?.avatar?.url ?
                        "Upload Photo"
                        :
                        "Reset"
                    }
                </Button>

                <Button
                    mode='contained'
                    onPress={submit}
                    disabled={isSubmitting || !avatar || avatar === user?.profile?.avatar?.url}
                    loading={isSubmitting}
                >
                    Save
                </Button>
            </View>

        </View >
    )
}