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
    Dimensions
} from "react-native";
import ChatInput from "../components/ChatInput";
import {OasisChat, OasisMessage} from "../interfaces/interfaces";
import {MessageCard} from "../components/MessageCard";
import {useChatContext} from "../contexts/ChatContext";
import {FontAwesome6} from "@expo/vector-icons";
import styled from "styled-components/native";

const width = Dimensions.get('window').width;

export function ChatScreen({chatData}: { chatData: OasisChat }) {
    const {sendFirstMessage} = useChatContext();
    const [messageIsLoading, setMessageIsLoading] = useState<boolean>(false);
    const [userMessage, setUserMessage] = useState('');
    const [chatMessages, setChatMessages] = useState<OasisMessage[]>(chatData.messages);

    const gptResponse: OasisMessage = {
        from: 'ChatGPT',
        message: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum',
        oasisChatId: 1,
        fromThreadId: null,
        oasisMessageId: 4,
        FromMessageId: "dwdw",
        createdAt: new Date().toISOString(),
    }

    const geminiResponse: OasisMessage = {
        from: 'Gemini',
        message: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
        oasisChatId: 1,
        fromThreadId: null,
        oasisMessageId: 2,
        FromMessageId: "dwdw",
        createdAt: new Date().toISOString(),
    }

    const [actualChatGptResponse, setActualChatGptResponse] = useState<OasisMessage | null>(null)
    const [actualGeminiResponse, setActualGeminiResponse] = useState<OasisMessage | null>(null)
    const [renderSwippable, setRenderSwippable] = useState<boolean>(false);
    const messageListRef = useRef<FlatList>(null);

    async function handleSendFirstMessage() {
        const firstMessage = chatData.messages[0].message;
        if (firstMessage === '') return;
        setMessageIsLoading(true);
        await sendFirstMessage(firstMessage)
            .then((responseData: any) => {
                console.log("Resposta do envio -> ")
                chatData.isNewChat = false;

                const gptResponse = responseData?.chatbotMessages[0]
                const geminiResponse = responseData?.chatbotMessages[1]

                console.log('gpt -> ' + gptResponse.message)
                console.log('gemini -> ' + geminiResponse.message)

                setActualChatGptResponse(gptResponse)
                setActualGeminiResponse(geminiResponse)

                setUserMessage('')
                setRenderSwippable(true);
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
            if (chatData.isNewChat === true) {
                await handleSendFirstMessage()
            }
        }

        init();
    }, [chatData.isNewChat]);

    async function scrollToBottom() {
        if (!messageListRef.current) return;
        messageListRef.current.scrollToOffset({offset: 0, animated: true});
    }

    function handleSendMessage() {
        // Implement your message sending logic here
    }

    function renderMessage({item}: { item: OasisMessage }) {
        return (
            <MessageCard oasisMessage={item}/>
        );
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
                    keyExtractor={(item) => item.oasisMessageId.toString()}
                    inverted={true}
                    onContentSizeChange={() => messageListRef.current?.scrollToEnd({animated: false})}
                    ListHeaderComponent={
                        renderSwippable ? (
                            <FlatList
                                horizontal
                                data={[actualChatGptResponse, actualGeminiResponse].filter(Boolean)}
                                keyExtractor={(item) => item!.oasisMessageId.toString()}
                                renderItem={({item}) => (
                                    <TouchableOpacity>
                                        {/*<TouchableOpacity style={{width, justifyContent: 'center', alignItems: 'center'}}>*/}
                                        <MessageCard oasisMessage={item!}/>
                                    </TouchableOpacity>
                                )}
                                snapToInterval={width * 1.1}
                                decelerationRate="fast"
                                showsHorizontalScrollIndicator={false}
                            />
                        ) : null
                    }
                />

                <FooterContainer>
                    {!renderSwippable ? (
                        <ChatInput
                            message={userMessage}
                            setMessage={(text) => {
                                if (text === '\n') {
                                    Keyboard.dismiss();
                                    return;
                                }
                                setUserMessage(text);
                            }}
                            onPress={handleSendMessage}
                            onFocus={scrollToBottom}
                        />
                    ) : (
                        <ChooseContainer>
                            <FontAwesome6 name={'circle-up'} size={25} color={'#fff'} style={{alignSelf: 'center'}}/>
                            <ChooseText>Choose an Answer</ChooseText>
                        </ChooseContainer>
                    )}
                    {messageIsLoading && <ActivityIndicator animating={messageIsLoading} size={'large'} color={'#fff'}/>}
                </FooterContainer>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const FooterContainer = styled.View`
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
