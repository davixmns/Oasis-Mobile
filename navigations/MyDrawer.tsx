import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Chat } from '../screens/Chat';
import { StatusBar } from 'expo-status-bar';

const Drawer = createDrawerNavigator();

export function MyDrawer() {
    return (
        <>
            <StatusBar style="light" backgroundColor="#000" />
            <Drawer.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#000',
                    },
                    headerTintColor: '#fff',
                }}
            >
                <Drawer.Screen name="chat 1" component={Chat} />
                <Drawer.Screen name="chat 2" component={Chat} />
                <Drawer.Screen name="chat 3" component={Chat} />
            </Drawer.Navigator>
        </>
    );
}
