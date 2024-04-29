import {StatusBar} from 'expo-status-bar';
import {NavigationContainer} from "@react-navigation/native";
import {AuthStack} from "./navigations/AuthStack";
import {AuthProvider} from "./contexts/AuthContext";
import {UserProvider} from "./contexts/UserContext";

export default function App() {
    return (
        <NavigationContainer>
            <AuthProvider>
                <UserProvider>
                    <StatusBar style="auto" backgroundColor={'transparent'}/>
                </UserProvider>
                <AuthStack/>
            </AuthProvider>
        </NavigationContainer>
    );
}