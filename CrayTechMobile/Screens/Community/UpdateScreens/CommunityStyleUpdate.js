import { Alert, Image, View, } from 'react-native'
import React, { useEffect, useState } from 'react'
import hideTabBar from '@/Utils/hideTabBar';
import { useTheme, Text, Button, Avatar, Card, List } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import imageObjectify from '@/Utils/imageObjectify';
import { getCommunityAPI, updateCommunityAPI } from '@/services/communityService';
import { useSelector } from 'react-redux';

export default function CommunityStyleUpdate({ route, navigation }) {

    const appTheme = useTheme();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { id } = route.params
    const { token } = useSelector(state => state.auth);

    const [avatar, setAvatar] = useState(null);
    const [banner, setBanner] = useState(null);
    const [community, setCommunity] = useState({});

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
            return result.assets[0].uri;
        }
    };

    const addCover = async () => {
        const img = await pickImage();
        setBanner(img);
    }

    const addAvatar = async () => {
        const img = await pickImage();
        setAvatar(img);
    }

    const submit = async () => {
        setIsSubmitting(true)
        try {

            const formData = new FormData();

            if (avatar !== community.avatar.url && avatar !== img) {
                console.log(avatar)
                formData.append('avatar', imageObjectify(avatar))
            }

            if (banner !== community.banner.url && banner !== img) {
                console.log(banner)
                formData.append('banner', imageObjectify(banner))
            }

            const data = await updateCommunityAPI({
                id: id,
                token: token,
                body: formData
            })

            navigation.navigate('CommunityDetails', { _id: community._id })

            setIsSubmitting(false)
        } catch (err) {
            setIsSubmitting(false)
            console.log(err);
        }
    }

    const getCommunity = async () => {
        try {

            const data = await getCommunityAPI({ id: id, token: token })

            setCommunity(data.community);
            setAvatar(data.community?.avatar?.url || img)
            setBanner(data.community?.banner?.url || img)

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

    return (
        <View style={{ flex: 1, backgroundColor: appTheme.colors.background }}>

            <View style={{ padding: 15, }}>
                <Text variant='titleLarge' style={{ fontWeight: 800 }}>Avatar and Cover</Text>
                <Text>This view will be shown whenever people visits your community.</Text>
            </View>

            <View style={{ marginHorizontal: 10, paddingBottom: 10, borderColor: appTheme.colors.primary, borderWidth: 2, borderRadius: 15, height: 230 }}>
                <Image source={{ uri: banner || img }} style={{ flex: 3, borderTopLeftRadius: 13, borderTopRightRadius: 13 }} />
                <View style={{ flex: 2, flexDirection: 'row', paddingHorizontal: 10., marginTop: -15 }}>
                    <Avatar.Image source={{ uri: avatar || img }} />
                    <View style={{ alignSelf: 'center', marginLeft: 10 }}>
                        <Text variant='titleMedium'>{community?.name}</Text>
                        <Text variant='labelSmall'>{community?.members?.length} members</Text>
                    </View>
                </View>
                <View style={{ flex: 1, paddingHorizontal: 15 }}>
                    <Text variant='bodySmall'>{community.description}</Text>
                </View>
            </View>

            <List.Section style={{ marginRight: -10 }}>
                <List.Item title="Avatar"
                    onPress={avatar ? () => setAvatar(null) : addAvatar}
                    right={({ color }) =>
                    (<Button icon={'image'} mode='outlined'>
                        {avatar ? "Remove" : "Add"}
                    </Button>)
                    }
                />
                <List.Item title="Cover"
                    onPress={banner ? () => setBanner(null) : addCover}
                    right={({ color }) =>
                    (<Button icon={'image'} mode='outlined'>
                        {banner ? "Remove" : "Add"}
                    </Button>)
                    }
                />
            </List.Section>

            <View style={{ paddingHorizontal: 10, }}>
                <Button
                    onPress={submit}
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    mode='outlined'
                >
                    Update
                </Button>
            </View>

        </View>
    )
}

const img =
    "https://static.vecteezy.com/system/resources/previews/036/271/975/original/ai-generated-lobster-illustration-lobster-shrimp-cartoon-on-transparent-background-free-png.png";