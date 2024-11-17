import { initializeApp } from '@react-native-firebase/app';
import { initializeFirestore } from "@react-native-firebase/firestore";
import messaging from '@react-native-firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyBEeJX958etBNMfQK-OGb7LmSlpfQs9qaI",
    authDomain: "samplesignin-16788.firebaseapp.com",
    projectId: "samplesignin-16788",
    storageBucket: "samplesignin-16788.firebasestorage.app",
    messagingSenderId: "684967591561",
    appId: "1:684967591561:web:40b628224602c813aa9058",
    measurementId: "G-YX13VP3BMP"
};

const app = initializeApp(firebaseConfig);

const db = initializeFirestore(app, { experimentalForceLongPolling: true });


export {
    db,
    app,
    messaging
};