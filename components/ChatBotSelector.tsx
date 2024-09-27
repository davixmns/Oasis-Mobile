import React, {useState} from 'react';
import {Button, Menu, Switch} from 'react-native-paper';
import {Dimensions, StyleSheet} from 'react-native';
import styled from "styled-components/native";
import gptLogo from '../assets/chatGptLogo.png';
import geminiLogo from '../assets/geminiLogo.png';
import {ChatbotEnum} from "../interfaces/interfaces";
import {useColorSchemeContext} from "../contexts/ColorSchemeContext";

interface ChatBotSelectorProps {
    selectedChatbots: { enum: ChatbotEnum, enabled: boolean, id: number }[];
    updateChatBotOption: (id: number, isSelected: boolean) => void;
}

const {width} = Dimensions.get('window');

export function ChatBotSelector({selectedChatbots, updateChatBotOption}: ChatBotSelectorProps) {
    const [menuVisible, setMenuVisible] = useState(false);
    const {colorScheme} = useColorSchemeContext()

    return (
        <Menu
            visible={menuVisible}
            onDismiss={() =>  setMenuVisible(false)}
            anchor={<Button onPress={() => setMenuVisible(true)}>Bots</Button>}
            contentStyle={{
                width: width * 0.9,
                maxWidth: 400,
                borderRadius: 12,
                marginTop: 45,
                zIndex: 1000,
                marginRight: 10,
                backgroundColor: colorScheme.secondaryBackground
            }}
        >
            <OptionContainer>
                <OptionContent>
                    <ChatbotLogo
                        source={gptLogo}
                    />
                    <ChatbotText>ChatGPT 4o</ChatbotText>
                </OptionContent>
                <Switch
                    value={selectedChatbots[0].enabled}
                    onValueChange={() => updateChatBotOption(selectedChatbots[0].id, !selectedChatbots[0].enabled)}
                    trackColor={{false: '#5a5a5a', true: '#74dc65'}}
                    ios_backgroundColor={selectedChatbots[0].enabled ? '#74dc65' : '#5a5a5a'}
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
                    value={selectedChatbots[1].enabled}
                    onValueChange={() => updateChatBotOption(selectedChatbots[1].id, !selectedChatbots[1].enabled)}
                    trackColor={{false: '#5a5a5a', true: '#74dc65'}}
                    ios_backgroundColor={selectedChatbots[1].enabled ? '#74dc65' : '#5a5a5a'}
                />
            </OptionContainer>
        </Menu>
    );
}

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
    color: ${props => props.theme.primaryText};
    font-size: 16px;
    font-weight: bold;
`;

const ChatbotLogo = styled.Image`
    height: 30px;
    width: 30px;
`;
