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
    chatGptThreadId: string;
    geminiThreadId?: string;
    isNewChat?: boolean;
    messages: OasisMessage[];
}

export interface OasisMessage {
    oasisMessageId?: number;
    oasisChatId: number;
    message: string;
    from: string;
    fromThreadId?: string | null;
    FromMessageId?: string | null;
    createdAt?: string;
    isSaved?: boolean;
}
