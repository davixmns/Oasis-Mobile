import axios from "axios";
import {ChatbotEnum, OasisMessage, OasisUser} from "../interfaces/interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useNavigation, useRoute} from "@react-navigation/native";
import {Alert} from "react-native";

const api = axios.create({
    baseURL: "http://0.0.0.0:5013",
    // baseURL: "http://10.50.185.139:5013",
});

api.interceptors.response.use(
    async response => {
        if(response.headers['x-new-tokens'] === 'true') {
            const newAccessToken = response.headers['x-new-access-token'];
            const newRefreshToken = response.headers['x-new-refresh-token'];
            await saveTokensOnStorage(newAccessToken, newRefreshToken);
            console.log("🔑 Novos tokens salvos")
        }
        return response;
    },
    async error => {
        if(error.response.status === 401) {
            const route = useRoute();
            if(route.name !== 'Login') {
                Alert.alert("Sua sessão expirou, faça login novamente");
                await removeTokens();
                const navigation = useNavigation();
                navigation.reset({
                    index: 0,
                    //@ts-ignore
                    routes: [{name: 'Login'}]
                });
            }
        }

        return Promise.reject(error);
    }
);

export async function saveTokensOnStorage(accessToken: string, refreshToken: string) {
    await AsyncStorage.setItem('@oasis-accessToken', accessToken);
    await AsyncStorage.setItem('@oasis-refreshToken', refreshToken);
}

async function getTokens() {
    const data = await AsyncStorage.multiGet(['@oasis-accessToken', '@oasis-refreshToken']);
    return{
        accessToken: data[0][1],
        refreshToken: data[1][1]
    }
}

async function removeTokens() {
    await AsyncStorage.removeItem('@oasis-accessToken');
    await AsyncStorage.removeItem('@oasis-refreshToken');
}

export async function tryLoginService(email: string, password: string) {
    return await api.post("/Auth/login", {
        Email: email,
        Password: password
    });
}

export async function verifyAccessTokenService() {
    const {accessToken, refreshToken} = await getTokens();

    return await api.get("/Auth/verifyAccessToken", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-Refresh-Token': refreshToken
        }
    });
}

export async function createUserService(newUser: OasisUser) {
    return await api.post("/User", newUser);
}

export async function getAllUserChatsService() {
    const {accessToken, refreshToken} = await getTokens();

    return await api.get("/Chat/GetAllUserChats", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-Refresh-Token': refreshToken
        }
    });
}

export async function loadChatMessagesService(oasisChatId: number) {
    const {accessToken, refreshToken} = await getTokens();

    return await api.get(`/Chat/GetChatMessages/${oasisChatId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-Refresh-Token': refreshToken
        }
    });
}

export async function sendFirstMessageService(userMessage: string) {
    const {accessToken, refreshToken} = await getTokens();

    return await api.post("/Chat/StartConversation", {
        Message: userMessage,
    }, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-Refresh-Token': refreshToken
        }
    });
}

export async function saveChatbotMessageService(chatbotMessage: OasisMessage) {
    const {accessToken, refreshToken} = await getTokens();

    return await api.post("/Chat/SaveChatbotMessage", chatbotMessage, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-Refresh-Token': refreshToken
        }
    });
}

export async function sendMessageToChatService(oasisChatId: number, message: string) {
    const {accessToken, refreshToken} = await getTokens();

    return await api.post("/Chat/ContinueConversation",{
        OasisChatId: oasisChatId,
        Message: message,
    }, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-Refresh-Token': refreshToken
        }
    });
}

export async function updateChatBotDetailsService(oasisChatBotDetailsId: number, isActive: boolean) {
    const {accessToken, refreshToken} = await getTokens();

    return await api.put("/Chat/UpdateChatBotDetails", {
        isActive: isActive,
        oasisChatBotDetailsId: oasisChatBotDetailsId
    }, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-Refresh-Token': refreshToken
        }
    });
}