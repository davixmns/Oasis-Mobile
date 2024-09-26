import { createContext, useContext, useEffect, useState } from "react";
import { ChatbotEnum, OasisChat, OasisMessage, ProviderProps } from "../interfaces/interfaces";
import { useAuthContext } from "./AuthContext";
import { useNavigation } from "@react-navigation/native";

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
    startConversationWithChatBots: (userMessage: string) => Promise<any>;
    saveChatbotMessage: (chatbotMessage: OasisMessage) => Promise<void>;
    sendMessageToChat: (oasisChatId: number, message: string) => Promise<any>;
    getAllChats: () => Promise<void>;
    focusedScreen: string;
    setFocusedScreen: (screen: string) => void;
}

const ChatContext = createContext<ChatContextType>({} as ChatContextType);

export function useChatContext() {
    return useContext(ChatContext);
}

export function ChatProvider({ children }: ProviderProps) {
    const { isAuthenticated } = useAuthContext();
    const navigation = useNavigation();
    const [chats, setChats] = useState<OasisChat[]>([]);
    const [focusedScreen, setFocusedScreen] = useState<string>("");

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
                const chats: OasisChat[] = response.data.data;
                setChats(chats);
                console.log("✅ Chats carregados");
            })
            .catch((error) => {
                if (error.response) {
                    console.log("❌ Erro ao buscar chats -> " + error.response.data);
                }
            });
    }

    async function createNewChat(fisrtUserMessage: string) {
        const randomChatId = Math.floor(Math.random() * 1000);
        const newChat: OasisChat = {
            messages: [
                {
                    chatBotEnum: ChatbotEnum.User,
                    message: fisrtUserMessage,
                    oasisChatId: randomChatId,
                    id: 1,
                    createdAt: new Date().toISOString(),
                    isSaved: true,
                },
            ],
            id: randomChatId,
            updatedAt: new Date().toISOString(),
            oasisUserId: 1,
            chatGptThreadId: "",
            geminiThreadId: "",
            title: "Loading..." + " ".repeat(Math.floor(Math.random() * 10)),
            isNewChat: true,
            chatBots: [
                {
                    id: 234,
                    oasisChatId: randomChatId,
                    chatbotEnum: ChatbotEnum.ChatGPT,
                    isActive: true,
                    threadId: "",
                },
                {
                    id: 864,
                    oasisChatId: randomChatId,
                    chatbotEnum: ChatbotEnum.Gemini,
                    isActive: true,
                    threadId: "",
                },
            ],
        };
        await setChats((currentChats) => [...currentChats, newChat]);
        // @ts-ignore
        navigation.navigate("Chat_" + newChat.id, { chatData: newChat });
    }

    async function startConversationWithChatBots(userMessage: string) {
        return await sendFirstMessageService(userMessage)
            .then(async (response) => {
                return response.data;
            })
            .catch((error) => {
                if (error.response) {
                    console.log("❌ Erro ao enviar primeira mensagem -> " + error.response);
                    throw error;
                }
            });
    }

    async function saveChatbotMessage(chatbotMessage: OasisMessage) {
        await saveChatbotMessageService(chatbotMessage)
            .then(() => {
                console.log("✅ Mensagem escolhida salva");
            })
            .catch((error) => {
                if (error.response) {
                    console.log("erro ao salvar mensagem -> " + error.response);
                    throw error;
                }
            });
    }

    async function sendMessageToChat(oasisChatId: number, message: string) {
        if (!oasisChatId || !message) return;
        return await sendMessageToChatService(oasisChatId, message)
            .then((response) => {
                console.log("✅ Respostas recebidas");
                return response.data.data;
            })
            .catch((error) => {
                if (error.response) {
                    console.log("❌ Erro ao enviar mensagem -> " + error.response);
                    throw error;
                }
            });
    }

    return (
        <ChatContext.Provider
            value={{
                chats,
                setChats,
                createNewChat,
                startConversationWithChatBots,
                saveChatbotMessage,
                sendMessageToChat,
                getAllChats,
                focusedScreen,
                setFocusedScreen,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}
