import {useState, useEffect, useRef, useCallback, useMemo} from "react";
import {FlatList, Keyboard, View, Alert, Dimensions} from "react-native";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {FontAwesome6} from "@expo/vector-icons";
import styled from "styled-components/native";
import * as Animatable from "react-native-animatable";
import ChatInput from "../components/ChatInput";
import {
    ChatbotEnum,
    ChatBotMessage,
    ChatBotOptionToChoose,
    OasisChat,
    OasisChatBotDetails,
    OasisMessage,
} from "../interfaces/interfaces";
import {useChatContext} from "../contexts/ChatContext";
import {WaitingChatBotsSkeleton} from "../components/WaitingChatBotsSkeleton";
import {UserMessageCard} from "../components/UserMessageCard";
import {ChatbotMessageCard} from "../components/ChatbotMessageCard";
import {loadChatMessagesService} from "../service/apiService";
import {MessagesLoadingSkeleton} from "../components/MessagesLoadingSkeleton";
import MyVibration from "../utils/MyVibration";
import {ImpactFeedbackStyle} from "expo-haptics";
import {
    CustomKeyboardAvoidingView,
    CustomSafeAreaView,
} from "../styles/GlobalStyles";
import {useTranslation} from "react-i18next";
import {ChatBotOptionCard} from "../components/ChatBotOptionCard";

const {width} = Dimensions.get("window");

interface ChatScreenProps {
    chatData: OasisChat;
    modifySelectedChatBots: (selectedChatBots: OasisChatBotDetails[]) => void;
}

export function ChatScreen({chatData, modifySelectedChatBots}: ChatScreenProps) {
    const {
        setFocusedScreen, startConversationWithChatBots, saveChatbotMessage,
        sendMessageToChat, setChats
    } = useChatContext();
    const {t} = useTranslation();
    const [waitingChatBots, setWaitingChatBots] = useState<boolean>(false);
    const [fetchingMessages, setFetchingMessages] = useState<boolean>(true);
    const [userMessage, setUserMessage] = useState("");
    const [currentChataData, setCurrentChataData] = useState<OasisChat>(chatData);
    const [renderSwippable, setRenderSwippable] = useState<boolean>(false);
    const [chatBotResponses, setChatBotResponses] = useState<ChatBotOptionToChoose[] | null>(null);
    // const [renderSwippable, setRenderSwippable] = useState<boolean>(true);
    // const [chatBotResponses, setChatBotResponses] = useState<ChatBotOptionToChoose[] | null>([
    //     {
    //         message: {
    //             chatBotEnum: ChatbotEnum.ChatGPT,
    //             message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    //         },
    //         isActive: false,
    //     },
    //     {
    //         message: {
    //             chatBotEnum: ChatbotEnum.Gemini,
    //             message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    //         },
    //         isActive: false,
    //     },
    // ]);
    const [messages, setMessages] = useState<OasisMessage[]>(currentChataData.messages);
    const navigation = useNavigation();
    const messageListRef = useRef<FlatList>(null);

    useEffect(() => {
        async function init() {
            setFocusedScreen("ChatScreen");
            if (currentChataData.isNewChat) {
                setFetchingMessages(false)
                //Envia a mensagem inicial para os chatbots
                await handleStartConversationWithChatBots();
            } else {
                if (messages.length === 0) {
                    await handleLoadChatMessages();
                }
            }
        }

        init()
    }, []);

    useFocusEffect(
        useCallback(() => {
            modifySelectedChatBots(currentChataData.chatBots);
        }, [currentChataData.chatBots])
    );

    async function handleStartConversationWithChatBots() {
        const firstUserMessage = chatData.messages[0].message;
        setWaitingChatBots(true);
        await startConversationWithChatBots(firstUserMessage)
            .then((responseData: any) => {
                initializeConversation(responseData);
            })
            .catch((error) => {
                console.log(error);
                Alert.alert("Erro ao enviar mensagem", error.response);
            })
            .finally(() => {
                setWaitingChatBots(false);
            });
    }

    async function initializeConversation(responseData: any) {
        const oasisChat = responseData.oasisChat;
        const chatBotMessages = responseData.chatBotMessages;
        setCurrentChataData(oasisChat);
        updateChatTitle(oasisChat.title);
        openChatBotsSwippable(chatBotMessages);
        currentChataData.isNewChat = false;
    }

    async function handleLoadChatMessages() {
        await new Promise((resolve) => setTimeout(resolve, 400));
        setFetchingMessages(true);
        await loadChatMessagesService(currentChataData.id)
            .then((response: any) => {
                setMessages(response.data.data);
            })
            .catch((error) => {
                console.log("Erro ao carregar mensagens", error);
            })
            .finally(() => {
                setFetchingMessages(false);
            });
    }

    function updateChatTitle(title: string) {
        navigation.setOptions({title: title});
        //@ts-ignore
        setChats((prevChats) =>
            prevChats.map((chat: OasisChat) =>
                chat.id === currentChataData.id ? {...chat, title} : chat
            )
        );
    }

    function updateChatUpdatedAt() {
        //@ts-ignore
        setChats((prevChats: OasisChat[]) => {
            return prevChats.map((chat: OasisChat) => {
                return chat.id === currentChataData.id
                    ? {...chat, updatedAt: new Date().toUTCString()}
                    : chat;
            });
        });
    }

    async function handleSendMessageToChat() {
        const formattedMessage: OasisMessage = {
            chatBotEnum: ChatbotEnum.User,
            message: userMessage,
            oasisChatId: currentChataData.id,
            isSaved: true,
        };

        setMessages([formattedMessage, ...messages]);

        setWaitingChatBots(true);
        await sendMessageToChat(currentChataData.id, userMessage)
            .then((responseData: any) => {
                updateChatUpdatedAt();
                openChatBotsSwippable(responseData);
            })
            .catch((error) => {
                console.log(error);
                Alert.alert("Erro ao enviar mensagem");
            })
            .finally(() => {
                setWaitingChatBots(false);
            });
    }

    async function handleSaveChatbotMessage() {
        const selectedOptions = chatBotResponses?.filter((option) => option.isActive);
        if (!selectedOptions || selectedOptions.length !== 1) return;
        MyVibration.vibrateDevice(ImpactFeedbackStyle.Light);
        const formattedMessage: OasisMessage = {
            message: selectedOptions[0].message.message,
            chatBotEnum: selectedOptions[0].message.chatBotEnum,
            isSaved: true,
            oasisChatId: currentChataData.id,
        };
        await saveChatbotMessage(formattedMessage)
            .then(() => {
                setMessages([formattedMessage, ...messages]);
                closeChatBotsSwippable();
            })
            .catch((e) => {
                Alert.alert("Erro ao salvar mensagem", e.response);
            });
    }

    function openChatBotsSwippable(chatBotMessages: ChatBotMessage[]) {
        setChatBotResponses(
            chatBotMessages.map((message: ChatBotMessage) => {
                return {message, isActive: false};
            })
        );
        setRenderSwippable(true);
    }

    function closeChatBotsSwippable() {
        setRenderSwippable(false);
        setChatBotResponses(null);
    }

    function toggleChatBotOption(option: ChatBotOptionToChoose) {
        if (!chatBotResponses) return;
        const updatedOptions = chatBotResponses.map((response) => {
            return {
                ...response,
                isActive: response.message.chatBotEnum === option.message.chatBotEnum,
            };
        });
        setChatBotResponses(updatedOptions);
    }

    const renderMessage = useCallback(({item}: { item: OasisMessage }) => {
        if (item.chatBotEnum === ChatbotEnum.User) {
            return <UserMessageCard oasisMessage={item}/>;
        } else {
            return <ChatbotMessageCard oasisMessage={item}/>;
        }
    }, []);

    const renderBottomContent = useMemo(() => {
        const isAnyChatBotActive = chatBotResponses?.some((option) => option.isActive);
        const showChooseMessage = !isAnyChatBotActive && chatBotResponses;
        const showSaveMessage = isAnyChatBotActive && chatBotResponses;

        if (showChooseMessage) {
            return (
                //@ts-ignore
                <BottomContent style={{width: "unset", gap: 10}}>
                    <ChooseText>{t('choose_message')}</ChooseText>
                    {/*<Icon name={"circle-up"} size={30}/>*/}
                </BottomContent>
            );
        }
        if (showSaveMessage) {
            return (
                <Animatable.View animation={"fadeIn"} duration={1000}>
                    <BottomContent style={{paddingHorizontal: 10}}>
                        <SaveButton onPress={handleSaveChatbotMessage}>
                            <SaveText>{t('save_message')}</SaveText>
                        </SaveButton>
                        <CancelButton onPress={closeChatBotsSwippable}>
                            <CancelText>{t('cancel')}</CancelText>
                        </CancelButton>
                    </BottomContent>
                </Animatable.View>
            );
        }
        return (
            <BottomContent>
                <ChatInput
                    message={userMessage}
                    setMessage={(text) => {
                        if (text === "\n") {
                            Keyboard.dismiss();
                            return;
                        }
                        setUserMessage(text);
                    }}
                    onPress={() => {
                        if (userMessage === "") return;
                        setUserMessage("")
                        Keyboard.dismiss();
                        messageListRef.current?.scrollToOffset({offset: 0, animated: true});
                        handleSendMessageToChat();
                    }}
                    isLoading={waitingChatBots}
                />
            </BottomContent>
        );
    }, [chatBotResponses, userMessage, waitingChatBots])

    return (
        <CustomSafeAreaView>
            <CustomKeyboardAvoidingView>
                {fetchingMessages ? (
                    <View style={{flex: 1, justifyContent: "flex-end"}}>
                        <MessagesLoadingSkeleton/>
                    </View>
                ) : (
                    <Animatable.View animation={"fadeIn"} style={{flex: 1}}>
                        <FlatList
                            data={messages}
                            renderItem={renderMessage}
                            keyExtractor={(item, index) => index.toString()}
                            inverted={true}
                            style={{marginBottom: 8}}
                            showsVerticalScrollIndicator={true}
                            ref={messageListRef}
                            ListHeaderComponent={
                                <>
                                    {renderSwippable && !waitingChatBots && (
                                        //Lista para renderizar as opções de mensagens dos chatbots
                                        <FlatList
                                            horizontal
                                            style={{
                                                paddingLeft: 8,
                                                paddingBottom: 15,
                                                marginTop: 12,
                                            }}
                                            contentContainerStyle={{alignItems: "flex-start"}}
                                            data={chatBotResponses}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({item}) => (
                                                <Animatable.View animation={"slideInLeft"} duration={1000}>
                                                    <ChatBotOptionCard
                                                        chatBotOption={item}
                                                        toggle={() => toggleChatBotOption(item)}
                                                    />
                                                </Animatable.View>
                                            )}
                                            showsHorizontalScrollIndicator={false}
                                            ListFooterComponent={<View style={{width: 10}}/>}
                                            snapToInterval={width * 0.85 + 12} // Largura do item + margem
                                            decelerationRate={"fast"}
                                            snapToAlignment={"start"}
                                        />
                                    )}
                                    {waitingChatBots && <WaitingChatBotsSkeleton/>}
                                </>
                            }
                        />
                    </Animatable.View>
                )}

                {renderBottomContent}
            </CustomKeyboardAvoidingView>
        </CustomSafeAreaView>
    );
}

const Icon = styled(FontAwesome6)`
    color: ${(props) => props.theme.primaryText};
`

const ChooseText = styled.Text`
    font-size: 20px;
    font-weight: 500;
    color: ${(props) => props.theme.primaryText};
`;

const BottomContent = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    margin-bottom: 5px;
    gap: 10px;
    align-self: center;
`;

const SaveButton = styled.TouchableOpacity`
    background-color: ${(props) => props.theme.primaryText};
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    padding: 10px;
    width: 60%;
`;

const CancelButton = styled.TouchableOpacity`
    border: 2px solid ${(props) => props.theme.primaryText};
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    padding: 10px;
    width: 35%;
`;

const SaveText = styled.Text`
    font-size: 16px;
    font-weight: bold;
    color: ${(props) => props.theme.primaryBackground};
`;

const CancelText = styled.Text`
    font-size: 16px;
    font-weight: bold;
    color: ${(props) => props.theme.primaryText};
`;
