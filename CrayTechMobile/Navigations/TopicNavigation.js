import { createStackNavigator } from '@react-navigation/stack';
import PostCreate from '@/Screens/Post/PostCreate';
import SelectCommunity from '@/Screens/Post/PostCreateScreens/SelectCommunity';

const Stack = createStackNavigator();

export default function TopicNavigation() {
    return [
        <Stack.Screen
            name='PostCreate'
            component={PostCreate}
            options={{
                headerShown: false,
            }}
        />,
        <Stack.Screen
            name='SelectCommunity'
            component={SelectCommunity}
            options={{
                headerShown: false,
            }}
        />
    ]
}
