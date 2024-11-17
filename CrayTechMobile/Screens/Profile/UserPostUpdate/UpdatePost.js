import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, View, Image, Alert, TextInput as RNInput } from "react-native";
import { Button, IconButton, ProgressBar, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "react-native-vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Video, ResizeMode } from 'expo-av';
import TextInput from "@/Components/TextInput";
import { ScrollView } from "react-native-gesture-handler";
import imageObjectify, { resolve_old_and_new_medias } from "@/Utils/imageObjectify";
import axios from "axios";
import baseURL from "@/assets/common/baseUrl";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import hideTabBar from "@/Utils/hideTabBar";
import { getPostAPI } from "@/services/postService";
import { useSelector } from "react-redux";

export default function UpdatePost({ navigation, route }) {

    const appTheme = useTheme();
    const { id } = route.params;
    const { token } = useSelector(state => state.auth);
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState(null);
    const [body, setBody] = useState(null);
    const [videos, setVideos] = useState([]);
    const [images, setImages] = useState([]);
    const [poll, setPoll] = useState([{ option: '', id: Date.now() }, { option: '', id: Date.now() + 1 }]);
    const [postType, setPostType] = useState(null);
    const [canGo, setCanGo] = useState(false);
    const [post, setPost] = useState({});
    const [progress, setProgress] = useState(0);

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

    const updatePost = async (formData) => {

        try {

            const { data } = await axios.put(`${baseURL}/post/update/${post._id}`,
                formData,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    },
                    onUploadProgress: (progressEvent) => {
                        const progressPercent = progressEvent.loaded / progressEvent.total;
                        setProgress(progressPercent); // Update progress state
                    }
                }
            )

            console.log(data);
            Alert.alert("", "Post Updated!")

        } catch (err) {
            console.log(err);
        }

    }

    const submit = async () => {
        setIsLoading(true);
        const formData = new FormData();

        const data = {
            videos,
            images,
            title,
            body,
            poll,
            post_type: postType
        }

        if (postType !== 'poll') {
            delete data.poll
        } else {
            data.poll = JSON.stringify(data.poll);
        }

        const [oldVideos, newVideos] = resolve_old_and_new_medias({
            medias: data.videos,
            referenceOldMedias: post.videos
        })

        if (newVideos.length > 0) {
            data.videos = newVideos.map(video => imageObjectify(video))
        } else {
            data.videos = JSON.stringify(oldVideos)
        }

        // *******************

        const [oldImages, newImages] = resolve_old_and_new_medias({
            medias: data.images,
            referenceOldMedias: post.images
        })

        if (newImages.length > 0) {
            data.images = newImages.map(image => imageObjectify(image))
        } else {
            data.images = JSON.stringify(oldImages)
        }

        // if (postType !== 'video') {
        //     delete data.videos
        // }

        // if (postType !== 'image') {
        //     delete data.images
        // }

        Object.entries(data).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                // Append each image file to formData individually
                value.forEach((file, index) => {
                    formData.append(key, file);  // Assuming `image` is a File object
                });
            } else {
                formData.append(key, value);
            }
        })

        await updatePost(formData)
        setIsLoading(false);
    }

    const getPost = async () => {
        setIsLoading(true)
        try {

            const { post, comments, commentsCount } = await getPostAPI({ token, id: id });
            post.post_type = post.videos.length > 0 ? "video" : post.images.length > 0 ? "image" : post.poll.length > 0 ? "poll" : "text"

            if (post.post_type === 'text') {
                setPostType(null)
            } else {
                setPostType(post.post_type)
            }

            if (post.post_type === 'poll') {
                const pollOptions = post.poll.map(option => {
                    return {
                        id: option._id,
                        option: option.option
                    }
                })
                setPoll(pollOptions)
            }

            if (post.post_type === 'image') {
                const images = post.images.map(image => image.url)
                setImages(images);
            }

            if (post.post_type === 'video') {
                const videos = post.videos.map(image => image.url)
                setVideos(videos);
            }

            setTitle(post.title)
            setBody(post.body)

            setPost(post)

            setIsLoading(false)
        } catch (err) {
            setIsLoading(false)
            console.log(err);
        }
    }

    useFocusEffect(
        useCallback(() => {

            hideTabBar(navigation, appTheme);
            getPost();

        }, [])
    )

    return (
        <View style={{ flex: 1, backgroundColor: appTheme.colors.background }}>
            <ProgressBar progress={progress} visible={isLoading} />
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
                    <Button onPress={submit} disabled={!canGo || isLoading} compact mode="contained" style={{ alignSelf: "center" }}>
                        Update
                    </Button>
                </View>
                <ScrollView>
                    <View style={{ padding: 10, gap: 15 }}>
                        <TextInput label="Title" value={title} onChangeText={(value) => setTitle(value)} />

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
                            value={body}
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
                                                value={poll.option}
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
    )
}