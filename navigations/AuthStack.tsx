import {CardStyleInterpolators, createStackNavigator} from '@react-navigation/stack';
import {LoginScreen} from "../screens/LoginScreen";
import {useAuthContext} from "../contexts/AuthContext";
import {SplashScreen} from "../screens/SplashScreen";
import {MyDrawer} from "./MyDrawer";
import SettingsScreen from "../screens/SettingsScreen";
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
                        //cor de fundo da transicao é preta
                        options={{
                            cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
                        }}
                    />
                    <Stack.Screen
                        name={'Settings'}
                        component={SettingsScreen}
                        options={{
                            cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
                            gestureEnabled: true,
                            gestureDirection: 'vertical',
                            headerShown: true,
                            headerStyle: {
                                backgroundColor: '#212121',
                            },
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
                        component={LoginScreen}
                        options={{
                            headerShown: false,
                            cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
                        }}
                    />
                </>
            )}
        </Stack.Navigator>
    );
}