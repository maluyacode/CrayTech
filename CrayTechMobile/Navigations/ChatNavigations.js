import Chat from '@/Screens/Chat';
import ChatLists from '@/Screens/ChatLists';
import SearchChat from '@/Screens/SearchChat';
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator();

export default function ChatNavigations() {
    return (
        <Stack.Navigator
            initialRouteName='ChatLists'
            screenOptions={{
                headerShown: false,
            }}
        >

            <Stack.Screen name='ChatLists' component={ChatLists} />

            <Stack.Screen name='Chat' component={Chat} />

            <Stack.Screen name='SearchChat' component={SearchChat} />

        </Stack.Navigator>
    )
}