import React, {useState} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {StatusBar} from 'expo-status-bar';
import {Button, Menu, Provider as PaperProvider} from 'react-native-paper';
import {View} from 'react-native';
import {Chat} from '../screens/Chat';
import {useNavigation} from "@react-navigation/native";
import Settings from "../screens/Settings";
import {ChatBotSelector} from "../components/ChatBotSelector";
import CustomDrawerContent from "../components/CustomDrawerContent"; // Certifique-se de importar o componente correto da tela de configurações

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
                    drawerContent={(props) => <CustomDrawerContent {...props}/>}
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: '#000',
                        },
                        drawerStyle: {
                            backgroundColor: '#000',
                        },
                        headerTintColor: '#fff',
                        overlayColor: 'rgba(123, 123, 123, 0.2)',
                        drawerActiveBackgroundColor: 'rgba(123, 123, 123, 0.3)',
                        drawerInactiveTintColor: '#fff',
                        drawerItemStyle: {
                            borderRadius: 12,
                        },
                        drawerLabelStyle: {
                            fontWeight: "600",
                            fontSize: 16,
                        },
                        headerRight: () => ChatBotSelector(closeMenu, menuVisible, openMenu),
                    }}
                >


                    <Drawer.Screen name="Oasis" component={Chat}/>
                    <Drawer.Screen name="chat 1" component={Chat}/>
                    <Drawer.Screen name="chat 2" component={Chat}/>
                    <Drawer.Screen name="chat 3" component={Chat}/>
                    <Drawer.Screen name="chat 4" component={Chat}/>
                    <Drawer.Screen name="chat 5" component={Chat}/>
                    <Drawer.Screen name="chat 6" component={Chat}/>
                </Drawer.Navigator>
            </>
        </PaperProvider>
    );
}
