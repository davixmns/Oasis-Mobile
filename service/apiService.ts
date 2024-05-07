import axios from "axios";
import {OASIS_API_URL} from "../config";
import {OasisUser} from "../interfaces/interfaces";

const api = axios.create({
    baseURL: OASIS_API_URL,
})

export async function verifyAccessTokenService(tokenJwt: string) {
    return await api.get(
        "/Auth/verifyAccessToken",
        {
            headers: {
                Authorization: `Bearer ${tokenJwt}`
            }
        }
    )
}

export async function tryLoginService(email: string, password: string) {
    return await api.post(
        "/Auth/login",
        {
            Email: email,
            Password: password
        }
    )
}

export async function createUserService(newUser: OasisUser) {
    return await api.post(
        "/User",
        newUser
    )
}

export async function getAllChatsService(tokenJwt: string) {
    return await api.get(
        "/Chat/GetAllChats",
        {
            headers: {
                Authorization: `Bearer ${tokenJwt}`
            }
        }
    )
}

export async function sendFirstMessageService(userMessage: string, chatbotEnums: number[], tokenJwt: string) {

    return await api.post(
        "/Chat/SendFirstMessage",
        {
            Message: userMessage,
            ChatbotEnums: chatbotEnums
        },
        {
            headers: {
                Authorization: `Bearer ${tokenJwt}`
            }
        }
    )
}