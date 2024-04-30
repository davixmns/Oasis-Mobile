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

export function Chat() {
    const [userMessage, setUserMessage] = useState('');
    const messages = [
        {id: 1, message: 'Hello'},
        {id: 2, message: 'Hi'},
        {id: 3, message: 'How are you?'},
        {id: 4, message: 'I am fine, thank you'},
        {id: 5, message: 'How about you?'},
        {id: 6, message: 'I am good too'},
        {id: 7, message: 'What are you doing?'},
        {id: 8, message: 'I am chatting with you'},
        {id: 9, message: 'Haha'},
        {id: 10, message: 'Haha'},
    ];
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

const ScrollContainer = styled.View`
  flex: 1;
  background-color: #000;
`;
