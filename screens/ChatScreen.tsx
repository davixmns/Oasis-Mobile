import {useState, useRef} from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Text,
    View,
    SafeAreaView, FlatList
} from "react-native";
import styled from "styled-components/native";
import ChatInput from "../components/ChatInput";
import {OasisMessage} from "../interfaces/interfaces";

export function ChatScreen({messages, oasisChatId}: {messages: OasisMessage[], oasisChatId: number}) {
    const [userMessage, setUserMessage] = useState('');

    const messageListRef = useRef<FlatList>(null);
    async function scrollToBottom() {
        if (!messageListRef.current) return;
        messageListRef.current.scrollToOffset({offset: 0, animated: true});
    }

    function renderMessage({item}: any) {
        return (
            <View key={item.id} style={{backgroundColor: 'gray', height: 100, marginTop: 20}}>
                <Text>{item.message}</Text>
            </View>
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
                    data={messages}
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
                        if(text === '\n') {
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
