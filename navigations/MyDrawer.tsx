import React, {useState} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {StatusBar} from 'expo-status-bar';
import {Button, Menu, Provider as PaperProvider} from 'react-native-paper';
import {View} from 'react-native';
import {Chat} from '../screens/Chat';
import {useNavigation} from "@react-navigation/native";
import Settings from "../screens/Settings"; // Certifique-se de importar o componente correto da tela de configurações

const Drawer = createDrawerNavigator();

export function MyDrawer() {
    const navigation = useNavigation();
    const [menuVisible, setMenuVisible] = useState(false);

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    function goToSettings() {
        //@ts-ignore
        navigation.navigate('Settings');
    }

    return (
        <PaperProvider>
            <>
                <StatusBar style="light" backgroundColor="#000"/>
                <Drawer.Navigator
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: '#000',
                        },
                        drawerStyle: {
                            backgroundColor: '#000',
                        },
                        headerTintColor: '#fff',
                        overlayColor: 'rgba(123, 123, 123, 0.4)',
                        drawerActiveBackgroundColor: 'rgba(123, 123, 123, 0.4)',
                        drawerInactiveTintColor: '#fff',
                        drawerItemStyle: {
                            borderRadius: 12,
                        },
                        drawerLabelStyle: {
                            fontWeight: "600",
                            fontSize: 16,
                        },
                        headerRight: () => (
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
                        ),
                    }}
                >
                    {/* Adicione o listeners à tela de configurações */}
                    <Drawer.Screen name="Settings"
                        listeners={{

                        }}
                    >
                        {() => null}
                    </Drawer.Screen>
                    <Drawer.Screen name="Oasis" component={Chat}/>
                    <Drawer.Screen name="chat 1" component={Chat}/>
                    <Drawer.Screen name="chat 2" component={Chat}/>
                </Drawer.Navigator>
            </>
        </PaperProvider>
    );
}
