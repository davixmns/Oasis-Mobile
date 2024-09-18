import {OasisUser} from "../interfaces/interfaces";
import * as Haptics from 'expo-haptics';
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const backgroundColors = [
    'rgba(0, 0, 255, 1)', // Blue
    'rgba(75, 0, 130, 1)', // Indigo
    'rgba(255, 165, 0, 1)', // Orange
    'rgba(255, 255, 0, 1)', // Yellow
    'rgba(0, 128, 0, 1)', // Green
    'rgba(255, 50, 100, 1)', // Red
    'rgba(0, 255, 255, 1)', // Cyan
    'rgba(128, 0, 0, 1)', // Maroon
    'rgba(255, 192, 203, 1)', // Pink
    'rgba(255, 255, 255, 1)', // White
    'rgba(0, 0, 0, 1)', // Black
    'rgba(128, 128, 128, 1)', // Gray
    'rgba(255, 0, 255, 1)', // Magenta
    'rgba(128, 0, 128, 1)', // Purple
    'rgba(0, 255, 0, 1)'  // Lime
];

export const textColors = [
    'rgba(255, 165, 0, 1)', // Orange for Blue
    'rgba(0, 128, 0, 1)', // Green for White
    'rgba(255, 0, 0, 1)', // Red for Green
    'rgba(0, 255, 255, 1)', // Cyan for Red
    'rgba(128, 0, 128, 1)', // Purple for Yellow
    'rgba(0, 0, 128, 1)', // Navy for Orange
    'rgba(255, 50, 100, 1)', // Redish for Cyan
    'rgba(255, 255, 0, 1)', // Yellow for Indigo
    'rgba(0, 255, 0, 1)', // Lime for Maroon
    'rgba(0, 0, 255, 1)', // Blue for Pink
    'rgba(255, 255, 255, 1)', // White for Black
    'rgba(255, 0, 255, 1)', // Magenta for Gray
    'rgba(255, 255, 0, 1)', // Yellow for Magenta
    'rgba(0, 255, 255, 1)', // Cyan for Purple
    'rgba(128, 0, 0, 1)'  // Maroon for Lime
];

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

export function lowVibration() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
}

export function mediumVibration() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
}

export enum ChatbotEnum {
    ChatGPT = 0,
    Gemini = 1
}