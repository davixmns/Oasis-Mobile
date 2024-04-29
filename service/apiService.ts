import axios from "axios";
import {OASIS_API_URL} from "../config";
import {OasisUser} from "../interfaces/interfaces";

const api = axios.create({
    baseURL: OASIS_API_URL,
})

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