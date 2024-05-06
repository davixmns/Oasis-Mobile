import {useState} from "react";
import {FlatList, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, Text, View} from "react-native";
import ChatInput from "../components/ChatInput";
import styled from "styled-components/native";
import {useChatContext} from "../contexts/ChatContext";
import {OasisChat, OasisMessage} from "../interfaces/interfaces";
import {useNavigation} from "@react-navigation/native";

export function NewChatScreen() {
    const {createNewChat} = useChatContext();
    const [userMessage, setUserMessage] = useState('');
    const navigation = useNavigation();

    async function handleSendFirsMessage() {
        const newMessage : OasisMessage = {
            from: 'User',
            message: userMessage,
            oasisChatId: 9,
            fromThreadId: null,
            FromMessageId: null,
            oasisMessageId: 1,
            createdAt: new Date().toISOString(),
        }
        const random = Math.floor(Math.random() * 1000);
        const newChat : OasisChat = {
            messages: [newMessage],
            oasisChatId: random,
            oasisUserId: 1,
            chatGptThreadId: "teste",
            geminiThreadId: "teste",
            title: "chat novo",
        }
        await createNewChat(newChat)
        // @ts-ignore
        navigation.navigate(newChat.oasisChatId.toString(), {chatData: newChat});
        setUserMessage('')
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#000'}}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <ChatContent>
                    <Title>Send your First Message</Title>
                </ChatContent>
                <ChatInput
                    message={userMessage}
                    setMessage={(text) => {
                        if(text === '\n') {
                            Keyboard.dismiss();
                            return;
                        }
                        setUserMessage(text);
                    }}
                    onPress={handleSendFirsMessage}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const Title = styled.Text`
    font-size: 20px;
    color: #fff;
    margin: 20px;
`

const ChatContent = styled.View`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`