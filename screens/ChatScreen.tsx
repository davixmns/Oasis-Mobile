import {
    Keyboard, KeyboardAvoidingView, Platform, SafeAreaView,
    ActivityIndicator, FlatList, Dimensions, Alert
} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {FontAwesome6} from "@expo/vector-icons";
import styled from "styled-components/native";
import * as Animatable from 'react-native-animatable';
import {useState, useRef, useEffect} from "react";
import ChatInput from "../components/ChatInput";
import {OasisChat, OasisMessage} from "../interfaces/interfaces";
import {useChatContext} from "../contexts/ChatContext";
import {ChatbotSkeleton} from "../components/ChatbotSkeleton";
import {UserMessageCard} from "../components/UserMessageCard";
import {ChatbotMessageCard} from "../components/ChatbotMessageCard";
import {ChatbotOptionCard} from "../components/ChatbotOptionCard";

const width = Dimensions.get('window').width;

export function ChatScreen({chatData}: { chatData: OasisChat }) {
    const {chats, sendFirstMessage, saveChatbotMessage, sendMessageToChat} = useChatContext();
    const [messageIsLoading, setMessageIsLoading] = useState<boolean>(false);
    const [userMessage, setUserMessage] = useState('');
    const [chatInfo, setChatInfo] = useState<OasisChat>(chatData);
    const [chatMessages, setChatMessages] = useState<OasisMessage[]>(chatData.messages);
    const [actualChatGptResponse, setActualChatGptResponse] = useState<OasisMessage | null>(null)
    const [actualGeminiResponse, setActualGeminiResponse] = useState<OasisMessage | null>(null)
    const [renderSwippable, setRenderSwippable] = useState<boolean>(false)
    const [gptOptionIsActive, setGptOptionIsActive] = useState<boolean>(false)
    const [geminiOptionIsActive, setGeminiOptionIsActive] = useState<boolean>(false)
    const messageListRef = useRef<FlatList>(null);
    const navigation = useNavigation();

    useEffect(() => {
        async function init() {
            if (chatInfo.isNewChat) {
                await handleSendFirstMessage()
            }
            await scrollToBottom(false);
        }

        init();
    }, [chatInfo]);


    async function handleSendFirstMessage() {
        const firstMessage = chatData.messages[0].message;
        if (firstMessage === '') return;
        setMessageIsLoading(true);
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
                setMessageIsLoading(false);
            })
    }

    async function handleSendMessageToChat() {
        if (userMessage == '') return
        setMessageIsLoading(true)

        const formattedMessage: OasisMessage = {
            from: 'User',
            message: userMessage,
            oasisChatId: chatInfo.oasisChatId,
            isSaved: true,
            createdAt: new Date().toISOString()
        }

        setChatMessages([...chatMessages, formattedMessage])

        await sendMessageToChat(chatInfo.oasisChatId, [0, 1], userMessage)
            .then((responseData: any) => {
                const gptMessage: OasisMessage = responseData[0]
                const geminiMessage: OasisMessage = responseData[1]

                setActualChatGptResponse(gptMessage)
                setActualGeminiResponse(geminiMessage)

                setRenderSwippable(true)

                setUserMessage('')
            })
            .catch((error) => {
                Alert.alert('Erro ao enviar mensagem', error.response.status)
            })
            .finally(() => {
                setMessageIsLoading(false)
            })
    }

    function toggleChatGpt() {
        if (!gptOptionIsActive) {
            setGptOptionIsActive(true);
            setGeminiOptionIsActive(false);
        }
    }

    function toggleGemini() {
        if (!geminiOptionIsActive) {
            setGeminiOptionIsActive(true);
            setGptOptionIsActive(false);
        }
    }

    async function scrollToBottom(animated: boolean) {
        if (!messageListRef.current) return;
        //esperar o teclado subir
        await new Promise((resolve) => setTimeout(resolve, 100))
        await messageListRef.current.scrollToEnd({animated: animated});
    }

    async function handleSaveChatbotMessage() {
        const selectedMessage = gptOptionIsActive ? actualChatGptResponse : actualGeminiResponse
        if (!selectedMessage) return;
        const formattedMessage: OasisMessage = {
            ...selectedMessage,
            isSaved: true,
            oasisChatId: chatInfo.oasisChatId
        }
        await saveChatbotMessage(formattedMessage)
            .then(async () => {
                await setChatMessages([...chatMessages, formattedMessage])
                setRenderSwippable(false)
            })
            .catch((e) => {
                Alert.alert('Erro ao salvar mensagem', e.response)
            })
    }

    function handleCancelSelection() {
        setRenderSwippable(false)
        setGptOptionIsActive(false)
        setGeminiOptionIsActive(false)
        setActualChatGptResponse(null)
        setActualGeminiResponse(null)
    }

    function renderMessage({item}: { item: OasisMessage }) {
        const isChatbotSavedMessage = item.from !== 'User' && item.isSaved
        const isChabotOptionMessage = item.from !== 'User' && !item.isSaved
        const isUserMessage = item.from === 'User'

        if (isUserMessage) return <UserMessageCard oasisMessage={item}/>
        if (isChatbotSavedMessage) return <ChatbotMessageCard oasisMessage={item}/>
        // if (isChabotOptionMessage) return (
        //     <ChatbotOptionCard
        //         oasisMessage={item}
        //         toggle={() => item.from === 'ChatGPT' ? toggleChatGpt() : toggleGemini()}
        //         isActive={item.from === 'ChatGPT' ? gptOptionIsActive : geminiOptionIsActive}
        //     />
        // )
        return <></>
    }

    function renderBottomContent() {
        if (messageIsLoading && !renderSwippable) {
            return (
                <ActivityIndicator size="large" color="#fff"/>
            )
        }
        if (renderSwippable && (gptOptionIsActive || geminiOptionIsActive)) {
            return (
                <ChooseContainer>
                    <SaveButton onPress={handleSaveChatbotMessage}>
                        <SaveText>Save Message</SaveText>
                    </SaveButton>
                    <CancelButton onPress={handleCancelSelection}>
                        <SaveText style={{color: '#fff'}}>Cancel</SaveText>
                    </CancelButton>
                </ChooseContainer>
            )
        }
        if (!messageIsLoading && !gptOptionIsActive && !geminiOptionIsActive && renderSwippable) {
            return (
                // @ts-ignore
                <ChooseContainer style={{width: 'unset', gap: 10,}}>
                    <ChooseText>Choose a message</ChooseText>
                    <FontAwesome6 name={'circle-up'} size={30} color={'#fff'}/>
                </ChooseContainer>
            )
        }

        return (
            <ChatInput
                message={userMessage}
                setMessage={(text) => {
                    if (text === '\n') {
                        Keyboard.dismiss();
                        return;
                    }
                    setUserMessage(text);
                }}
                onFocus={() => {
                    scrollToBottom(true)
                }}
                onPress={handleSendMessageToChat}
            />
        )
    }

    const optionRef = useRef<FlatList>(null);

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#000'}}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <FlatList
                    data={chatMessages}
                    renderItem={renderMessage}
                    keyExtractor={(item, index) => index.toString()}
                    inverted={false}
                    ref={messageListRef}
                    ListFooterComponent={
                        <>
                            {renderSwippable && !messageIsLoading && (
                                <Animatable.View animation={'fadeIn'} duration={1000}>
                                    <FlatList
                                        horizontal
                                        ref={optionRef}
                                        style={{paddingBottom: 20}}
                                        contentContainerStyle={{alignItems: 'flex-start'}}
                                        data={[actualChatGptResponse!, actualGeminiResponse!].filter(Boolean)}
                                        keyExtractor={(item) => item!.from.toString()}
                                        renderItem={({item}) => (
                                            <ChatbotOptionCard
                                                oasisMessage={item}
                                                toggle={() => item.from === 'ChatGPT' ? toggleChatGpt() : toggleGemini()}
                                                isActive={item.from === 'ChatGPT' ? gptOptionIsActive : geminiOptionIsActive}
                                            />
                                        )}
                                        snapToInterval={width}
                                        decelerationRate={'fast'}
                                        onContentSizeChange={() => scrollToBottom(true)}
                                        showsHorizontalScrollIndicator={false}
                                    />
                                </Animatable.View>
                            )}
                            {messageIsLoading && <ChatbotSkeleton/>}
                        </>
                    }
                />

                <BottomContent>
                    {renderBottomContent()}
                </BottomContent>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const BottomContent = styled.View`
  height: 50px;
  display: flex;
  margin-top: 10px;
  align-items: center;
  justify-content: center;
`

const ChooseText = styled.Text`
  font-size: 20px;
  font-weight: 500;
  color: white;
`

const ChooseContainer = styled.View`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  width: 95%;
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
