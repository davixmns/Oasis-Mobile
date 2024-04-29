import {createContext, useContext, useEffect, useState} from "react";
import {createUserService, tryLoginService} from "../service/apiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {OasisUser, ProviderProps} from "../interfaces/interfaces";

interface AuthContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
    isLoading: boolean;
    setIsLoading: (value: boolean) => void;
    tryLogin: (email: string, password: string) => Promise<void>;
    createUser: (user: OasisUser) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function useAuthContext() {
    return useContext(AuthContext)
}

export function AuthProvider({children}: ProviderProps) {
    const [user, setUser] = useState<OasisUser | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        async function checkAuthentication() {
            await new Promise(resolve => setTimeout(resolve, 1000))
            setIsLoading(false)
        }

        checkAuthentication()
    }, []);

    async function tryLogin(email: string, password: string) {
        if (email === '' || password === '') return
        await tryLoginService(email, password)
            .then(async (response) => {
                const data = response.data.data
                const accessToken = data.accessToken
                const refreshToken = data.refreshToken
                await AsyncStorage.setItem('@oasis-accessToken', accessToken)
                await AsyncStorage.setItem('@oasis-refreshToken', refreshToken)
                setIsAuthenticated(true)
            })
    }

    async function createUser(user: OasisUser) {
        await createUserService(user)
            .then(() => {
                setIsAuthenticated(true)
            })
            .catch((error) => {
                throw error
            })
    }


    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                setIsAuthenticated,
                isLoading,
                setIsLoading,
                tryLogin,
                createUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}