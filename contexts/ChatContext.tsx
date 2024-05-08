import {createContext, useContext, useEffect, useState} from "react";
import {OasisChat, OasisMessage, ProviderProps} from "../interfaces/interfaces";
import {getAllChatsService, saveChatbotMessageService, sendFirstMessageService} from "../service/apiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useAuthContext} from "./AuthContext";
import {useNavigation} from "@react-navigation/native";
import {Alert} from "react-native";

interface ChatContextType {
    chats: OasisChat[];
    createNewChat: (fisrtUserMessage: string) => Promise<void>;
    sendFirstMessage: (userMessage: string) => Promise<any>;
    chatbotEnums: number[];
    setChatbotEnums: (chatbotEnums: number[]) => void;
    saveChatbotMessage: (chatbotMessage: OasisMessage) => Promise<void>;
}

const ChatContext = createContext<ChatContextType>({} as ChatContextType);

export function useChatContext() {
    return useContext(ChatContext);
}

export function ChatProvider({children}: ProviderProps) {
    const {isAuthenticated} = useAuthContext();
    const [chats, setChats] = useState<OasisChat[]>([]);
    const [chatbotEnums, setChatbotEnums] = useState<number[]>([1, 1]);
    const navigation = useNavigation();

    useEffect(() => {
        async function fetchData() {
            await getAllChats();
        }
        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated]);

    async function getAllChats() {
        const tokenjwt = await AsyncStorage.getItem('@oasis-accessToken')
        if (!tokenjwt) {
            console.log("Token não encontrado")
            return;
        }
        await getAllChatsService(tokenjwt)
            .then((response) => {
                setChats(response.data)
                console.log("Conversas OK!")
            })
            .catch((error) => {
                if(error.response) {
                    console.log(`Status ${error.response.status} ao buscar chats`)
                }
            })
    }

    async function createNewChat(fisrtUserMessage: string) {
        const tokenJwt = await AsyncStorage.getItem('@oasis-accessToken');
        if (!tokenJwt) return;
        const randomChatId = Math.floor(Math.random() * 1000);
        const newMessage : OasisMessage = {
            from: 'User',
            message: fisrtUserMessage,
            oasisChatId: randomChatId,
            fromThreadId: null,
            FromMessageId: null,
            oasisMessageId: 1,
            createdAt: new Date().toISOString(),
        }
        const newChat :OasisChat = {
            messages: [newMessage],
            oasisChatId: randomChatId,
            oasisUserId: 1,
            chatGptThreadId: "teste",
            geminiThreadId: "teste",
            title: "new",
            isNewChat: true,
        }
        await setChats(currentChats => [...currentChats, newChat]);
        // @ts-ignore
        navigation.navigate(newChat.oasisChatId.toString(), {chatData: newChat});
    }

    async function sendFirstMessage(userMessage: string){
        if(userMessage === '') return;
        const tokenJwt = await AsyncStorage.getItem('@oasis-accessToken');
        if (!tokenJwt) return;
        return await sendFirstMessageService(userMessage, [1, 1], tokenJwt)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                if(error.response) {
                    Alert.alert('Erro ao enviar mensagem', 'Tente novamente mais tarde')
                    console.log(error?.response)
                    throw error;
                }
            })
    }

    async function saveChatbotMessage(chatbotMessage: OasisMessage) {
        const tokenJwt = await AsyncStorage.getItem('@oasis-accessToken');
        if (!tokenJwt) return;
        await saveChatbotMessageService(chatbotMessage, tokenJwt)
            .then(() => {
                console.log("Mensagem do escolhida salva!")
            })
            .catch((error) => {
                if(error.response) {
                    console.log('erro ao salvar mensagem -> ' + error.response)
                    throw error;
                }
            })
    }

    return (
        <ChatContext.Provider
            value={{
                chats,
                createNewChat,
                sendFirstMessage,
                chatbotEnums,
                setChatbotEnums,
                saveChatbotMessage
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}