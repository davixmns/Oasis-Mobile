import {ReactNode} from "react";

export interface ProviderProps {
    children: ReactNode
}

export interface OasisUser {
    oasisUserId?: number;
    name: string;
    email: string;
    password?: string;
}

export interface OasisChat {
    oasisChatId: number;
    oasisUserId: number;
    title?: string;
    chatgptThreadId: string;
    geminiThreadId?: string;
    messages: OasisMessage[];
}

export interface OasisMessage {

}
