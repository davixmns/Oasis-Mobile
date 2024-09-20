import {useState} from "react";
import {
    FlatList,
    Image, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, TouchableWithoutFeedback, View,
} from "react-native";
import ChatInput from "../components/ChatInput";
import styled from "styled-components/native";
import {useChatContext} from "../contexts/ChatContext";
import {getRandomMessageTips} from "../utils/MessageTipsTexts";
import {MessageTipCard} from "../components/MessageTipCard";

export function NewChatScreen() {
    const {createNewChat} = useChatContext();
    const [userMessage, setUserMessage] = useState('');
    const messageTipos = getRandomMessageTips(3);

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
                        </LogoContainer>
                    </ChatContent>
                    <BottomContainer>
                        <FlatList
                            data={messageTipos}
                            renderItem={({item}) => (
                                <MessageTipCard
                                    tipMessage={item}
                                />
                            )}
                            style={{width: '100%', height: 100, backgroundColor: 'red'}}
                            horizontal={true}
                            keyExtractor={(item, index) => index.toString()}
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
                            onPress={handleSendFirsMessage}
                        />
                    </BottomContainer>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

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

const BottomContainer = styled.View`
    align-items: center;
    justify-self: flex-end;
    gap: 10px;
    width: 100%;
`