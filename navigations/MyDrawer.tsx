import React, {useEffect, useState} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {StatusBar} from 'expo-status-bar';
import {Provider as PaperProvider} from 'react-native-paper';
import {ChatScreen} from '../screens/ChatScreen';
import {ChatBotSelector} from "../components/ChatBotSelector";
import CustomDrawerContent from "../components/CustomDrawerContent";
import {useChatContext} from "../contexts/ChatContext";
import styled from "styled-components/native";
import {NewChatScreen} from "../screens/NewChatScreen";
import {log} from "expo/build/devtools/logger";
import {OasisChat} from "../interfaces/interfaces";

const Drawer = createDrawerNavigator();

export function MyDrawer() {
    const {chats} = useChatContext();
    const [menuVisible, setMenuVisible] = useState(false);

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    return (
        <PaperProvider>
            <>
                <StatusBar style="light" backgroundColor="#000"/>
                <Drawer.Navigator
                    drawerContent={(props) => <CustomDrawerContent {...props} />}
                    // @ts-ignore
                    screenOptions={{
                        ...drawerScreenOptions,
                        headerRight: () => ChatBotSelector(closeMenu, menuVisible, openMenu),
                    }}
                >
                    <Drawer.Screen name="New Chat" component={NewChatScreen}/>
                    {chats.map(chat => (
                        <Drawer.Screen
                            key={chat.oasisChatId}
                            name={chat.oasisChatId.toString()}
                            children={() => <ChatScreen chatData={chat}/>}
                        />
                    ))}
                </Drawer.Navigator>
            </>
        </PaperProvider>
    );
}

export const drawerScreenOptions = {
    headerStyle: {
        backgroundColor: '#000',
    },
    drawerStyle: {
        backgroundColor: '#000',
    },
    headerTintColor: '#fff',
    overlayColor: 'rgba(123, 123, 123, 0.2)',
    drawerActiveBackgroundColor: 'rgba(123, 123, 123, 0.3)',
    drawerInactiveTintColor: '#fff',
    drawerItemStyle: {
        borderRadius: 12,
    },
    drawerLabelStyle: {
        fontWeight: "600",
        fontSize: 16,
    },
};
