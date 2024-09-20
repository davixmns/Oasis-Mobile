import {OasisUser} from "../interfaces/interfaces";

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function verifyEmail(email: string) {
    return emailRegex.test(email)
}

export function verifyUser(user: OasisUser) {
    let array = []
    user.name.length > 3 ? array.push(true) : array.push(false)
    verifyEmail(user.email) ? array.push(true) : array.push(false)
    user.password?.length! > 7  ? array.push(true) : array.push(false)
    return array;
}