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

export function ChatScreen({chatData}: { chatData: OasisChat }) {
    const [messageIsLoading, setMessageIsLoading] = useState<boolean>(false);
    const [userMessage, setUserMessage] = useState('');
    const messageListRef = useRef<FlatList>(null);

    useEffect(() => {
        if (chatData.isNewChat === true) {
            setMessageIsLoading(true);
            const firstMessage = chatData.messages[0].message;
            console.log(`First message: ${firstMessage}`)
            setMessageIsLoading(false);
        }
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
