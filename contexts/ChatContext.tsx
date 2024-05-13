import {createContext, useContext, useEffect, useState} from "react";
import {OasisChat, OasisMessage, ProviderProps} from "../interfaces/interfaces";
import {
    getAllChatsService,
    saveChatbotMessageService,
    sendFirstMessageService,
    sendMessageToChatService
} from "../service/apiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useAuthContext} from "./AuthContext";
import {useNavigation} from "@react-navigation/native";
import {Alert} from "react-native";

interface ChatContextType {
    chats: OasisChat[];
    setChats: (chats: OasisChat[]) => void;
    createNewChat: (fisrtUserMessage: string) => Promise<void>;
    sendFirstMessage: (userMessage: string) => Promise<any>;
    chatbotEnums: number[];
    setChatbotEnums: (chatbotEnums: number[]) => void;
    saveChatbotMessage: (chatbotMessage: OasisMessage) => Promise<void>;
    sendMessageToChat: (oasisChatId: number, chatbotEnums: number[], message: string) => Promise<any>;
}

const ChatContext = createContext<ChatContextType>({} as ChatContextType);

export function useChatContext() {
    return useContext(ChatContext);
}

export function ChatProvider({children}: ProviderProps) {
    const {isAuthenticated} = useAuthContext();
    const [chats, setChats] = useState<OasisChat[]>([]);
    const array = [1, 1];
    const [chatbotEnums, setChatbotEnums] = useState<number[]>(array);
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
        if(!tokenjwt) return;
        await getAllChatsService(tokenjwt)
            .then((response) => {
                console.log("✅ Chats carregados")
                let i = 1;
                const chats = response.data;
                chats.forEach((chat: OasisChat) => {
                    chat.title = `${i}. ` + chat.title;
                    i++;
                })
                setChats(chats);
            })
            .catch((error) => {
                if (error.response) {
                    console.log("❌ Erro ao buscar chats -> " + error.response)
                }
            })
    }

    async function createNewChat(fisrtUserMessage: string) {
        const tokenJwt = await AsyncStorage.getItem('@oasis-accessToken');
        if (!tokenJwt) return;
        const randomChatId = Math.floor(Math.random() * 1000);
        const newMessage: OasisMessage = {
            from: 'User',
            message: fisrtUserMessage,
            oasisChatId: randomChatId,
            fromThreadId: null,
            fromMessageId: null,
            oasisMessageId: 1,
            createdAt: new Date().toISOString(),
            isSaved: true,
        }
        const newChat: OasisChat = {
            messages: [newMessage],
            oasisChatId: randomChatId,
            oasisUserId: 1,
            chatGptThreadId: "",
            geminiThreadId: "",
            title: `${chats.length + 1}. Loading...`,
            isNewChat: true,
        }
        await setChats(currentChats => [...currentChats, newChat]);
        // @ts-ignore
        navigation.navigate(newChat.title, {chatData: newChat});
    }

    async function sendFirstMessage(userMessage: string) {
        if (userMessage === '') return;
        const tokenJwt = await AsyncStorage.getItem('@oasis-accessToken');
        if (!tokenJwt) return;
        return await sendFirstMessageService(userMessage, [1, 1], tokenJwt)
            .then((response) => {
                console.log("✅ Respostas recebidas")
                return response.data;
            })
            .catch((error) => {
                if (error.response) {
                    console.log("❌ Erro ao enviar primeira mensagem -> " + error.response)
                    throw error;
                }
            })
    }

    async function saveChatbotMessage(chatbotMessage: OasisMessage) {
        const tokenJwt = await AsyncStorage.getItem('@oasis-accessToken');
        if (!tokenJwt) return;
        await saveChatbotMessageService(chatbotMessage, tokenJwt)
            .then(() => {
                console.log("✅ Mensagem do escolhida salva")
            })
            .catch((error) => {
                if (error.response) {
                    console.log('erro ao salvar mensagem -> ' + error.response)
                    throw error;
                }
            })
    }

    async function sendMessageToChat(oasisChatId: number, chatbotEnums: number[], message: string){
        const tokenJwt = await AsyncStorage.getItem('@oasis-accessToken')
        if(!tokenJwt || !oasisChatId || !message || !chatbotEnums) return
        return await sendMessageToChatService(oasisChatId, message, chatbotEnums, tokenJwt)
            .then((response) => {
                console.log('✅ Respostas recebidas')
                return response.data
            })
            .catch((error) => {
                if(error.response){
                    console.log('❌ Erro ao enviar mensagem -> ' + error.response)
                    throw error
                }
            })
    }

    return (
        <ChatContext.Provider
            value={{
                chats,
                setChats,
                createNewChat,
                sendFirstMessage,
                chatbotEnums,
                setChatbotEnums,
                saveChatbotMessage,
                sendMessageToChat
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}