import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ActivityIndicator,
    FlatList,
    Dimensions, Alert
} from "react-native";
import {useState, useRef, useEffect} from "react";
import ChatInput from "../components/ChatInput";
import {OasisChat, OasisMessage} from "../interfaces/interfaces";
import {MessageCard} from "../components/MessageCard";
import {useChatContext} from "../contexts/ChatContext";
import {useNavigation} from "@react-navigation/native";
import {ChatbotSkeleton} from "../components/ChatbotSkeleton";
import {FontAwesome6} from "@expo/vector-icons";
import styled from "styled-components/native";
import * as Animatable from 'react-native-animatable';

const width = Dimensions.get('window').width;

export function ChatScreen({chatData}: { chatData: OasisChat }) {
    const {sendFirstMessage, saveChatbotMessage, chats} = useChatContext();
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
            if (chatInfo.isNewChat === true) await handleSendFirstMessage()
            if (chatMessages) await scrollToBottom(false);
        }

        init();
    }, [chatInfo]);


    async function handleSendFirstMessage() {
        const firstMessage = chatData.messages[0].message;
        if (firstMessage === '') return;
        setMessageIsLoading(true);
        console.log("Enviando primeira mensagem!")
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
                console.log("erro ao enviar mensagem -> " + error)
            })
            .finally(() => {
                setMessageIsLoading(false);
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

    function handleSendMessage() {
        // Implement your message sending logic here
    }

    async function handleSaveChatbotMessage() {
        const selectedMessage = gptOptionIsActive ? actualChatGptResponse : actualGeminiResponse
        if (!selectedMessage) return;
        const formattedMessage: OasisMessage = {
            from: selectedMessage.from,
            oasisChatId: chatInfo.oasisChatId,
            message: selectedMessage.message,
            fromMessageId: selectedMessage?.fromMessageId,
            fromThreadId: selectedMessage?.fromThreadId,
            isSaved: true,
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
        return <MessageCard oasisMessage={item}/>
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
                onPress={() => handleSendMessage()}
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
                    style={{paddingVertical: 10}}
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
                                        data={[actualChatGptResponse, actualGeminiResponse].filter(Boolean)}
                                        keyExtractor={(item) => item!.from.toString()}
                                        renderItem={({item}) => (
                                            <MessageCard
                                                oasisMessage={item!}
                                                toggle={() => item!.from === 'ChatGPT' ? toggleChatGpt() : toggleGemini()}
                                                isActive={item!.from === 'ChatGPT' ? gptOptionIsActive : geminiOptionIsActive}
                                                isLoading={messageIsLoading}
                                            />
                                        )}
                                        snapToInterval={width}
                                        decelerationRate={'fast'}
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
