import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme, Text, TextInput, Button } from 'react-native-paper';
import { useSelector } from 'react-redux';
import hideTabBar from '@/Utils/hideTabBar';
import { getCommunityAPI, updateCommunityAPI } from '@/services/communityService';

export default function CommunityUpdateDetails({ navigation, route }) {

    const appTheme = useTheme();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { id } = route.params
    const { token } = useSelector(state => state.auth);

    const [community, setCommunity] = useState({});
    const [name, setName] = useState(null)
    const [description, setDescription] = useState(null)

    const getCommunity = async () => {
        try {

            const data = await getCommunityAPI({ id: id, token: token })

            setCommunity(data.community);
            setName(data.community.name)
            setDescription(data.community.description)

        } catch (err) {
            console.log("Cannot get community");
            console.log(err.data);
        }
    }

    useEffect(() => {
        hideTabBar(navigation, appTheme);
    }, [navigation]);

    useEffect(() => {
        getCommunity()
    }, [])

    const submit = async () => {
        setIsSubmitting(true)
        try {

            const data = await updateCommunityAPI({
                id: id,
                token: token,
                body: {
                    name: name,
                    description: description,
                }
            })

            navigation.navigate('CommunityDetails', { _id: community._id })

            setIsSubmitting(false)
        } catch (err) {
            setIsSubmitting(false)
            console.log(err);
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: appTheme.colors.background }}>

            <View style={{ padding: 10, gap: 20, }}>

                <View style={{ gap: 5 }}>
                    <Text variant='titleMedium'>Community Name</Text>
                    <TextInput
                        value={name}
                        onChangeText={value => setName(value)}
                        placeholder={'Enter community name'}
                    />
                </View>

                <View style={{ gap: 5 }}>
                    <Text variant='titleMedium'>Community Description</Text>
                    <TextInput
                        multiline
                        numberOfLines={10}
                        value={description}
                        onChangeText={value => setDescription(value)}
                        placeholder={'Enter community description'}
                    />
                </View>

                <Button
                    onPress={submit}
                    mode='contained'
                    loading={isSubmitting}
                    disabled={isSubmitting || (community.name === name && community.description === description)}
                >
                    Submit
                </Button>
            </View>

        </View>
    )
}