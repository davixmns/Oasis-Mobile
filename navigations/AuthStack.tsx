import {CardStyleInterpolators, createStackNavigator} from '@react-navigation/stack';
import {Login} from "../screens/Login";
import {useAuthContext} from "../contexts/AuthContext";
import {SplashScreen} from "../screens/SplashScreen";
import {MyDrawer} from "./MyDrawer";

const Stack = createStackNavigator();

export function AuthStack() {
    const {isAuthenticated, isLoading} = useAuthContext()

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