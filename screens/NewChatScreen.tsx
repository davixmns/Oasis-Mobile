import {useEffect, useState} from "react";
import {FlatList, Image, Keyboard} from "react-native";
import ChatInput from "../components/ChatInput";
import styled from "styled-components/native";
import {useChatContext} from "../contexts/ChatContext";
import {MessageTipCard} from "../components/MessageTipCard";
import {
    CustomKeyboardAvoidingView, CustomSafeAreaView, CustomTouchableWithoutFeedback,
} from "../styles/GlobalStyles";
import {useTranslation} from "react-i18next";
import i18n from "../translation/i18n";
import {useFocusEffect} from "@react-navigation/native";

export function NewChatScreen() {
    const {setFocusedScreen, createNewChat} = useChatContext();
    const {t} = useTranslation()
    const [messageTips, setMessageTips] = useState<string[]>([]);
    const [userMessage, setUserMessage] = useState("");

    useEffect(() => {
        setMessageTips(getRandomMessageTips(5));
    }, [i18n.language]);

    useFocusEffect(() => {
        setFocusedScreen("NewChatScreen");
    })

    function getRandomMessageTips(n: number) {
        //@ts-ignore
        const tipMessages: string[] = t('message_tips', {returnObjects: true});
        return tipMessages.sort(() => Math.random() - Math.random()).slice(0, n);
    }

    return (
        <CustomSafeAreaView>
            <CustomTouchableWithoutFeedback>
                <CustomKeyboardAvoidingView>
                    <ChatContent>
                        <LogoContainer>
                            <Image
                                source={require("../assets/oasis_icon.png")}
                                style={{width: 100, height: 50}}
                            />
                        </LogoContainer>
                    </ChatContent>
                    <BottomContainer>
                        <FlatList
                            data={messageTips}
                            renderItem={({item}) => (
                                <MessageTipCard
                                    tipMessage={item}
                                    onPress={async () => {
                                        await createNewChat(item);
                                    }}
                                />
                            )}
                            style={{width: "100%", paddingLeft: 8}}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        <ChatInput
                            message={userMessage}
                            setMessage={(text) => {
                                if (text === "\n") {
                                    Keyboard.dismiss();
                                    return;
                                }
                                setUserMessage(text);
                            }}
                            onPress={async () => {
                                setUserMessage("");
                                await createNewChat(userMessage);
                            }}
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
`;

const LogoContainer = styled.View`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const BottomContainer = styled.View`
    align-items: center;
    justify-self: flex-end;
    gap: 10px;
    width: 100%;
`;
