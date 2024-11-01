import { Platform } from 'react-native'

let baseURL = '';

{
    Platform.OS == 'android'
        ? baseURL = 'http://192.168.23.100:4000'
        : baseURL = 'http://192.168.23.100:4000'
}

export default baseURL;