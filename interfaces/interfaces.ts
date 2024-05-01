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