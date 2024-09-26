import {CardStyleInterpolators, createStackNavigator} from '@react-navigation/stack';
import {LoginScreen} from "../screens/LoginScreen";
import {useAuthContext} from "../contexts/AuthContext";
import {SplashScreen} from "../screens/SplashScreen";
import {CustomDrawer} from "./CustomDrawer";
import SettingsScreen from "../screens/SettingsScreen";
import {TouchableOpacity, View} from "react-native";
import {FontAwesome6} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import React from "react";
import {useTranslation} from "react-i18next";

const Stack = createStackNavigator();

export function AuthStack() {
    const {isAuthenticated, isLoading} = useAuthContext()
    const navigation = useNavigation()
    const {t} = useTranslation()

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
                        component={CustomDrawer}
                        //cor de fundo da transicao é preta
                        options={{
                            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
                        }}
                    />
                    <Stack.Screen
                        name={'Settings'}
                        component={SettingsScreen}
                        options={{
                            title: t('settings'),
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
                                    <FontAwesome6 name={'angle-down'} size={23} color={'white'}/>
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