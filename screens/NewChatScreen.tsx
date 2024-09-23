import {useState} from "react";
import {FlatList, Image, Keyboard, TouchableWithoutFeedback,} from "react-native";
import ChatInput from "../components/ChatInput";
import styled from "styled-components/native";
import {useChatContext} from "../contexts/ChatContext";
import {getRandomMessageTips} from "../utils/MessageTipsTexts";
import {MessageTipCard} from "../components/MessageTipCard";
import {CustomKeyboardAvoidingView, CustomSafeAreaView, CustomTouchableWithoutFeedback} from "../styles/GlobalStyles";

export function NewChatScreen() {
    const {createNewChat} = useChatContext();
    const [userMessage, setUserMessage] = useState('');

    async function handleSendFirstMessage(message: string) {
        if (message === '') return;
        setUserMessage('')
        await createNewChat(message)
    }

    return (
        <CustomSafeAreaView>
            <CustomTouchableWithoutFeedback>
                <CustomKeyboardAvoidingView>
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
                            data={getRandomMessageTips(5)}
                            renderItem={({item}) => (
                                <MessageTipCard
                                    tipMessage={item}
                                    onPress={() => handleSendFirstMessage(item)}
                                />
                            )}
                            style={{width: '100%'}}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
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
                            onPress={() => handleSendFirstMessage(userMessage)}
                        />
                    </BottomContainer>
                </CustomKeyboardAvoidingView>
            </CustomTouchableWithoutFeedback>
        </CustomSafeAreaView>
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