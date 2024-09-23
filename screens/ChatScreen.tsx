import {Alert, Dimensions, FlatList, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, View} from "react-native";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {FontAwesome6} from "@expo/vector-icons";
import styled from "styled-components/native";
import * as Animatable from 'react-native-animatable';
import {useCallback, useEffect, useRef, useState} from "react";
import ChatInput from "../components/ChatInput";
import {
    ChatbotEnum,
    ChatBotMessage,
    ChatBotOptionToChoose,
    OasisChat,
    OasisChatBotDetails,
    OasisMessage
} from "../interfaces/interfaces";
import {useChatContext} from "../contexts/ChatContext";
import {WaitingChatBotsSkeleton} from "../components/WaitingChatBotsSkeleton";
import {UserMessageCard} from "../components/UserMessageCard";
import {ChatbotMessageCard} from "../components/ChatbotMessageCard";
import {ChatbotOptionCard} from "../components/ChatbotOptionCard";
import {loadChatMessagesService} from "../service/apiService";
import {MessagesLoadingSkeleton} from "../components/MessagesLoadingSkeleton";
import MyVibration from "../utils/MyVibration";
import {ImpactFeedbackStyle} from "expo-haptics";
import {CustomKeyboardAvoidingView, CustomSafeAreaView} from "../styles/GlobalStyles";

const {width, height} = Dimensions.get('window');

interface ChatScreenProps {
    chatData: OasisChat;
    changeSelectedChatBots: (selectedChatBots: OasisChatBotDetails[]) => void;
}

export function ChatScreen({chatData, changeSelectedChatBots}: ChatScreenProps) {
    const {chats, sendFirstMessage, saveChatbotMessage, sendMessageToChat} = useChatContext();

    const [waitingChatBots, setWaitingChatBots] = useState<boolean>(false);
    const [loadingMessages, setLoadingMessages] = useState<boolean>(true);

    const [userMessage, setUserMessage] = useState('');

    const [chatInfo, setChatInfo] = useState<OasisChat>(chatData);

    const [renderSwippable, setRenderSwippable] = useState<boolean>(false)
    const [chatBotResponses, setChatBotResponses] = useState<ChatBotOptionToChoose[] | null>(null);

    // const [renderSwippable, setRenderSwippable] = useState<boolean>(true)
    // const [chatBotResponses, setChatBotResponses] = useState<ChatBotOptionToChoose[] | null>([
    //     {
    //         message: {
    //             chatBotEnum: ChatbotEnum.ChatGPT,
    //             message: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lo',
    //         },
    //         isActive: false,
    //     },
    //     {
    //         message: {
    //             chatBotEnum: ChatbotEnum.Gemini,
    //             message: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)....It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lo',
    //         },
    //         isActive: false,
    //     },
    // ]);

    const [chatMessages, setChatMessages] = useState<OasisMessage[]>(chatInfo.messages);

    const messageListRef = useRef<FlatList>(null);
    const optionListRef = useRef<FlatList>(null);
    const navigation = useNavigation();

    useEffect(() => {
        async function init() {
            if (chatInfo.isNewChat) {
                setLoadingMessages(false)
                await handleSendFirstMessageToChat()
            } else {
                if(chatMessages.length === 0) {
                    await handleLoadChatMessages()
                }
            }
        }

        init();
    }, []);

    useFocusEffect(
        useCallback(() => {
            changeSelectedChatBots(chatInfo.chatBots);
        }, [chatInfo.chatBots])
    );


    async function handleSendFirstMessageToChat() {
        const firstMessage = chatData.messages[0].message;
        const selectedChatBots = chatData.chatBots.map(chatbot => chatbot.chatbotEnum)
        if (firstMessage === '') return;
        setWaitingChatBots(true);
        await sendFirstMessage(firstMessage, selectedChatBots)
            .then((responseData: any) => {
                setUserMessage('')
                initializeConversation(responseData)
            })
            .catch((error) => {
                console.log(error)
                Alert.alert('Erro ao enviar mensagem', error.response)
            })
            .finally(() => {
                setWaitingChatBots(false);
            })
    }

    async function initializeConversation(responseData: any) {
        const oasisChat = responseData.oasisChat
        const chatBotMessages = responseData.chatBotMessages
        setChatInfo(oasisChat)
        defineCurrentChatTitle(oasisChat.title)
        saveChatBotResponses(chatBotMessages)
        openChatBotSelection()
        chatInfo.isNewChat = false;
    }

    function defineCurrentChatTitle(title: string) {
        chats.forEach(chat => {
            if(chat.title === title) {
                navigation.setOptions({title: chat.title + " "})
            }
        })
        navigation.setOptions({title: title})
    }

    async function handleLoadChatMessages() {
        await new Promise(resolve => setTimeout(resolve, 500))
        await loadChatMessagesService(chatInfo.id)
            .then((response: any) => {
                setChatMessages(response.data.data)
            })
            .catch((error) => {
                console.log('Erro ao carregar mensagens', error)
            })
            .finally(() => {
                setLoadingMessages(false)
            })
    }

    async function handleSendMessageToChat() {
        if (userMessage == '') return
        const formattedMessage: OasisMessage = {
            chatBotEnum: ChatbotEnum.User,
            message: userMessage,
            oasisChatId: chatInfo.id,
            isSaved: true,
        }
        Keyboard.dismiss()
        setUserMessage('')
        setChatMessages([formattedMessage, ...chatMessages])
        scrollToStart()
        setWaitingChatBots(true)
        await sendMessageToChat(chatInfo.id, userMessage)
            .then((responseData: any) => {
                setChatBotResponses(responseData)
                openChatBotSelection()
            })
            .catch((error) => {
                console.log(error)
                Alert.alert('Erro ao enviar mensagem')
            })
            .finally(() => {
                setWaitingChatBots(false)
            })
    }

    async function handleSaveChatbotMessage() {
        const selectedOptions = chatBotResponses?.filter(option => option.isActive)
        if (!selectedOptions || selectedOptions.length !== 1) return
        MyVibration.vibrateDevice(ImpactFeedbackStyle.Light)
        const formattedMessage: OasisMessage = {
            message: selectedOptions[0].message.message,
            chatBotEnum: selectedOptions[0].message.chatBotEnum,
            isSaved: true,
            oasisChatId: chatInfo.id
        }
        await saveChatbotMessage(formattedMessage)
            .then(async () => {
                await setChatMessages([formattedMessage, ...chatMessages])
                closeChatBotSelection()
            })
            .catch((e) => {
                Alert.alert('Erro ao salvar mensagem', e.response)
            })
    }

    function scrollToStart() {
        messageListRef.current?.scrollToOffset({offset: 0, animated: true})
    }

    function saveChatBotResponses(chatBotMessages: ChatBotMessage[]) {
        setChatBotResponses(chatBotMessages.map((message: ChatBotMessage) => {
            return {message, isActive: false}
        }))
    }

    function openChatBotSelection(){
        setRenderSwippable(true)
    }

    function closeChatBotSelection() {
        setRenderSwippable(false)
        setChatBotResponses(null)
    }

    function toggleChatBotOption(option: ChatBotOptionToChoose) {
        if(!chatBotResponses) return;
        const updatedOptions = chatBotResponses.map((response) => {
            return {
                ...response,
                isActive: response.message.chatBotEnum === option.message.chatBotEnum
            }
        })
        setChatBotResponses(updatedOptions)

    }

    function renderMessage({item}: { item: OasisMessage }) {
        const isChatbotSavedMessage = item.chatBotEnum !== ChatbotEnum.User
        const isUserMessage = !isChatbotSavedMessage
        if (isUserMessage) return <UserMessageCard oasisMessage={item}/>
        if (isChatbotSavedMessage) return <ChatbotMessageCard oasisMessage={item}/>
        return <></>
    }

    function renderBottomContent() {
        const isAnyChatBotActive = chatBotResponses?.some(option => option.isActive)
        const showChooseMessage = !isAnyChatBotActive && chatBotResponses
        const showSaveMessage = isAnyChatBotActive && chatBotResponses

        if (showChooseMessage) {
            return (
                // @ts-ignore
                <BottomContent style={{width: 'unset', gap: 10}}>
                    <ChooseText>Choose a message</ChooseText>
                    <FontAwesome6 name={'circle-up'} size={30} color={'#fff'}/>
                </BottomContent>
            )
        }
        if (showSaveMessage) {
            return (
                <Animatable.View animation={'fadeIn'} duration={1000}>
                    <BottomContent style={{paddingHorizontal: 12}}>
                        <SaveButton onPress={handleSaveChatbotMessage}>
                            <SaveText>Save Message</SaveText>
                        </SaveButton>
                        <CancelButton onPress={closeChatBotSelection}>
                            <SaveText style={{color: '#fff'}}>Cancel</SaveText>
                        </CancelButton>
                    </BottomContent>
                </Animatable.View>
            )
        }
        return (
            <BottomContent>
                <ChatInput
                    message={userMessage}
                    setMessage={(text) => {
                        if (text === '\n') {
                            Keyboard.dismiss();
                            return;
                        }
                        setUserMessage(text);
                    }}
                    onPress={handleSendMessageToChat}
                    isLoading={waitingChatBots}
                />
            </BottomContent>
        )
    }

    return (
        <CustomSafeAreaView>
            <CustomKeyboardAvoidingView>
                    {loadingMessages ? (
                        <View style={{height: '100%', width: '100%', justifyContent: 'flex-end'}}>
                            <MessagesLoadingSkeleton/>
                        </View>
                    ) : (
                        <Animatable.View animation={'fadeIn'} style={{flex: 1}}>
                            <FlatList
                                data={chatMessages}
                                renderItem={renderMessage}
                                keyExtractor={(item, index) => index.toString()}
                                inverted={true}
                                style={{
                                    marginBottom: 8,
                                }}
                                ref={messageListRef}
                                ListHeaderComponent={
                                    <>
                                        {renderSwippable && !waitingChatBots && (
                                            //Lista para renderizar as opções de mensagens dos chatbots
                                            <FlatList
                                                horizontal
                                                ref={optionListRef}
                                                style={{
                                                    paddingLeft: 5,
                                                    paddingBottom: 15,
                                                    marginTop: 12,
                                                }}
                                                contentContainerStyle={{alignItems: 'flex-start'}}
                                                data={chatBotResponses}
                                                keyExtractor={(item, index) => index.toString()}
                                                renderItem={({item}) => (
                                                    <Animatable.View animation={'fadeInUp'} duration={1000}>
                                                        <ChatbotOptionCard
                                                            chatBotOption={item}
                                                            toggle={() => toggleChatBotOption(item)}
                                                        />
                                                    </Animatable.View>
                                                )}
                                                snapToInterval={width}
                                                decelerationRate={'fast'}
                                                showsHorizontalScrollIndicator={false}
                                            />
                                        )}
                                        {waitingChatBots && <WaitingChatBotsSkeleton/>}
                                    </>
                                }
                            />
                        </Animatable.View>
                    )}

                {renderBottomContent()}
            </CustomKeyboardAvoidingView>
        </CustomSafeAreaView>
    );
}

const ChooseText = styled.Text`
    font-size: 20px;
    font-weight: 500;
    color: white;
`

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
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    padding: 10px;
    width: 60%;
`

const CancelButton = styled.TouchableOpacity`
    border: white;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    padding: 10px;
    width: 35%;
`

const SaveText = styled.Text`
    font-size: 16px;
    font-weight: bold;
    color: black;
`

const FlexOneContainer = styled.View`
    flex: 1;
`