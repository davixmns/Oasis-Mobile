import {Button, Menu} from "react-native-paper";
import {View} from "react-native";
import React from "react";

export function ChatBotSelector(closeMenu: () => void, menuVisible: boolean, openMenu: () => void) {
    return (
        <View style={{marginRight: 10}}>
            <Menu
                style={{paddingTop: 45}}
                visible={menuVisible}
                onDismiss={closeMenu}
                anchor={<Button onPress={openMenu}>Bots</Button>}
            >
                <Menu.Item onPress={() => {
                    console.log('ChatGPT Selected');
                    closeMenu();
                }} title="ChatGPT"/>
                <Menu.Item onPress={() => {
                    console.log('Gemini Selected');
                    closeMenu();
                }} title="Gemini"/>
            </Menu>
        </View>
    );
}