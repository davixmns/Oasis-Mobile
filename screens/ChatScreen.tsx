import {
    Keyboard, KeyboardAvoidingView, Platform,
    SafeAreaView, FlatList, Dimensions, Alert, ActivityIndicator, Text
} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {FontAwesome6} from "@expo/vector-icons";
import styled from "styled-components/native";
import * as Animatable from 'react-native-animatable';
import {useState, useRef, useEffect} from "react";
import ChatInput from "../components/ChatInput";
import {ChatbotEnum, OasisChat, OasisMessage} from "../interfaces/interfaces";
import {useChatContext} from "../contexts/ChatContext";
import {MessageSkeleton} from "../components/MessageSkeleton";
import {UserMessageCard} from "../components/UserMessageCard";
import {ChatbotMessageCard} from "../components/ChatbotMessageCard";
import {ChatbotOptionCard} from "../components/ChatbotOptionCard";
import {lowVibration, mediumVibration} from "../utils/utils";
import {loadChatMessagesService} from "../service/apiService";

const width = Dimensions.get('window').width;

export function ChatScreen({chatData}: { chatData: OasisChat }) {
    const {chats, sendFirstMessage, saveChatbotMessage, sendMessageToChat, setCurrentChatId} = useChatContext();

    const [waitingChatBots, setWaitingChatBots] = useState<boolean>(false);
    const [loadingMessages, setLoadingMessages] = useState<boolean>(true);

    const [userMessage, setUserMessage] = useState('');

    const [chatInfo, setChatInfo] = useState<OasisChat>(chatData);
    const [chatMessages, setChatMessages] = useState<OasisMessage[]>(chatInfo.messages);

    const [actualChatGptResponse, setActualChatGptResponse] = useState<OasisMessage | null>(null)
    const [actualGeminiResponse, setActualGeminiResponse] = useState<OasisMessage | null>(null)
    const [renderSwippable, setRenderSwippable] = useState<boolean>(false)

    const [gptOptionIsActive, setGptOptionIsActive] = useState<boolean>(false)
    const [geminiOptionIsActive, setGeminiOptionIsActive] = useState<boolean>(false)

    const messageListRef = useRef<FlatList>(null);
    const optionListRef = useRef<FlatList>(null);
    const navigation = useNavigation();

    useEffect(() => {
        async function init() {
            setCurrentChatId(chatInfo.id)
            if (chatInfo.isNewChat) {
                await handleSendFirstMessageToChat()
            } else {
                await handleLoadChatMessages()
            }
        }

        init();
    }, [chatInfo]);


    async function handleSendFirstMessageToChat() {
        const firstMessage = chatData.messages[0].message;
        if (firstMessage === '') return;
        setWaitingChatBots(true);
        await sendFirstMessage(firstMessage)
            .then((responseData: any) => {
                setChatInfo(responseData.chat)
                const formattedTitle = `${chats.length}. ${responseData.chat.title}`
                navigation.setOptions({title: formattedTitle})
                setActualChatGptResponse(responseData?.chatbotMessages[0])
                setActualGeminiResponse(responseData?.chatbotMessages[1])
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
                setActualChatGptResponse(responseData[0])
                setActualGeminiResponse(responseData[1])
                setRenderSwippable(true)
                setUserMessage('')
            })
            .catch((error) => {
                Alert.alert('Erro ao enviar mensagem')
            })
            .finally(() => {
                setWaitingChatBots(false)
            })
    }

    async function handleSaveChatbotMessage() {
        const selectedMessage = gptOptionIsActive ? actualChatGptResponse : actualGeminiResponse
        if (!selectedMessage) return;
        mediumVibration()
        const formattedMessage: OasisMessage = {
            ...selectedMessage,
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
        const showChooseMessage = !waitingChatBots && !gptOptionIsActive && !geminiOptionIsActive && renderSwippable
        const showSaveMessage = !waitingChatBots && (gptOptionIsActive || geminiOptionIsActive)

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
        setGptOptionIsActive(false)
        setGeminiOptionIsActive(false)
        setActualChatGptResponse(null)
        setActualGeminiResponse(null)
    }

    async function toggleChatGpt() {
        if (!gptOptionIsActive) {
            lowVibration()
            setGptOptionIsActive(true);
            setGeminiOptionIsActive(false);
        }
    }

    async function toggleGemini() {
        if (!geminiOptionIsActive) {
            lowVibration()
            setGeminiOptionIsActive(true);
            setGptOptionIsActive(false);
        }
    }

    return (
        <CustomSafeAreaView>
            {loadingMessages ? (
                <>
                    <LoadingMessages/>
                    <Text style={{color: '#fff'}}>Loading Messages</Text>
                </>
            ) : (
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{flex: 1}}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
                >
                    <FlatList
                        data={chatMessages}
                        renderItem={renderMessage}
                        keyExtractor={(item, index) => index.toString()}
                        inverted={true}
                        style={{
                            marginBottom: 8,
                            // backgroundColor: 'blue'
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
                                            // backgroundColor: 'red'
                                        }}
                                        contentContainerStyle={{alignItems: 'flex-start'}}
                                        data={[actualChatGptResponse, actualGeminiResponse].filter(Boolean)}
                                        keyExtractor={(item) => item!.from.toString()}
                                        renderItem={({item}) => (
                                            <Animatable.View animation={'fadeInUp'} duration={1000}>
                                                <ChatbotOptionCard
                                                    oasisMessage={item}
                                                    toggle={() => item.from === 'ChatGPT' ? toggleChatGpt() : toggleGemini()}
                                                    isActive={item.from === 'ChatGPT' ? gptOptionIsActive : geminiOptionIsActive}
                                                />
                                            </Animatable.View>
                                        )}
                                        snapToInterval={width}
                                        decelerationRate={'fast'}
                                        showsHorizontalScrollIndicator={false}
                                    />
                                )}
                                {waitingChatBots && <MessageSkeleton/>}
                            </>
                        }
                    />
                    {renderBottomContent()}
                </KeyboardAvoidingView>
            )}
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
    //width: 95%;
`

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

const LoadingMessages = styled(ActivityIndicator).attrs({
    size: 'large',
    color: '#fff'
})`
`

