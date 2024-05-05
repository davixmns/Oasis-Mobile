import {createContext, useContext, useEffect, useState} from "react";
import {OasisChat, ProviderProps} from "../interfaces/interfaces";
import {getAllChatsService} from "../service/apiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useAuthContext} from "./AuthContext";

interface ChatContextType {
    chats: OasisChat[];
    createNewChat: (newChat: OasisChat) => void;
}

const ChatContext = createContext<ChatContextType>({} as ChatContextType);

export function useChatContext() {
    return useContext(ChatContext);
}

export function ChatProvider({children}: ProviderProps) {
    const {isAuthenticated} = useAuthContext();
    const [chats, setChats] = useState<OasisChat[]>([]);

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
        if (!tokenjwt) return
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

    async function createNewChat(newChat: OasisChat) {
        setChats([...chats, newChat]);
    }

    return (
        <ChatContext.Provider
            value={{
                chats,
                createNewChat
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}