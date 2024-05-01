import {CardStyleInterpolators, createStackNavigator} from '@react-navigation/stack';
import {Login} from "../screens/Login";
import {useAuthContext} from "../contexts/AuthContext";
import {SplashScreen} from "../screens/SplashScreen";
import {MyDrawer} from "./MyDrawer";
import Settings from "../screens/Settings";
import {TouchableOpacity, View} from "react-native";
import {FontAwesome6} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";

const Stack = createStackNavigator();

export function AuthStack() {
    const {isAuthenticated, isLoading} = useAuthContext()
    const navigation = useNavigation()

    if (isLoading) {
        return <SplashScreen/>
    }

    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
            gestureEnabled: true,
        }}>
            {isAuthenticated ? (
                <>
                    <Stack.Screen
                        name={'MyDrawer'}
                        component={MyDrawer}
                        options={{
                            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                        }}
                    />
                    <Stack.Screen
                        name={'Settings'}
                        component={Settings}
                        options={{
                            cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
                            gestureEnabled: true,
                            gestureDirection: 'vertical',
                            headerShown: true,
                            headerStyle: {
                                backgroundColor: '#212121',
                            },
                            headerTransparent: true,
                            headerBackTitleVisible: false,
                            headerLeft: () => <View/>,
                            headerTintColor: '#fff',
                            headerRight: () => (
                                <TouchableOpacity onPress={navigation.goBack} style={{marginRight: 20}}>
                                    <FontAwesome6 name={'x'} size={20} color={'#fff'}/>
                                </TouchableOpacity>
                            )
                        }}

                    />
                </>
            ) : (
                <>
                    <Stack.Screen
                        name={'Login'}
                        component={Login}
                        options={{
                            headerShown: false,
                            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                        }}
                    />
                </>
            )}
        </Stack.Navigator>
    );
}