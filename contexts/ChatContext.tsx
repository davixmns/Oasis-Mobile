import {createContext, useContext, useEffect, useState} from "react";
import {ChatbotEnum, OasisChat, OasisMessage, ProviderProps} from "../interfaces/interfaces";
import {useAuthContext} from "./AuthContext";
import {useNavigation} from "@react-navigation/native";

import {
    getAllUserChatsService,
    saveChatbotMessageService,
    sendFirstMessageService,
    sendMessageToChatService
} from "../service/apiService";

interface ChatContextType {
    chats: OasisChat[];
    setChats: (chats: OasisChat[]) => void;
    createNewChat: (fisrtUserMessage: string) => Promise<void>;
    sendFirstMessage: (userMessage: string) => Promise<any>;
    saveChatbotMessage: (chatbotMessage: OasisMessage) => Promise<void>;
    sendMessageToChat: (oasisChatId: number, message: string) => Promise<any>;
    currentChatId: number;
    setCurrentChatId: (id: number) => void;
}

const ChatContext = createContext<ChatContextType>({} as ChatContextType);

export function useChatContext() {
    return useContext(ChatContext);
}

export function ChatProvider({children}: ProviderProps) {
    const {isAuthenticated} = useAuthContext();
    const [chats, setChats] = useState<OasisChat[]>([]);
    const [currentChatId, setCurrentChatId] = useState<number>(-1);
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
        await getAllUserChatsService()
            .then((response) => {
                console.log("✅ Chats carregados")
                let i = 1;
                const chats = response.data.data;
                chats.forEach((chat: OasisChat) => {
                    chat.title = `${i}. ` + chat.title;
                    i++;
                })
                setChats(chats);
            })
            .catch((error) => {
                if (error.response) {
                    console.log("❌ Erro ao buscar chats -> " + error.response.data)
                }
            })
    }

    async function createNewChat(fisrtUserMessage: string) {
        const randomChatId = Math.floor(Math.random() * 1000);
        const newChat: OasisChat = {
            messages: [
                {
                    from: ChatbotEnum.User,
                    message: fisrtUserMessage,
                    oasisChatId: randomChatId,
                    id: 1,
                    createdAt: new Date().toISOString(),
                    isSaved: true,
                }
            ],
            id: randomChatId,
            oasisUserId: 1,
            chatGptThreadId: "",
            geminiThreadId: "",
            title: `${chats.length + 1}. Loading...`,
            isNewChat: true,
            chatBots: [
                {
                    id: 1,
                    oasisChatId: randomChatId,
                    chatbotEnum: ChatbotEnum.ChatGPT,
                    isSelected: true,
                    threadId: ""
                },
                {
                    id: 1,
                    oasisChatId: randomChatId,
                    chatbotEnum: ChatbotEnum.Gemini,
                    isSelected: true,
                    threadId: ""
                }
            ]
        }
        await setChats(currentChats => [...currentChats, newChat]);
        // @ts-ignore
        navigation.navigate(newChat.title, {chatData: newChat});
    }

    async function sendFirstMessage(userMessage: string) {
        return await sendFirstMessageService(userMessage, [ChatbotEnum.ChatGPT, ChatbotEnum.Gemini])
            .then((response) => {
                console.log("✅ Respostas recebidas")
                return response.data.data;
            })
            .catch((error) => {
                if (error.response) {
                    console.log("❌ Erro ao enviar primeira mensagem -> " + error.response)
                    throw error;
                }
            })
    }

    async function saveChatbotMessage(chatbotMessage: OasisMessage) {
        await saveChatbotMessageService(chatbotMessage)
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

    async function sendMessageToChat(oasisChatId: number, message: string) {
        if (!oasisChatId || !message) return
        return await sendMessageToChatService(oasisChatId, message, [ChatbotEnum.ChatGPT, ChatbotEnum.Gemini])
            .then((response) => {
                console.log('✅ Respostas recebidas')
                return response.data.data
            })
            .catch((error) => {
                if (error.response) {
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
                saveChatbotMessage,
                sendMessageToChat,
                currentChatId,
                setCurrentChatId
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}