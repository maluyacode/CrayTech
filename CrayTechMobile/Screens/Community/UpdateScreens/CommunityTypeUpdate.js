import { View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useTheme, Text, RadioButton } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native'
import hideTabBar from '@/Utils/hideTabBar';
import { getCommunityAPI, updateCommunityAPI } from '@/services/communityService';

export default function CommunityTypeUpdate({ navigation, route }) {

    const appTheme = useTheme();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { id } = route.params
    const { token } = useSelector(state => state.auth);

    const [community, setCommunity] = useState({});
    const [value, setValue] = useState(null);

    const getCommunity = async () => {
        try {

            const data = await getCommunityAPI({ id: id, token: token })

            setCommunity(data.community);
            setValue(data.community.community_type);

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

    const submit = async (value) => {
        setIsSubmitting(true)
        try {

            const data = await updateCommunityAPI({
                id: id,
                token: token,
                body: {
                    community_type: value,
                }
            })

            // navigation.navigate('CommunityDetails', { _id: community._id })

            setIsSubmitting(false)
        } catch (err) {
            setIsSubmitting(false)
            console.log(err);
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: appTheme.colors.background }}>
            <View
            // style={{ padding: 10, }}
            >

                <RadioButton.Group onValueChange={value => {
                    submit(value)
                    setValue(value)
                }} value={value}>

                    <RadioButton.Item label="Public" value="public" labelStyle={{ fontWeight: 900 }} />
                    <Text variant='bodySmall' style={{ paddingHorizontal: 15, marginTop: -10, marginBottom: 10 }}>Anyone can joined, post, comments, etc.</Text>

                    <RadioButton.Item label="Restricted" value="restricted" labelStyle={{ fontWeight: 900, }} />
                    <Text variant='bodySmall' style={{ paddingHorizontal: 15, marginTop: -10, marginBottom: 10 }}>Anyone can joined, but has limited access.</Text>

                    <RadioButton.Item label="Private" value="private" labelStyle={{ fontWeight: 900, }} />
                    <Text variant='bodySmall' style={{ paddingHorizontal: 15, marginTop: -10, marginBottom: 10 }}>Your community is not visible to everyone.</Text>

                </RadioButton.Group>

            </View>
        </View>
    )
}