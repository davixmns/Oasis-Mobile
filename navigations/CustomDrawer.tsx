import {useState} from "react";
import {createDrawerNavigator} from "@react-navigation/drawer";
import {StatusBar} from "expo-status-bar";
import {Provider as PaperProvider} from "react-native-paper";
import {ChatScreen} from "../screens/ChatScreen";
import {ChatBotSelector} from "../components/ChatBotSelector";
import CustomDrawerContent from "./CustomDrawerContent";
import {useChatContext} from "../contexts/ChatContext";
import {NewChatScreen} from "../screens/NewChatScreen";
import {Image, Keyboard, TouchableOpacity} from "react-native";

import OasisIcon from "../assets/oasis_icon.png";
import {ChatbotEnum, OasisChatBotDetails} from "../interfaces/interfaces";
import {updateChatBotDetailsService} from "../service/apiService";
import {DrawerActions, useNavigation} from "@react-navigation/native";

import menu from "../assets/menu_icon.png";
import MyVibration from "../utils/MyVibration";
import {ImpactFeedbackStyle} from "expo-haptics";

const Drawer = createDrawerNavigator();

export function CustomDrawer() {
    const navigation = useNavigation();
    const {chats, focusedScreen, setChats} = useChatContext();

    //Switches que se modificam de acordo com o chat selecionado
    const [selectedChatbots, setSelectedChatbots] = useState([
        {enum: ChatbotEnum.ChatGPT, enabled: true, id: -1},
        {enum: ChatbotEnum.Gemini, enabled: true, id: -1},
    ]);

    //Atualiza o estado dos switches de acordo com os chatbots selecionados da conversa atual
    function modifySelectedChatBots(selecteds: OasisChatBotDetails[]) {
        setSelectedChatbots(
            selecteds.map((chatbot) => {
                return {
                    enum: chatbot.chatbotEnum,
                    enabled: chatbot.isActive,
                    id: chatbot.id,
                };
            })
        );
    }

    //Atualiza os chatbots selecionados na conversa atual
    async function handleUpdateChatBotOption(id: number, isSelected: boolean) {
        setChats(chats.map((chat) => {
            chat.chatBots = chat.chatBots.map((chatbot) => {
                if (chatbot.id === id) {
                    chatbot.isActive = isSelected;
                }
                return chatbot;
            });
            return chat;
        }));
        updateChatBotDetailsService(id, isSelected).catch((error) => {
            console.log("❌ Erro ao atualizar chatbot -> " + error.response);
        });
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
                        headerLeft: () => (
                            <TouchableOpacity
                                onPress={() => {
                                    Keyboard.dismiss();
                                    navigation.dispatch(DrawerActions.openDrawer());
                                    MyVibration.vibrateDevice(ImpactFeedbackStyle.Medium);
                                }}
                            >
                                <Image source={menu} style={{width: 25, height: 25, marginLeft: 10}}/>
                            </TouchableOpacity>
                        ),
                        headerRight: () => (
                            <>
                                {focusedScreen !== "NewChatScreen" && (
                                    <ChatBotSelector
                                        selectedChatbots={selectedChatbots}
                                        updateChatBotOption={handleUpdateChatBotOption}
                                    />
                                )}
                            </>
                        ),
                    }}
                >
                    <Drawer.Screen
                        name="Oasis"
                        component={NewChatScreen}
                        options={newChatScreenOptions}
                    />
                    {chats.map((chat) => (
                        <Drawer.Screen
                            key={chat.id}
                            name={"Chat_" + chat.id}
                            options={{title: chat.title}}
                            children={() => (
                                <ChatScreen
                                    chatData={chat}
                                    modifySelectedChatBots={modifySelectedChatBots}
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
        backgroundColor: "#000",
        borderBottomWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
    },
    drawerStyle: {
        backgroundColor: "#000",
    },
    headerTintColor: "#fff", // Cor do texto e dos ícones do header
    overlayColor: "rgba(123, 123, 123, 0.2)",
    drawerActiveBackgroundColor: "rgba(123, 123, 123, 0.3)",
    drawerInactiveTintColor: "#fff",
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
        borderBottomColor: "rgba(255, 255, 255, 0.3)",
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
    drawerActiveBackgroundColor: "#000",
};
