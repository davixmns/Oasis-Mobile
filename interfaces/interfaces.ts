import {ReactNode} from "react";

export interface ProviderProps {
    children: ReactNode
}

export enum ChatbotEnum {
    User,
    ChatGPT,
    Gemini
}

export interface OasisUser {
    id?: number;
    name: string;
    email: string;
    password?: string;
}

export interface OasisChat {
    id: number;
    oasisUserId: number;
    title?: string;
    chatGptThreadId: string;
    geminiThreadId?: string;
    isNewChat?: boolean;
    messages: OasisMessage[];
    chatBots: OasisChatBotDetails[];
}

export interface OasisChatBotDetails {
    id: number;
    oasisChatId: number;
    chatbotEnum: ChatbotEnum;
    isActive: boolean;
    threadId: string;
}

export interface ChatBotMessage {
    message: string;
    chatBotEnum: ChatbotEnum;
}

export interface ChatBotOptionToChoose {
    isActive: boolean;
    message: ChatBotMessage;
}

export interface OasisMessage {
    id?: number;
    oasisChatId: number;
    message: string;
    chatBotEnum: ChatbotEnum;
    createdAt?: string;
    isSaved?: boolean;
}
