import {StatusBar} from 'expo-status-bar';
import {NavigationContainer} from "@react-navigation/native";
import {AuthStack} from "./navigations/AuthStack";
import {AuthProvider} from "./contexts/AuthContext";
import {UserProvider} from "./contexts/UserContext";
import {ChatProvider} from "./contexts/ChatContext";
import {I18nextProvider} from "react-i18next";
import i18n from "./translation/i18n";
import './translation/i18n';
import ColorSchemeProvider from "./contexts/ColorSchemeContext";

export default function App() {
    return (
        <I18nextProvider i18n={i18n}>
            <ColorSchemeProvider>
                <NavigationContainer>
                    <AuthProvider>
                        <UserProvider>
                            <ChatProvider>
                                <AuthStack/>
                            </ChatProvider>
                        </UserProvider>
                    </AuthProvider>
                </NavigationContainer>
            </ColorSchemeProvider>
        </I18nextProvider>
    );
}