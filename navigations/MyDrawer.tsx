import {useEffect, useState} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {StatusBar} from 'expo-status-bar';
import {Provider as PaperProvider} from 'react-native-paper';
import {ChatScreen} from '../screens/ChatScreen';
import {ChatBotSelector} from "../components/ChatBotSelector";
import CustomDrawerContent from "../components/CustomDrawerContent";
import {useChatContext} from "../contexts/ChatContext";
import {NewChatScreen} from "../screens/NewChatScreen";
import {Image} from "react-native";
// @ts-ignore
import OasisIcon from '../assets/oasis_icon.png';
import {ChatbotEnum, OasisChatBotDetails} from "../interfaces/interfaces";
import {updateChatBotDetailsService} from "../service/apiService";

const Drawer = createDrawerNavigator();

export function MyDrawer() {
    const {chats, setChats} = useChatContext();

    const [selectedChatbots, setSelectedChatbots] = useState([
        {enum: ChatbotEnum.ChatGPT, enabled: true, id: -1},
        {enum: ChatbotEnum.Gemini, enabled: true, id: -1},
    ]);

    function showChatBotStatus(selecteds: OasisChatBotDetails[]) {
        setSelectedChatbots(selecteds.map(chatbot => {
            return {
                enum: chatbot.chatbotEnum,
                enabled: chatbot.isSelected,
                id: chatbot.id,
            }
        }));
    }

    async function handleUpdateChatBotOption(id: number, isSelected: boolean) {
        setChats(chats.map(chat => {
            chat.chatBots = chat.chatBots.map(chatbot => {
                if (chatbot.id === id) {
                    chatbot.isSelected = isSelected;
                }
                return chatbot;
            });
            return chat;
        }));
        await updateChatBotDetailsService(id, isSelected)
            .catch((error) => {
                console.log('❌ Erro ao atualizar chatbot -> ' + error.response);
            })
    }


    return (
        <PaperProvider>
            <>
                <StatusBar style="light" backgroundColor="#000"/>
                <Drawer.Navigator
                    drawerContent={(props) => <CustomDrawerContent {...props} />}
                    // @ts-ignore
                    screenOptions={{
                        ...drawerScreenOptions,
                        headerRight: () => (
                            <ChatBotSelector
                                selectedChatbots={selectedChatbots}
                                updateChatBotOption={handleUpdateChatBotOption}
                            />
                        ),
                    }}
                >
                    <Drawer.Screen
                        name="Oasis"
                        component={NewChatScreen}
                        options={newChatScreenOptions}
                    />
                    {chats.map(chat => (
                        <Drawer.Screen
                            key={chat.id}
                            name={chat.title!.toString()}
                            children={() => (
                                <ChatScreen
                                    chatData={chat}
                                    changeSelectedChatBots={showChatBotStatus}
                                />
                            )}
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
        borderBottomWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
    },
    drawerStyle: {
        backgroundColor: '#000',
    },
    headerTintColor: '#fff',  // Cor do texto e dos ícones do header
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


export const newChatScreenOptions = {
    drawerItemStyle: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    },
    drawerLabelStyle: {
        fontSize: 20,
    },
    drawerIcon: () => (
        <Image
            source={OasisIcon}
            style={{
                width: 40,
                height: 30,
                marginRight: -25,
            }}
        />
    ),
    drawerActiveBackgroundColor: '#000',
}

