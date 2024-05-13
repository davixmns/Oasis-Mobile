import React from 'react';
import {
    DrawerContentScrollView, DrawerItem, DrawerItemList,
} from '@react-navigation/drawer';
import {useAuthContext} from "../contexts/AuthContext";
import {Image, View, StyleSheet} from "react-native";
import {useNavigation} from "@react-navigation/native";
// @ts-ignore
import defaultPicture from '../assets/defaultPicture.jpeg'
import {FontAwesome6} from "@expo/vector-icons";

export default function CustomDrawerContent(props: any) {
    const {user} = useAuthContext();
    const navigation = useNavigation();

    return (
        <View style={{flex: 1}}>
            <DrawerContentScrollView {...props}>
                <DrawerItemList {...props}/>
            </DrawerContentScrollView>
            <View style={styles.profileContainer}>
                <DrawerItem
                    icon={() => (
                        <>
                            <Image
                                source={defaultPicture}
                                // @ts-ignore
                                style={styles.profileImage}
                            />
                            <FontAwesome6
                                name={"ellipsis-vertical"}
                                size={20}
                                color={'#fff'}
                                style={styles.iconStyle}
                            />
                        </>
                    )}
                    label={user?.name ? user.name : 'usuário'}
                    // @ts-ignore
                    onPress={() => navigation.navigate('Settings')}
                    inactiveTintColor={'#fff'}
                    labelStyle={styles.labelStyle}
                    style={styles.drawerItemStyle}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'red',
    },
    profileContainer: {
        //@ts-ignore
        position: 'fixed',
        bottom: 0,
        width: '100%',
        marginBottom: 32,
    },
    profileImage: {
        width: 35,
        height: 35,
        borderRadius: 8
    },
    iconStyle: {
        position: 'absolute',
        right: 11,
        borderRadius: 50
    },
    labelStyle: {
        marginLeft: -16,
        fontSize: 16,
        fontWeight: '600'
    },
    drawerItemStyle: {
        borderRadius: 12,
    },
    chatList: {
        borderTopWidth: 1,
        borderTopColor: '#fff',
    }
});
