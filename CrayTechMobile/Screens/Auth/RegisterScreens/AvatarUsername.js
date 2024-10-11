import React, { useEffect, useState } from 'react'
import { View, Text, Alert } from 'react-native'
import { Avatar, Button, useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from "@react-navigation/native"

import TextInput from '@/Components/TextInput'
import mime from "mime"
import axios from 'axios';
import baseURL from '@/assets/common/baseUrl';

export default function AvatarUsername({ route }) {

    const theme = useTheme()
    const navigation = useNavigation();

    const [image, setImage] = useState(null);
    const [username, setUsername] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setUsername(route.params?.username);
    }, [])

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
            setImage(result.assets[0].uri);
        }
    };


    const updateAvatarUserName = async (formData) => {

        try {
            setIsSubmitting(true)
            const { data } = await axios.put(
                `${baseURL}/user/update/profile/${route.params._id}`, formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            )
            setIsSubmitting(false)
            navigation.navigate("Topics", { _id: route.params._id })
        } catch (err) {
            console.log(err)
            setIsSubmitting(false)
            Alert.alert("ERROR OCCURED");
        }

    }

    const submit = () => {
        if (image?.split(':')[0] !== 'file') {
            Alert.alert("", "Profile photo is required");
            return;
        }

        const formData = new FormData();

        const newImageUri = "file:///" + image?.split("file:/").join("");

        let userData = {};

        userData.username = username

        userData.avatar = {
            uri: newImageUri,
            type: mime.getType(newImageUri),
            name: newImageUri?.split("/").pop()
        }

        Object.entries(userData).forEach(([key, value]) => {
            formData.append(key, value);
        })

        updateAvatarUserName(formData)
    }

    return (
        <View
            style={{
                // gap: 20,
                flex: 1,
                height: '100%',
                padding: 15,
                maxWidth: 500,
                marginTop: 40,
                backgroundColor: theme.colors.background,
            }}
        >
            <View style={{ flex: 1, justifyContent: "flex-end", }}>

                <Avatar.Image style={{ alignSelf: "center", }} size={150} source={
                    image ? { uri: image } : require('@assets/avatar.png')
                } />

                <Button onPress={image ? () => setImage(null) : pickImage}>
                    {image ? "Remove Image" : "Choose Image"}
                </Button>

                <TextInput
                    onChangeText={(value) => setUsername(value)}
                    name="username"
                    label="Username"
                    textContentType="username"
                    mode={"outlined"}
                    value={username}
                />
            </View>

            <View style={{ flex: 1, gap: 10, justifyContent: "flex-end", paddingVertical: 2, }}>
                <Button loading={isSubmitting} disabled={isSubmitting} mode='outlined' onPress={() => navigation.navigate("Topics", { _id: route.params._id })}>Skip</Button>
                <Button loading={isSubmitting} disabled={isSubmitting} mode='contained' onPress={submit}>Next</Button>
            </View>
        </View>
    )
}