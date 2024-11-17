import { StatusBar } from "expo-status-bar";
import { useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, View, Image, Alert, TextInput as RNInput } from "react-native";
import { Button, IconButton, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "react-native-vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Video, ResizeMode } from 'expo-av';
import TextInput from "@/Components/TextInput";
import { ScrollView } from "react-native-gesture-handler";
import imageObjectify from "@/Utils/imageObjectify";
import axios from "axios";
import baseURL from "@/assets/common/baseUrl";

export default function PostCreate({ navigation }) {

    const appTheme = useTheme();
    const [title, setTitle] = useState(null);
    const [body, setBody] = useState(null);
    const [videos, setVideos] = useState([]);
    const [images, setImages] = useState([]);
    const [poll, setPoll] = useState([{ option: '', id: Date.now() }, { option: '', id: Date.now() + 1 }]);
    const [postType, setPostType] = useState(null);
    const [canGo, setCanGo] = useState(false);

    const addFile = async (mediaType = ImagePicker.MediaTypeOptions.Images) => {
        try {

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: mediaType,
                quality: 1,
                allowsMultipleSelection: true,
            });

            if (!result.canceled) {
                return result.assets;
            }

        } catch (err) {
            console.err(err);
        }
    };

    const pickVideo = async () => {
        const videos = await addFile(ImagePicker.MediaTypeOptions.Videos);
        if (videos) {
            setVideos(videos.map(video => video.uri));
            setPostType('video')
        }
    }

    const pickImage = async () => {
        const images = await addFile(ImagePicker.MediaTypeOptions.Images);
        if (images) {
            setImages(images.map(image => image.uri));
            setPostType('image')
        }
    }

    const createPool = () => {
        setPostType('poll');
    }

    const onChangeTextOption = (value, id) => {
        const updatedPoll = poll.map(option =>
            option.id === id ? { ...option, option: value } : option
        );
        setPoll(updatedPoll);
    }

    const addOption = () => {
        setPoll([...poll, {
            option: '',
            id: Date.now(),
        }])
    }

    const removeOption = (id) => {
        const updatedPool = poll.filter(option => option.id !== id);
        setPoll(updatedPool);
    }

    const removeMedia = (key, media) => {
        if (media === 'video') {
            const updateVideos = videos.filter((_, index) => index !== key);
            setVideos(updateVideos);
            if (updateVideos.length <= 0) {
                setPostType(null);
            }
        } else if (media === 'image') {
            const updatedImages = images.filter((_, index) => index !== key);
            setImages(updatedImages)
            if (updatedImages.length <= 0) {
                setPostType(null);
            }
        }
    }

    useEffect(() => {
        let canProceed = true;

        // Validate poll options if the post type is a poll
        if (postType === 'poll') {
            const allPollOptionsFilled = poll.every(option => option.option);
            if (!allPollOptionsFilled) {
                canProceed = false;
            }
        }

        // Validate the title (should not be empty)
        if (!title) {
            canProceed = false;
        }

        // Set the result of the combined validation
        setCanGo(canProceed);

    }, [title, videos, images, poll, postType]);

    const submit = async () => {

        const data = {
            videos,
            images,
            title,
            body,
            poll,
        }

        if (postType !== 'poll') {
            delete data.poll
        } else {
            data.poll = JSON.stringify(data.poll);
        }

        data.videos = data.videos.map(video => imageObjectify(video))
        data.images = data.images.map(image => imageObjectify(image))

        if (postType !== 'video') {
            delete data.videos
        }

        if (postType !== 'image') {
            delete data.images
        }

        navigation.navigate("SelectCommunity", data);

    }

    useEffect(() => {
        hideTabBar(navigation, appTheme);
    }, [navigation]);

    return (
        <View style={{ flex: 1, backgroundColor: appTheme.colors.background }}>

            <View style={{ flex: 1 }}>
                <View
                    style={{
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <IconButton
                        onPress={() => navigation.goBack()}
                        icon={() => (
                            <Ionicons
                                name="arrow-back-circle-outline"
                                size={35}
                                color={appTheme.colors.onSurface} // Set the color directly in Ionicons
                            />
                        )}
                    />
                    <Button onPress={submit} disabled={!canGo} compact mode="contained" style={{ alignSelf: "center" }}>
                        Next
                    </Button>
                </View>
                <ScrollView>
                    <View style={{ padding: 10, gap: 15 }}>
                        <TextInput label="Title" onChangeText={(value) => setTitle(value)} />

                        {postType === 'video' &&
                            < ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 5 }}>
                                    {videos.map((video, index) => (
                                        <View key={index} style={{ width: 170, }}>
                                            <View style={{ backgroundColor: appTheme.colors.outline }}>
                                                <Video
                                                    style={{ height: 250 }}
                                                    source={{
                                                        uri: video,
                                                    }}
                                                    useNativeControls
                                                    resizeMode={ResizeMode.CONTAIN}
                                                />
                                            </View>
                                            <Button onPress={() => removeMedia(index, 'video')} textColor={appTheme.colors.error} >Remove</Button>
                                        </View>
                                    ))}
                                </View>
                            </ScrollView>
                        }

                        {postType === 'image' &&
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 5 }}>
                                    {images.map((image, index) => (
                                        <View key={index} style={{ width: 170, }}>
                                            <View style={{ backgroundColor: appTheme.colors.outline }}>
                                                <Image
                                                    style={{ height: 250 }}
                                                    source={{ uri: images[index] }}
                                                    resizeMode='cover'
                                                />
                                            </View>
                                            <Button onPress={() => removeMedia(index, 'image')} textColor={appTheme.colors.error} >Remove</Button>
                                        </View>
                                    ))}
                                </View>
                            </ScrollView>
                        }

                        <TextInput
                            label="Body (optional)"
                            multiline={true}
                            onChangeText={(value) => setBody(value)}
                            numberOfLines={postType === 'poll' ? 1 : 15}
                        />

                        {postType === 'poll' &&
                            <View style={{ marginTop: 3, paddingHorizontal: 15, paddingBottom: 20, borderColor: appTheme.colors.onSurfaceDisabled, borderWidth: 1, borderRadius: 5, }}>

                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text>Generate poll options</Text>
                                    <IconButton icon={'backspace-outline'} iconColor={appTheme.colors.onSurface} style={{ marginRight: -6 }}
                                        onPress={() => {
                                            setPostType(null)
                                            setPoll([{ option: '', id: Date.now() }, { option: '', id: Date.now() + 1 }]);
                                        }}
                                    />
                                </View>

                                <View style={{ gap: 10 }}>
                                    {poll.map((poll, i) => (
                                        <View key={poll.id} style={{ flexDirection: 'row', justifyContent: 'space-between', height: 40 }}>
                                            <TextInput
                                                placeholder="Option"
                                                mode='outlined'
                                                style={{ height: 40, flex: 1, }}
                                                onChangeText={(value) => onChangeTextOption(value, poll.id)}
                                            />
                                            {i > 1 &&
                                                <IconButton onPress={() => removeOption(poll.id)} icon={"delete-outline"} style={{ alignSelf: 'center', padding: 0 }} />
                                            }
                                        </View>
                                    ))}
                                    <Button onPress={addOption} mode="outlined" style={{ borderRadius: 5 }} >Add</Button>
                                </View>

                            </View>
                        }

                    </View>
                </ScrollView >
            </View>

            <View style={{ flexDirection: "row", backgroundColor: appTheme.colors.background }}>
                <IconButton icon="file-image-outline" size={30} iconColor={appTheme.colors.onSurface}
                    disabled={postType !== 'image' && postType !== null}
                    onPress={pickImage}
                />
                <IconButton icon="file-video-outline" size={30} iconColor={appTheme.colors.onSurface}
                    onPress={pickVideo}
                    disabled={postType !== 'video' && postType !== null}
                />
                <IconButton icon="human-male-board-poll" size={30} iconColor={appTheme.colors.onSurface}
                    onPress={createPool}
                    disabled={postType !== null || postType === 'poll'}
                />
            </View>
        </View >
    );
}