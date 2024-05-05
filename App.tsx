import {StatusBar} from 'expo-status-bar';
import {NavigationContainer} from "@react-navigation/native";
import {AuthStack} from "./navigations/AuthStack";
import {AuthProvider, useAuthContext} from "./contexts/AuthContext";
import {UserProvider} from "./contexts/UserContext";
import {ChatProvider} from "./contexts/ChatContext";

export default function App() {
    return (
        <NavigationContainer>
            <AuthProvider>
                <UserProvider>
                    <ChatProvider>
                        <StatusBar style="auto" backgroundColor={'transparent'}/>
                        <AuthStack/>
                    </ChatProvider>
                </UserProvider>
            </AuthProvider>
        </NavigationContainer>
    );
}