import { View, } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme, Text, Button, RadioButton } from 'react-native-paper';
import hideTabBar from '@/Utils/hideTabBar';
import axios from 'axios';
import baseURL from '@/assets/common/baseUrl';
import { useSelector } from 'react-redux';

export default function CommunityType({ route, navigation }) {

    const appTheme = useTheme();
    const communityData = route.params;
    const { token } = useSelector(state => state.auth);
    const [value, setValue] = useState('public');

    console.log(token);

    const submit = async () => {
        try {

            const formData = new FormData();
            communityData.community_type = value;

            Object.entries(communityData).forEach(([key, value]) => {
                formData.append(key, value);
            })

            const { data } = await axios.post(`${baseURL}/community/create`, formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": 'multipart/form-data'
                }
            });

            navigation.navigate("Communities")

        } catch (err) {
            alert("Error occured");
            console.log(err)
        }
    }

    useEffect(() => {

        hideTabBar(navigation, appTheme);

    }, [navigation]);

    return (
        <View style={{ flex: 1, backgroundColor: appTheme.colors.background }}>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>

                <Button mode='outlined' labelStyle={{ fontSize: 12, }}
                    onPress={() => navigation.goBack()}
                >Back
                </Button>
                <Text variant='labelLarge' style={{ alignSelf: 'center' }}>4/4</Text>
                <Button mode='outlined' labelStyle={{ fontSize: 12, }}
                    onPress={submit}
                >Create
                </Button>
            </View>

            <View style={{ padding: 15, }}>
                <Text variant='titleLarge' style={{ fontWeight: 800 }}>Community Type</Text>
                <Text>Select what type of community you want to publish.</Text>
            </View>

            <RadioButton.Group onValueChange={value => setValue(value)} value={value}>

                <RadioButton.Item label="Public" value="public" labelStyle={{ fontWeight: 900 }} />
                <Text variant='bodySmall' style={{ paddingHorizontal: 15, marginTop: -10, marginBottom: 10 }}>Anyone can joined, post, comments, etc.</Text>

                <RadioButton.Item label="Restricted" value="restricted" labelStyle={{ fontWeight: 900, }} />
                <Text variant='bodySmall' style={{ paddingHorizontal: 15, marginTop: -10, marginBottom: 10 }}>Anyone can joined, but has limited access.</Text>

                <RadioButton.Item label="Private" value="private" labelStyle={{ fontWeight: 900, }} />
                <Text variant='bodySmall' style={{ paddingHorizontal: 15, marginTop: -10, marginBottom: 10 }}>Your community is not visible to everyone.</Text>

            </RadioButton.Group>

        </View>
    )
}