import { Alert, View } from 'react-native'
import React, { useState } from 'react'
import { Button, Text, TextInput, useTheme } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native'
import axios from 'axios';
import baseURL from '@/assets/common/baseUrl';
import { setAuth } from '@/state/authSlice';

export default function ChangePassword() {

    const appTheme = useTheme();
    const { user, token } = useSelector(state => state.auth);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [newPassword, setNewPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);

    const submit = async () => {
        setIsSubmitting(true);
        try {

            const formData = new FormData();

            formData.append('password', newPassword);

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

            Alert.alert('', 'Password changed!');

        } catch (err) {
            setIsSubmitting(false);
            console.log(err);
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: appTheme.colors.background }}>

            <View style={{ padding: 10, gap: 10, flex: 1, justifyContent: 'center' }}>

                <View style={{ gap: 5 }}>
                    <Text variant='bodyLarge'>New Password</Text>
                    <TextInput
                        dense
                        secureTextEntry
                        textContentType='password'
                        mode='outlined'
                        placeholder='Enter new password'
                        onChangeText={(value) => setNewPassword(value)}
                    />
                </View>

                <View style={{ gap: 5 }}>
                    <Text variant='bodyLarge'>Confirm Password</Text>
                    <TextInput
                        dense
                        secureTextEntry
                        textContentType='password'
                        mode='outlined'
                        placeholder='Enter confirm password'
                        onChangeText={(value) => setConfirmPassword(value)}
                    />
                </View>

                <Button
                    loading={isSubmitting}
                    disabled={
                        isSubmitting ||
                        !newPassword ||
                        !confirmPassword
                    }
                    style={{ marginTop: 5 }}
                    mode='contained'
                    onPress={submit}
                >
                    Submit
                </Button>

            </View>

        </View >
    )
}