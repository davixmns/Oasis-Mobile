import {useState, useRef, useEffect, forwardRef} from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Text,
    View,
    SafeAreaView,
    ActivityIndicator,
    ScrollView, TouchableOpacity
} from "react-native";
import ChatInput from "../components/ChatInput";
import {OasisChat, OasisMessage} from "../interfaces/interfaces";
import {MessageCard} from "../components/MessageCard";
import {useChatContext} from "../contexts/ChatContext";
import {Swipeable} from "react-native-gesture-handler";

export function ChatScreen({chatData}: { chatData: OasisChat }) {
    const {sendFirstMessage} = useChatContext();
    const [messageIsLoading, setMessageIsLoading] = useState<boolean>(false);
    const [userMessage, setUserMessage] = useState('');
    const scrollViewRef = useRef<ScrollView>(null);
    const [chatMessages, setChatMessages] = useState<OasisMessage[]>(chatData.messages);
    const [renderSwippable, setRenderSwippable] = useState<boolean>(false);
    const [actualChatGptResponse, setActualChatGptResponse] = useState<OasisMessage | null>(null);
    const [actualGeminiResponse, setActualGeminiResponse] = useState<OasisMessage | null>(null);

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

                console.log('gpt -> ' + gptResponse)
                console.log('gemini -> '+ geminiResponse)

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

    function handleSendMessage() {
        // Implement your message sending logic here
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#000'}}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <ScrollView
                    ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({animated: true})}
                >
                    {chatMessages.slice().reverse().map((message, index) => (
                        <MessageCard key={index} oasisMessage={message}/>
                    ))}
                    {renderSwippable && (
                        <ScrollView horizontal={true}>
                            {actualChatGptResponse !== null && (
                                <TouchableOpacity>
                                    <MessageCard oasisMessage={actualChatGptResponse}/>
                                </TouchableOpacity>
                            )}
                            {actualGeminiResponse !== null && (
                                <TouchableOpacity>
                                    <MessageCard oasisMessage={actualGeminiResponse}/>
                                </TouchableOpacity>
                            )}
                        </ScrollView>
                    )}
                </ScrollView>

                {messageIsLoading && <ActivityIndicator size="small" color="#fff" style={{alignSelf: 'flex-start'}}/>}

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
                    onFocus={() => scrollViewRef.current?.scrollToEnd({animated: true})}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
