import axios from "axios";
import {OASIS_API_URL} from "../config";

const api = axios.create({
    baseURL: OASIS_API_URL,
})

export async function tryLoginService(email: string, password: string){
    return await api.post(
        "Auth/login",
        {
            Email: email,
            Password: password
        }
    )
}