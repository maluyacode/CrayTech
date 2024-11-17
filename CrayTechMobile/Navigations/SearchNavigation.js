import SearchMain from '@/Screens/Search/SearchMain';
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator();

export default function SearchNavigation() {
    return (
        <Stack.Navigator
            initialRouteName='SearchMain'
        >

            <Stack.Screen
                options={{
                    headerShown: false
                }}
                name='SearchMain' component={SearchMain}
            />

        </Stack.Navigator>
    )
}