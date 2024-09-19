import {Alert, Dimensions, FlatList, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, View} from "react-native";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {FontAwesome6} from "@expo/vector-icons";
import styled from "styled-components/native";
import * as Animatable from 'react-native-animatable';
import {useCallback, useEffect, useRef, useState} from "react";
import ChatInput from "../components/ChatInput";
import {ChatbotEnum, ChatBotOption, OasisChat, OasisChatBotDetails, OasisMessage} from "../interfaces/interfaces";
import {useChatContext} from "../contexts/ChatContext";
import {WaitingChatBotsSkeleton} from "../components/WaitingChatBotsSkeleton";
import {UserMessageCard} from "../components/UserMessageCard";
import {ChatbotMessageCard} from "../components/ChatbotMessageCard";
import {ChatbotOptionCard} from "../components/ChatbotOptionCard";
import {lowVibration, mediumVibration} from "../utils/utils";
import {loadChatMessagesService} from "../service/apiService";
import {MessagesLoadingSkeleton} from "../components/MessagesLoadingSkeleton";

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
    const [chatMessages, setChatMessages] = useState<OasisMessage[]>(chatInfo.messages);

    const [chatBotResponses, setChatBotResponses] = useState<ChatBotOption[]>();

    const [renderSwippable, setRenderSwippable] = useState<boolean>(true)

    const messageListRef = useRef<FlatList>(null);
    const optionListRef = useRef<FlatList>(null);
    const navigation = useNavigation();

    useEffect(() => {
        async function init() {
            if (chatInfo.isNewChat) {
                await handleSendFirstMessageToChat()
            } else {
                await handleLoadChatMessages()
            }
        }

        init();
    }, [chatInfo]);

    useFocusEffect(
        useCallback(() => {
            changeSelectedChatBots(chatInfo.chatBots);
        }, [chatInfo.chatBots])
    );


    async function handleSendFirstMessageToChat() {
        const firstMessage = chatData.messages[0].message;
        if (firstMessage === '') return;
        setWaitingChatBots(true);
        await sendFirstMessage(firstMessage)
            .then((responseData: any) => {
                setChatInfo(responseData.chat)
                const formattedTitle = `${chats.length}. ${responseData.chat.title}`
                navigation.setOptions({title: formattedTitle})
                setChatBotResponses(responseData.chatbotMessages.map((message: OasisMessage) => {
                    return {message, isActive: false}
                }))
                setRenderSwippable(true);
                setUserMessage('')
                chatInfo.isNewChat = false;
            })
            .catch((error) => {
                Alert.alert('Erro ao enviar mensagem', error.response.status)
            })
            .finally(() => {
                setWaitingChatBots(false);
            })
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
            from: ChatbotEnum.User,
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
                setUserMessage('')
                setRenderSwippable(true)
            })
            .catch((error) => {
                Alert.alert('Erro ao enviar mensagem')
            })
            .finally(() => {
                setWaitingChatBots(false)
            })
    }

    async function handleSaveChatbotMessage() {
        const selectedOptions = chatBotResponses?.filter(option => option.isActive)
        if (!selectedOptions || selectedOptions.length !== 1) return
        mediumVibration()
        const formattedMessage: OasisMessage = {
            ...selectedOptions[0].message,
            isSaved: true,
            oasisChatId: chatInfo.id
        }
        await saveChatbotMessage(formattedMessage)
            .then(async () => {
                await setChatMessages([formattedMessage, ...chatMessages])
                closeChatbotSelection()
            })
            .catch((e) => {
                Alert.alert('Erro ao salvar mensagem', e.response)
            })
    }

    function renderMessage({item}: { item: OasisMessage }) {
        const isChatbotSavedMessage = item.from !== ChatbotEnum.User
        const isUserMessage = !isChatbotSavedMessage
        if (isUserMessage) return <UserMessageCard oasisMessage={item}/>
        if (isChatbotSavedMessage) return <ChatbotMessageCard oasisMessage={item}/>
        return <></>
    }

    function renderBottomContent() {
        const showChooseMessage = !waitingChatBots && renderSwippable
        const showSaveMessage = !waitingChatBots

        if (showSaveMessage) {
            return (
                <Animatable.View animation={'fadeIn'} duration={1000}>
                    <BottomContent style={{paddingHorizontal: 12}}>
                        <SaveButton onPress={handleSaveChatbotMessage}>
                            <SaveText>Save Message</SaveText>
                        </SaveButton>
                        <CancelButton onPress={closeChatbotSelection}>
                            <SaveText style={{color: '#fff'}}>Cancel</SaveText>
                        </CancelButton>
                    </BottomContent>
                </Animatable.View>
            )
        }
        if (showChooseMessage) {
            return (
                // @ts-ignore
                <BottomContent style={{width: 'unset', gap: 10}}>
                    <ChooseText>Choose a message</ChooseText>
                    <FontAwesome6 name={'circle-up'} size={30} color={'#fff'}/>
                </BottomContent>
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

    function scrollToStart() {
        messageListRef.current?.scrollToOffset({offset: 0, animated: true})
    }

    function closeChatbotSelection() {
        setRenderSwippable(false)
    }

    return (
        <CustomSafeAreaView>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}
                keyboardVerticalOffset={Platform.OS === 'ios' ? (height < 850 ? 70 : 100) : 0}
            >
                <FlexOneContainer>
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
                                                    paddingBottom: 20,
                                                    marginTop: 12,
                                                }}
                                                contentContainerStyle={{alignItems: 'flex-start'}}
                                                data={chatBotResponses}
                                                keyExtractor={(item) => item!.from.toString()}
                                                renderItem={({item}) => (
                                                    <Animatable.View animation={'fadeInUp'} duration={1000}>
                                                        <ChatbotOptionCard
                                                            oasisMessage={item}
                                                            toggle={() => item.from === ChatbotEnum.ChatGPT ? toggleChatGpt() : toggleGemini()}
                                                            isActive={item.from === ChatbotEnum.ChatGPT ? gptOptionIsActive : geminiOptionIsActive}
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

                </FlexOneContainer>
                {renderBottomContent()}
            </KeyboardAvoidingView>
        </CustomSafeAreaView>
    );
}

const CustomSafeAreaView = styled(SafeAreaView)`
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    background-color: #000;
`

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