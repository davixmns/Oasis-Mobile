import {useState, useRef, useEffect} from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Text,
    View,
    SafeAreaView, FlatList, ActivityIndicator
} from "react-native";
import ChatInput from "../components/ChatInput";
import {OasisChat, OasisMessage} from "../interfaces/interfaces";
import {MessageCard} from "../components/MessageCard";
import {useChatContext} from "../contexts/ChatContext";

export function ChatScreen({chatData}: { chatData: OasisChat }) {
    const {sendFirstMessage} = useChatContext();
    const {chatbotEnums} = useChatContext();
    const [messageIsLoading, setMessageIsLoading] = useState<boolean>(false);
    const [userMessage, setUserMessage] = useState('');
    const messageListRef = useRef<FlatList>(null);

    async function handleSendFirstMessage() {
        const firstMessage = chatData.messages[0].message;
        if (firstMessage === '') return;
        setMessageIsLoading(true);
        await sendFirstMessage(firstMessage)
            .then((responseData) => {
                console.log("Resposta do envio -> ")
                console.log(responseData);
                chatData.oasisChatId = responseData.chat.oasisChatId;
                chatData.isNewChat = false;
                setUserMessage('')
            })
            .catch((error) => {
                console.log("erro ao enviar mensage")
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

    function renderMessage({item}: { item: OasisMessage }) {
        return (
            <MessageCard oasisMessage={item}/>
        );
    }

    function handleSendMessage() {
        // Implement your message sending logic here
    }

    // {
    //     "chat": {
    //     "oasisChatId": 10,
    //         "userId": 2,
    //         "chatGptThreadId": "thread_3UsDMdjonXFUhtjk6lCoDBHT",
    //         "geminiThreadId": null,
    //         "messages": [
    //         {
    //             "oasisMessageId": 5,
    //             "oasisChatId": 10,
    //             "from": "User",
    //             "message": "Voce gosta de sorvete?",
    //             "fromThreadId": null,
    //             "fromMessageId": null,
    //             "createdAt": "2024-05-07T14:52:32.471715-03:00"
    //         }
    //     ],
    //         "createdAt": "2024-05-07T17:52:32.407542Z"
    // },
    //     "userMessage": {
    //     "oasisMessageId": 5,
    //         "oasisChatId": 10,
    //         "from": "User",
    //         "message": "Voce gosta de sorvete?",
    //         "fromThreadId": null,
    //         "fromMessageId": null,
    //         "createdAt": "2024-05-07T14:52:32.471715-03:00"
    // },
    //     "chatbotMessages": [
    //     {
    //         "oasisMessageId": 0,
    //         "oasisChatId": null,
    //         "from": "ChatGPT",
    //         "message": "Sim, eu gosto de sorvete! Sorvete é uma delícia, não é mesmo? Qual é o seu sabor de sorvete favorito?",
    //         "fromThreadId": "thread_3UsDMdjonXFUhtjk6lCoDBHT",
    //         "fromMessageId": "msg_CsLx0xeOmvLpaKszOnQpgN8l",
    //         "createdAt": "2024-05-07T17:52:30"
    //     },
    //     {
    //         "oasisMessageId": 0,
    //         "oasisChatId": null,
    //         "from": "Gemini",
    //         "message": "Sim, eu gosto muito de sorvete! É uma sobremesa deliciosa e refrescante, perfeita para qualquer ocasião. Meu sabor favorito é chocolate, mas também gosto muito de baunilha, morango e cookies 'n' cream. E você, gosta de sorvete?",
    //         "fromThreadId": null,
    //         "fromMessageId": null,
    //         "createdAt": "2024-05-07T14:52:32.406801-03:00"
    //     }
    // ]
    // }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#000'}}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <FlatList
                    data={chatData.messages}
                    renderItem={renderMessage}
                    ref={messageListRef}
                    inverted={true}
                    onContentSizeChange={() => {
                        if (!messageListRef.current) return
                        messageListRef.current.scrollToEnd({animated: false});
                    }}
                />

                {messageIsLoading && <ActivityIndicator size="large" color="#fff"/>}


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
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
