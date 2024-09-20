import {ChatbotEnum} from "../interfaces/interfaces";

export const ChatBotDicionary: Record<ChatbotEnum, { name: string, image: any }> = {
    [ChatbotEnum.User]: {
        name: 'User',
        image: require('../assets/chatGptLogo.png'),
    },
    [ChatbotEnum.ChatGPT]: {
        name: 'ChatGPT',
        image: require('../assets/chatGptLogo.png'),
    },
    [ChatbotEnum.Gemini]: {
        name: 'Gemini',
        image: require('../assets/geminiLogo.png'),
    },
};