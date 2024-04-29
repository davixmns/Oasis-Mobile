import {ReactNode} from "react";

export interface ProviderProps {
    children: ReactNode
}

export interface OasisUser {
    OasisUserId?: number;
    Name: string;
    Email: string;
    Password?: string;
}