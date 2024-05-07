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

    async function handleSendFirsMessage() {
        if(userMessage === '') return;
        await createNewChat(userMessage)
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