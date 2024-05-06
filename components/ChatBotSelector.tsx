import React, {useState} from 'react';
import {Button, Menu, Switch} from 'react-native-paper';
import {View, Platform, StyleSheet} from 'react-native';
import styled from "styled-components/native";

export function ChatBotSelector(closeMenu: () => void, menuVisible: boolean, openMenu: () => void) {
    const [chatGptEnabled, setChatGptEnabled] = useState(true);
    const [geminiEnabled, setGeminiEnabled] = useState(true);


    const toggleChatGpt = () => {
        if (!geminiEnabled) {
            setGeminiEnabled(true);
        }
        setChatGptEnabled(!chatGptEnabled);
    };

    const toggleGemini = () => {
        if (!chatGptEnabled) {
            setChatGptEnabled(true);
        }
        setGeminiEnabled(!geminiEnabled);
    };

    return (
        <View style={{marginRight: 10}}>
            <Menu
                style={{marginTop: 45}}
                visible={menuVisible}
                onDismiss={closeMenu}
                anchor={<Button onPress={openMenu}>Bots</Button>}
                contentStyle={styles.menu}
            >
                <Option>
                    <OptionText>ChatGPT</OptionText>
                    <Switch
                        value={chatGptEnabled}
                        onValueChange={toggleChatGpt}
                    />
                </Option>
                <Option>
                    <OptionText>Gemini</OptionText>
                    <Switch
                        value={geminiEnabled}
                        onValueChange={toggleGemini}
                    />
                </Option>
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

const Option = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  gap: 10px;
`

const OptionText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`