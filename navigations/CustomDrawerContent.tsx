import React, {useEffect, useRef, useState} from "react";
import {View, Text, StyleSheet, Image} from "react-native";
import {DrawerContentScrollView, DrawerItem} from "@react-navigation/drawer";
import {useChatContext} from "../contexts/ChatContext";
import styled from "styled-components/native";
import {OasisChat} from "../interfaces/interfaces";
import OasisIcon from "../assets/oasis_icon.png";
import defaultPicture from "../assets/defaultPicture.jpeg";
import {useAuthContext} from "../contexts/AuthContext";
import {FontAwesome6} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import {useTranslation} from "react-i18next";
import {useOasisThemeContext} from "../contexts/OasisThemeContext";

function isSameDay(date1: Date, date2: Date): boolean {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

function groupChatsByUpdatedAt(chats: OasisChat[]) {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);

    const newGroupedChats: { [key: string]: OasisChat[] } = {
        today: [],
        yesterday: [],
        previous_7_days: [],
        previous_3_months: [],
    };

    chats.forEach((chat) => {
        const chatDate = new Date(chat.updatedAt!);
        if (isSameDay(chatDate, today)) {
            newGroupedChats["today"].unshift(chat);
        } else if (isSameDay(chatDate, yesterday)) {
            newGroupedChats["yesterday"].unshift(chat);
        } else if (chatDate >= sevenDaysAgo) {
            newGroupedChats['previous_7_days'].unshift(chat);
        } else if (chatDate >= threeMonthsAgo) {
            newGroupedChats['previous_3_months'].unshift(chat);
        }
    });

    return newGroupedChats;
}

export default function CustomDrawerContent(props: any) {
    const navigation = useNavigation();
    const {chats} = useChatContext();
    const {user} = useAuthContext();
    const {t} = useTranslation()
    const {oasisTheme} = useOasisThemeContext();
    const currentRouteName = props.state.routes[props.state.index].name;
    const [groupedChats, setGroupedChats] = useState<{ [key: string]: OasisChat[] }>({
        today: [] as OasisChat[],
        yesterday: [] as OasisChat[],
        previous_7_days: [] as OasisChat[],
        previous_3_months: [] as OasisChat[],
    });

    useEffect(() => {
        if (chats.length > 0) {
            setGroupedChats(groupChatsByUpdatedAt(chats));
            console.log("🔁 Chats Agrupados");
        }
    }, [chats]);

    return (
        <DrawerBox>
            <DrawerItem
                label={"Oasis"}
                onPress={() => props.navigation.navigate("Oasis")}
                style={{paddingTop: 50}}
                labelStyle={{
                    ...styles.drawerLabelStyle,
                    color: oasisTheme.primaryText,
                }}
                icon={() => (
                    <Image
                        source={OasisIcon}
                        style={{
                            width: 40,
                            height: 30,
                            marginRight: -25,
                        }}
                    />
                )}
            />
            <DrawerContentScrollView {...props} contentContainerStyle={{paddingTop: 'unset'}}>

                {Object.keys(groupedChats).map(
                    (label) =>
                        groupedChats[label].length > 0 && (
                            <View key={label}>
                                <Line/>
                                <TimeLabel>{t(label)}</TimeLabel>
                                {groupedChats[label].map((chat) => {
                                    const isFocused = "Chat_" + chat.id === currentRouteName;
                                    return (
                                        <DrawerItem
                                            key={chat.id}
                                            label={chat.title!}
                                            onPress={() =>
                                                props.navigation.navigate("Chat_" + chat.id)
                                            }
                                            labelStyle={[
                                                {
                                                    ...styles.drawerLabelStyle,
                                                    color: oasisTheme.primaryText,
                                                },
                                                isFocused && {
                                                    color: oasisTheme.primaryText,
                                                },
                                            ]}
                                            style={[
                                                styles.drawerItemStyle,

                                                isFocused && {
                                                    backgroundColor: oasisTheme.secondaryBackground,
                                                },
                                            ]}
                                        />
                                    );
                                })}
                            </View>
                        )
                )}
            </DrawerContentScrollView>

            <ProfileContainer>
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
                                color={"#fff"}
                                style={{
                                    ...styles.iconStyle,
                                    color: oasisTheme.primaryText,
                                }}
                            />
                        </>
                    )}
                    label={user?.name ? user.name : "usuário"}
                    // @ts-ignore
                    onPress={() => navigation.navigate("Settings")}
                    inactiveTintColor={"#fff"}
                    labelStyle={{
                        ...styles.labelStyle,
                        color: oasisTheme.primaryText,
                    }}
                    style={styles.drawerItemStyle}
                />
            </ProfileContainer>
        </DrawerBox>
    );
}

const styles = StyleSheet.create({
    drawerItemStyle: {
        borderRadius: 12,
    },
    drawerLabelStyle: {
        fontSize: 16,
        fontWeight: "500",
    },
    profileImage: {
        width: 35,
        height: 35,
        borderRadius: 8,
    },
    iconStyle: {
        position: "absolute",
        right: 11,
        borderRadius: 50,
    },
    labelStyle: {
        marginLeft: -16,
        fontSize: 16,
        fontWeight: "600",
    },
});

const DrawerBox = styled.View`
    flex: 1;
`;

const ProfileContainer = styled.View`
    position: fixed;
    bottom: 0;
    width: 100%;
    margin-bottom: 32px;
`;

const TimeLabel = styled.Text`
    color: #949494;
    margin-left: 19px;
    margin-top: 16px;
    font-weight: 500;
    font-size: 14px;
`;

const Line = styled.View`
    width: 85%;
    margin-left: 17px;
    margin-right: 30px;
    margin-top: 10px;
    height: 0.5px;
    background-color: rgba(123, 123, 123, 0.7);
`;
