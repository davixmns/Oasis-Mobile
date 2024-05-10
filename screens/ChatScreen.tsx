import {useState, useRef, useEffect} from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
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

import * as Animatable from 'react-native-animatable';

const gptResponseExample: OasisMessage = {
    from: 'ChatGPT',
    oasisChatId: 1,
    message: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.' +
        'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.',
    fromMessageId: '1',
    fromThreadId: '1',
    isSaved: false
}

const geminiResponseExample: OasisMessage = {
    from: 'Gemini',
    oasisChatId: 1,
    message: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.\n',
    fromMessageId: '2',
    fromThreadId: '2',
    isSaved: false
}

const width = Dimensions.get('window').width;

export function ChatScreen({chatData}: { chatData: OasisChat }) {
    const {sendFirstMessage, saveChatbotMessage, chats} = useChatContext();
    const [messageIsLoading, setMessageIsLoading] = useState<boolean>(false);
    const [userMessage, setUserMessage] = useState('');
    const [chatInfo, setChatInfo] = useState<OasisChat>(chatData);
    const [chatMessages, setChatMessages] = useState<OasisMessage[]>(chatData.messages);
    const [actualChatGptResponse, setActualChatGptResponse] = useState<OasisMessage | null>(gptResponseExample)
    const [actualGeminiResponse, setActualGeminiResponse] = useState<OasisMessage | null>(geminiResponseExample)
    const [gptOptionIsActive, setGptOptionIsActive] = useState<boolean>(false)
    const [geminiOptionIsActive, setGeminiOptionIsActive] = useState<boolean>(false)
    const [renderSwippable, setRenderSwippable] = useState<boolean>(true)
    const messageListRef = useRef<FlatList>(null);
    const navigation = useNavigation();

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

    useEffect(() => {
        async function init() {
            if (chatInfo.isNewChat === true) {
                await handleSendFirstMessage()
            }
            if (chatMessages) {
                await scrollToBottom(false);
            }
        }

        init();
    }, [chatInfo]);

    useEffect(() => {
        if (gptOptionIsActive && geminiOptionIsActive) {
            if (actualChatGptResponse) {
                setGptOptionIsActive(false)
            } else {
                setGeminiOptionIsActive(false)
            }
        }
    }, [gptOptionIsActive, geminiOptionIsActive]);

    function toggleChatGpt() {
        if (gptOptionIsActive) return
        setGptOptionIsActive(!gptOptionIsActive)
        gptOptionIsActive ? setGptOptionIsActive(false) : setGeminiOptionIsActive(false)
    }

    function toggleGemini() {
        if (geminiOptionIsActive) return
        setGeminiOptionIsActive(!geminiOptionIsActive)
        gptOptionIsActive ? setGptOptionIsActive(false) : setGeminiOptionIsActive(false)
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

    async function handleSaveChatbotMessage(chatbotMessage: OasisMessage) {
        if (!chatbotMessage) return;
        const formattedMessage: OasisMessage = {
            from: chatbotMessage.from,
            oasisChatId: chatInfo.oasisChatId,
            message: chatbotMessage.message,
            fromMessageId: chatbotMessage?.fromMessageId,
            fromThreadId: chatbotMessage?.fromThreadId,
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
                            scrollToBottom(true)
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
                    style={{paddingVertical: 10}}
                    keyExtractor={(item, index) => index.toString()}
                    inverted={false}
                    ref={messageListRef}
                    ListFooterComponent={
                        renderSwippable ? (
                            <Animatable.View animation={'fadeIn'} duration={1000}>
                                <FlatList
                                    horizontal
                                    style={{paddingBottom: 20}}
                                    contentContainerStyle={{alignItems: 'flex-start'}}
                                    data={[actualChatGptResponse, actualGeminiResponse].filter(Boolean)}
                                    keyExtractor={(item) => item!.from.toString()}
                                    renderItem={({item}) => (
                                        <MessageCard
                                            oasisMessage={item!}
                                            toggle={() => {
                                                if (item!.from === 'ChatGPT') {
                                                    toggleChatGpt()
                                                } else {
                                                    toggleGemini()
                                                }
                                            }}
                                            isActive={item!.from === 'ChatGPT' ? gptOptionIsActive : geminiOptionIsActive}
                                        />
                                    )}
                                    snapToInterval={width}
                                    decelerationRate={'fast'}
                                    showsHorizontalScrollIndicator={false}
                                />
                            </Animatable.View>
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
