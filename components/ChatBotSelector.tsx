import React, {useEffect, useState} from 'react';
import {Button, Menu, Switch} from 'react-native-paper';
import {View, StyleSheet} from 'react-native';
import styled from "styled-components/native";

// @ts-ignore
import gptLogo from '../assets/chatGptLogo.png';
// @ts-ignore
import geminiLogo from '../assets/geminiLogo.png';
import {useChatContext} from "../contexts/ChatContext";

export function ChatBotSelector(closeMenu: () => void, menuVisible: boolean, openMenu: () => void) {
    const {setChatbotEnums} = useChatContext();
    const [chatGptEnabled, setChatGptEnabled] = useState(true);
    const [geminiEnabled, setGeminiEnabled] = useState(true);

    useEffect(() => {
        if (setChatbotEnums) {
            const newEnums = [];
            if (chatGptEnabled) newEnums.push(0); // Assumindo que 0 representa ChatGPT
            if (geminiEnabled) newEnums.push(1); // Assumindo que 1 representa Gemini
            setChatbotEnums(newEnums);
        }
    }, [chatGptEnabled, geminiEnabled]);

    function toggleChatGpt() {
        if (chatGptEnabled && !geminiEnabled) {
            setGeminiEnabled(true);
        }
        setChatGptEnabled(!chatGptEnabled);
    }

    function toggleGemini() {
        if (geminiEnabled && !chatGptEnabled) {
            setChatGptEnabled(true);
        }
        setGeminiEnabled(!geminiEnabled);
    }

    return (
        <View style={{marginRight: 10, zIndex: 9999}}>
            <Menu
                style={{marginTop: 50, paddingRight: 10}}
                visible={menuVisible}
                onDismiss={closeMenu}
                anchor={<Button onPress={openMenu}>Bots</Button>}
                contentStyle={styles.menu}
            >
                <OptionContainer>
                    <OptionContent>
                        <ChatbotLogo
                            source={gptLogo}
                        />
                        <ChatbotText>ChatGPT 4o</ChatbotText>
                    </OptionContent>
                    <Switch
                        value={chatGptEnabled}
                        onValueChange={toggleChatGpt}
                        trackColor={{false: '#5a5a5a', true: '#74dc65'}}
                        ios_backgroundColor={chatGptEnabled ? '#74dc65' : '#5a5a5a'}
                    />
                </OptionContainer>
                <OptionContainer>
                    <OptionContent>
                        <ChatbotLogo
                            source={geminiLogo}
                        />
                        <ChatbotText>Gemini 1.0 Pro</ChatbotText>
                    </OptionContent>
                    <Switch
                        value={geminiEnabled}
                        onValueChange={toggleGemini}
                        trackColor={{false: '#5a5a5a', true: '#74dc65'}}
                        ios_backgroundColor={geminiEnabled ? '#74dc65' : '#5a5a5a'}
                    />
                </OptionContainer>
            </Menu>
        </View>
    );
}

const styles = StyleSheet.create({
    menu: {
        backgroundColor: '#000',
        borderStyle: 'solid',
        borderWidth: 0.2,
        borderColor: '#fff',
        borderRadius: 12,
    }
})

const OptionContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  gap: 10px;
`

const OptionContent = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`

const ChatbotText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`

const ChatbotLogo = styled.Image`
  height: 30px;
  width: 30px;
`