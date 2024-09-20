import {useState} from "react";
import {
    Image, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, TouchableWithoutFeedback,
} from "react-native";
import ChatInput from "../components/ChatInput";
import styled from "styled-components/native";
import {useChatContext} from "../contexts/ChatContext";

export function NewChatScreen() {
    const {createNewChat} = useChatContext();
    const [userMessage, setUserMessage] = useState('');

    async function handleSendFirsMessage() {
        if (userMessage === '') return;
        let msg = userMessage;
        setUserMessage('')
        await createNewChat(msg)
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#000'}}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{flex: 1}}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
                >
                    <ChatContent>
                        <LogoContainer>
                            <Image
                                source={require('../assets/oasis_icon.png')}
                                style={{width: 100, height: 50}}
                            />
                            <Title>Start a Conversation</Title>
                        </LogoContainer>
                    </ChatContent>
                    <ChatInput
                        message={userMessage}
                        setMessage={(text) => {
                            if (text === '\n') {
                                Keyboard.dismiss();
                                return;
                            }
                            setUserMessage(text);
                        }}
                        onPress={handleSendFirsMessage}
                    />
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

const Title = styled.Text`
    font-size: 20px;
    color: #fff;
    margin: 10px;
`

const ChatContent = styled.View`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const LogoContainer = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`