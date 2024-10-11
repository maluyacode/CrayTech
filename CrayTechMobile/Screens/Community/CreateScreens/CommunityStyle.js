import { Alert, Image, View, } from 'react-native'
import React, { useEffect, useState } from 'react'
import hideTabBar from '@/Utils/hideTabBar';
import { useTheme, Text, Button, Avatar, Card, List } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import imageObjectify from '@/Utils/imageObjectify';

const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

export default function CommunityStyle({ route, navigation }) {

    const communityCreateData = route.params;
    const appTheme = useTheme();

    const [avatar, setAvatar] = useState(null);
    const [banner, setBanner] = useState(null);

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

    const submit = () => {
        try {

            navigation.navigate("SelectTopics", {
                ...communityCreateData,
                avatar: imageObjectify(avatar),
                banner: imageObjectify(banner),
            })

        } catch (err) {
            Alert.alert("Error occured");
            console.log(err);
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
                <Text variant='labelLarge' style={{ alignSelf: 'center' }}>2/4</Text>
                <Button mode='outlined' labelStyle={{ fontSize: 12, }}
                    onPress={submit}
                >Next
                </Button>

            </View>

            <View style={{ padding: 15, }}>
                <Text variant='titleLarge' style={{ fontWeight: 800 }}>Avatar and Cover</Text>
                <Text>This view will be shown whenever people visits your community.</Text>
            </View>

            <View style={{ marginHorizontal: 10, paddingBottom: 10, borderColor: appTheme.colors.primary, borderWidth: 2, borderRadius: 15, height: 230 }}>
                <Image source={{ uri: banner || img }} style={{ flex: 3, borderTopLeftRadius: 13, borderTopRightRadius: 13 }} />
                <View style={{ flex: 2, flexDirection: 'row', paddingHorizontal: 10., marginTop: -15 }}>
                    <Avatar.Image source={{ uri: avatar || img }} />
                    <View style={{ alignSelf: 'center', marginLeft: 10 }}>
                        <Text variant='titleMedium'>{communityCreateData?.name}</Text>
                        <Text variant='labelSmall'>{"1 member"}</Text>
                    </View>
                </View>
                <View style={{ flex: 1, paddingHorizontal: 15 }}>
                    <Text variant='bodySmall'>{communityCreateData.description}</Text>
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

        </View>
    )
}

const img =
    "https://static.vecteezy.com/system/resources/previews/036/271/975/original/ai-generated-lobster-illustration-lobster-shrimp-cartoon-on-transparent-background-free-png.png";