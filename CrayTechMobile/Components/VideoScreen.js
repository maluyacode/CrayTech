import { useState, useRef } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

const videoSource =
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

export default function VideoScreen() {
    const video = useRef(null);
    return (
        <Video
            ref={video}
            style={styles.video}
            source={{
                uri: videoSource,
            }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping
        />
    );
}

const styles = StyleSheet.create({
    video: {
        width: 200,
        height: 200,
    },
    controlsContainer: {
        padding: 10,
    },
});
