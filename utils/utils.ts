export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function verifyEmail(email: string) {
    return emailRegex.test(email);
}