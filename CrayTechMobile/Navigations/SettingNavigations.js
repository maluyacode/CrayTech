import { createStackNavigator } from '@react-navigation/stack'

import Setting from '@/Screens/Profile/Setting';
import ChangeAvatar from '@/Screens/Profile/ChangeAvatar';
import ChangeUsername from '@/Screens/Profile/ChangeUsername';
import ChangePassword from '@/Screens/Profile/ChangePassword';
import { useTheme } from 'react-native-paper';
import UserPosts from '@/Screens/Profile/UserPosts';
import UpdatePost from '@/Screens/Profile/UserPostUpdate/UpdatePost';

const Stack = createStackNavigator();

export default function SettingNavigations() {

    const appTheme = useTheme();

    return (
        <Stack.Navigator
            initialRouteName='Setting'
        >

            <Stack.Screen
                options={{
                    headerShown: false,
                }}
                name='Setting' component={Setting}
            />

            <Stack.Screen
                options={{
                    headerShown: false,
                }}
                name='ChangeAvatar' component={ChangeAvatar}
            />

            <Stack.Screen
                options={{
                    headerShown: false
                }}
                name='ChangeUsername' component={ChangeUsername}
            />

            <Stack.Screen
                options={{
                    headerShown: false
                }}
                name='ChangePassword' component={ChangePassword}
            />

            <Stack.Screen
                options={{
                    headerShown: false
                }}
                name='UserPosts' component={UserPosts}
            />

            <Stack.Screen
                options={{
                    headerShown: false
                }}
                name='UpdatePost' component={UpdatePost}
            />

        </Stack.Navigator>
    )
}