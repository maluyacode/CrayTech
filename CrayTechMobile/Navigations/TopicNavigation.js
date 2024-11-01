import { createStackNavigator } from '@react-navigation/stack';
import PostCreate from '@/Screens/Post/PostCreate';
import SelectCommunity from '@/Screens/Post/PostCreateScreens/SelectCommunity';
import PostDetails from '@/Screens/Post/PostDetails';

const Stack = createStackNavigator();

export default function TopicNavigation() {
    return [
        <Stack.Screen
            key={Date.now() - 1}
            name='PostCreate'
            component={PostCreate}
            options={{
                headerShown: false,
            }}
        />,
        <Stack.Screen
            key={Date.now() - 2}
            name='SelectCommunity'
            component={SelectCommunity}
            options={{
                headerShown: false,
            }}
        />,
        <Stack.Screen
            key={Date.now() - 3}
            name='PostDetails'
            component={PostDetails}
            options={{
                headerShown: false,
            }}
        />,
    ]
}
