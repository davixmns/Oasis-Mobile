import {CardStyleInterpolators, createStackNavigator} from '@react-navigation/stack';
import { DrawerApp } from '../screens/DrawerApp';
import {Login} from "../screens/Login";

const Stack = createStackNavigator();

export function AuthStack() {
    const isAuthenticated = false; //futuramente usar context

    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
            gestureEnabled: true,
        }}>
            {isAuthenticated ? (
                <>
                    <Stack.Screen
                        name={'DrawerApp'}
                        component={DrawerApp}
                        options={{
                            headerShown: false,
                            cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter
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