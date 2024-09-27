import {useState} from "react";
import {createDrawerNavigator} from "@react-navigation/drawer";
import {Provider as PaperProvider} from "react-native-paper";
import {ChatScreen} from "../screens/ChatScreen";
import {ChatBotSelector} from "../components/ChatBotSelector";
import CustomDrawerContent from "./CustomDrawerContent";
import {useChatContext} from "../contexts/ChatContext";
import {NewChatScreen} from "../screens/NewChatScreen";
import {Image, Keyboard, TouchableOpacity} from "react-native";

import {ChatbotEnum, OasisChatBotDetails} from "../interfaces/interfaces";
import {updateChatBotDetailsService} from "../service/apiService";
import {DrawerActions, useNavigation} from "@react-navigation/native";

import menu from "../assets/menu_icon.png";
import MyVibration from "../utils/MyVibration";
import {ImpactFeedbackStyle} from "expo-haptics";
import {useColorSchemeContext} from "../contexts/ColorSchemeContext";

const Drawer = createDrawerNavigator();

export function CustomDrawer() {
    const navigation = useNavigation();
    const {chats, focusedScreen, setChats} = useChatContext();
    const {colorScheme} = useColorSchemeContext();

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
                <Drawer.Navigator
                    drawerContent={(props) => <CustomDrawerContent {...props} />}
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: colorScheme.primaryBackground,
                            borderBottomWidth: 0,
                            elevation: 0,
                            shadowOpacity: 0,
                        },
                        drawerStyle: {
                            backgroundColor: colorScheme.primaryBackground,
                            width: 300
                        },
                        headerTintColor: colorScheme.primaryText,
                        overlayColor: "rgba(123, 123, 123, 0.2)",
                        headerLeft: () => (
                            <TouchableOpacity
                                onPress={() => {
                                    Keyboard.dismiss();
                                    navigation.dispatch(DrawerActions.openDrawer());
                                    MyVibration.vibrateDevice(ImpactFeedbackStyle.Medium);
                                }}
                            >
                                <Image
                                    source={menu}
                                    tintColor={colorScheme.primaryText}
                                    style={{width: 25, height: 25, marginLeft: 10}}
                                />
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
                        options={{

                        }}
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