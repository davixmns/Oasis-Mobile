import {NavigationContainer} from "@react-navigation/native";
import {AuthStack} from "./navigations/AuthStack";
import {AuthProvider} from "./contexts/AuthContext";
import {UserProvider} from "./contexts/UserContext";
import {ChatProvider} from "./contexts/ChatContext";
import {I18nextProvider} from "react-i18next";
import i18n from "./translation/i18n";
import './translation/i18n';
import OasisThemeProvider from "./contexts/OasisThemeContext";

export default function App() {

    return (
        <I18nextProvider i18n={i18n}>
            <OasisThemeProvider>
                <NavigationContainer>
                    <AuthProvider>
                        <UserProvider>
                            <ChatProvider>
                                <AuthStack/>
                            </ChatProvider>
                        </UserProvider>
                    </AuthProvider>
                </NavigationContainer>
            </OasisThemeProvider>
        </I18nextProvider>
    );
}