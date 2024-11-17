import { createStackNavigator } from '@react-navigation/stack'

import HomeScreen from '@/Screens/HomeScreen';
import TopicNavigation from './TopicNavigation';

const Stack = createStackNavigator();


export default function HomeNavagations() {

    const Topics = TopicNavigation();

    return (
        <Stack.Navigator
            initialRouteName='HomeScreen'
        >

            <Stack.Screen
                options={{
                    headerShown: false
                }}
                name='HomeScreen' component={HomeScreen}
            />

            {Topics}


        </Stack.Navigator>
    )
}