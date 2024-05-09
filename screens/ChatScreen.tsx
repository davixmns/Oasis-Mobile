import {useState, useRef, useEffect, forwardRef} from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Text,
    View,
    SafeAreaView,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
    Dimensions, Alert
} from "react-native";
import ChatInput from "../components/ChatInput";
import {OasisChat, OasisMessage} from "../interfaces/interfaces";
import {MessageCard} from "../components/MessageCard";
import {useChatContext} from "../contexts/ChatContext";
import {FontAwesome6} from "@expo/vector-icons";
import styled from "styled-components/native";
import {useNavigation} from "@react-navigation/native";


// const gptResponseExample : OasisMessage = {
//     from: 'ChatGPT',
//     oasisChatId: 1,
//     message: 'Hello, how can I help you?Hello, how can I help you?Hello, how can I help you?Hello, how can I help you?Hello, how can I help you?Hello, how can I help you?Hello, how can I help you?Hello, how can I help you?Hello, how can I help you?Hello, how can I help you?Hello, how can I help you?Hello, how can I help you?Hello, how can I help you?Hello, how can I help you?Hello, how can I help you?Hello, how can I help you?Hello, how can I help you?',
//     // message: 'how can I help you?',
//     FromMessageId: '1',
//     fromThreadId: '1',
//     isSaved: false
// }
//
// const geminiResponseExample : OasisMessage = {
//     from: 'Gemini',
//     oasisChatId: 1,
//     message: 'Hello, how can I help you?Hello, how can I help you?Hello, how can I help you?Hello, how can I help you?Hello, how can I help you?Hello, how can I help you?Hello, how can I help you?Hello, how can I help you?Hello, how can I help you?Hello, how can I help you?Hello, how can I help you?Hello, how can I help you?Hello, how can I help you?Hello, how can I help you?Hello, how can I help you?Hello, how can I help you?Hello, how can I help you?Hello, how can I help you?',
//     // message: 'how can I help you?',
//     FromMessageId: '2',
//     fromThreadId: '2',
//     isSaved: false
// }

const width = Dimensions.get('window').width;

export function ChatScreen({chatData}: { chatData: OasisChat }) {
    const {sendFirstMessage, saveChatbotMessage, chats, setChats} = useChatContext();
    const [messageIsLoading, setMessageIsLoading] = useState<boolean>(false);
    const [userMessage, setUserMessage] = useState('');
    const [chatInfo, setChatInfo] = useState<OasisChat>(chatData);
    const [chatMessages, setChatMessages] = useState<OasisMessage[]>(chatData.messages);

    const [actualChatGptResponse, setActualChatGptResponse] = useState<OasisMessage | null>(null)
    const [actualGeminiResponse, setActualGeminiResponse] = useState<OasisMessage | null>(null)

    const [renderSwippable, setRenderSwippable] = useState<boolean>(false);
    const messageListRef = useRef<FlatList>(null);

    const navigation = useNavigation();

    async function handleSendFirstMessage() {
        const firstMessage = chatData.messages[0].message;
        if (firstMessage === '') return;
        setMessageIsLoading(true);
        console.log("Enviando primeira mensagem!")
        await sendFirstMessage(firstMessage)
            .then((responseData: any) => {
                const newChatTitle = responseData.chat.title;
                chatData.title = newChatTitle;
                setChatInfo(responseData.chat)

                navigation.setOptions({title: newChatTitle})

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

    useEffect(() => {
        async function init() {
            if (chatInfo.isNewChat === true) {
                await handleSendFirstMessage()
            }
        }

        init();
    }, [chatInfo]);

    async function scrollToBottom() {
        if (!messageListRef.current) return;
        //esperar o teclado subir
        await new Promise((resolve) => setTimeout(resolve, 100))
        await messageListRef.current.scrollToEnd({animated: true});
    }

    function handleSendMessage() {
        // Implement your message sending logic here
    }

    async function handleSaveChatbotMessage(chatbotMessage: OasisMessage) {
        if (!chatbotMessage) return;
        const formattedMessage: OasisMessage = {
            from: chatbotMessage.from,
            oasisChatId: chatInfo.oasisChatId,
            message: chatbotMessage.message,
            FromMessageId: chatbotMessage.FromMessageId,
            fromThreadId: chatbotMessage.fromThreadId,
            isSaved: true,
        }
        await saveChatbotMessage(formattedMessage)
            .then(() => {
                setChatMessages([...chatMessages, formattedMessage])
                setRenderSwippable(false)
            })
            .catch((e) => {
                Alert.alert('Erro ao salvar mensagem', e.response)
            })
    }

    function renderMessage({item}: { item: OasisMessage }) {
        return <MessageCard oasisMessage={item}/>
    }

    function renderBottomContent() {
        if (messageIsLoading && !renderSwippable) {
            return <ActivityIndicator size="large" color="#fff"/>;
        } else {
            if (renderSwippable) {
                return (
                    <ChooseContainer>
                        <FontAwesome6 name={'circle-up'} size={25} color={'#fff'}/>
                        <ChooseText>Choose a message</ChooseText>
                    </ChooseContainer>
                );
            } else {
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
                            console.log("Focus")
                            scrollToBottom()
                        }}
                        onPress={() => handleSendMessage()}
                    />
                );
            }
        }
    }

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
                    style={{paddingBottom: 30}}
                    keyExtractor={(item, index) => index.toString()}
                    inverted={false}
                    ref={messageListRef}
                    onContentSizeChange={() => messageListRef.current?.scrollToEnd({animated: false})}
                    ListFooterComponent={
                        renderSwippable ? (
                            <FlatList
                                horizontal
                                style={{paddingBottom: 20}}
                                data={[actualChatGptResponse, actualGeminiResponse].filter(Boolean)}
                                keyExtractor={(item) => item!.from.toString()}
                                renderItem={({item}) => (
                                    <TouchableOpacity onPress={() => handleSaveChatbotMessage(item!)}>
                                        {/*<TouchableOpacity style={{width, justifyContent: 'center', alignItems: 'center'}}>*/}
                                        <MessageCard oasisMessage={item!}/>
                                    </TouchableOpacity>
                                )}
                                snapToInterval={width}
                                decelerationRate="fast"
                                showsHorizontalScrollIndicator={false}
                            />
                        ) : null
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
  justify-content: center;
  flex-direction: row;
  gap: 10px;
  padding: 10px;
`
