import {ReactNode} from "react";

export interface ProviderProps {
    children: ReactNode
}

export interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    tryLogin: (email: string, password: string) => Promise<void>;
}