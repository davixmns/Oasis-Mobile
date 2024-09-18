import React, {useEffect, useState} from 'react';
import {Button, Menu, Switch} from 'react-native-paper';
import {View, StyleSheet} from 'react-native';
import styled from "styled-components/native";

// @ts-ignore
import gptLogo from '../assets/chatGptLogo.png';
// @ts-ignore
import geminiLogo from '../assets/geminiLogo.png';
import {useChatContext} from "../contexts/ChatContext";
import {ChatbotEnum} from "../utils/utils";

export function ChatBotSelector() {
    const [menuVisible, setMenuVisible] = useState(false);
    const {selectedChatbots, setSelectedChatbots} = useChatContext();

    function toggleOption(option: ChatbotEnum) {
        const selected = selectedChatbots.find(chatbot => chatbot.enum === option);
        if(selected?.enabled && selectedChatbots.filter(chatbot => chatbot.enabled).length === 1) {
            return;
        }
        setSelectedChatbots(selectedChatbots.map(chatbot => {
            if(chatbot.enum === option) {
                chatbot.enabled = !chatbot.enabled;
            }
            return chatbot;
        }));
    }

    function openMenu() {
        setMenuVisible(true);
    }

    function closeMenu() {
        setMenuVisible(false);
    }

    return (
        <View>
            <Menu
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
                        <ChatbotText>ChatGPT 4.0</ChatbotText>
                    </OptionContent>
                    <Switch
                        value={selectedChatbots[ChatbotEnum.ChatGPT].enabled}
                        onValueChange={() => toggleOption(ChatbotEnum.ChatGPT)}
                        trackColor={{false: '#5a5a5a', true: '#74dc65'}}
                        ios_backgroundColor={selectedChatbots[ChatbotEnum.ChatGPT].enabled ? '#74dc65' : '#5a5a5a'}
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
                        value={selectedChatbots[ChatbotEnum.Gemini].enabled}
                        onValueChange={() => toggleOption(ChatbotEnum.Gemini)}
                        trackColor={{false: '#5a5a5a', true: '#74dc65'}}
                        ios_backgroundColor={selectedChatbots[ChatbotEnum.Gemini].enabled ? '#74dc65' : '#5a5a5a'}
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
        marginTop: 45,
        marginRight: 10,
        zIndex: 1000,
    }
});

const OptionContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  gap: 10px;
`;

const OptionContent = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

const ChatbotText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

const ChatbotLogo = styled.Image`
  height: 30px;
  width: 30px;
`;
