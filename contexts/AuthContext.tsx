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
    user: OasisUser | null;
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
            const accessToken = await AsyncStorage.getItem('@oasis-accessToken')
            const refreshToken = await AsyncStorage.getItem('@oasis-refreshToken')
            const oasisUser = await AsyncStorage.getItem('@oasis-user')

            if (accessToken && refreshToken && oasisUser) {
                setIsAuthenticated(true)
                setIsLoading(false)
                setUser(JSON.parse(oasisUser))
            }
            setIsLoading(false)
        }

        checkAuthentication()
    }, []);

    async function tryLogin(email: string, password: string) {
        if (email === '' || password === '') return
        await tryLoginService(email, password)
            .then(async (response) => {
                setIsAuthenticated(true)
                const data = response.data.data
                const accessToken = data.accessToken
                const refreshToken = data.refreshToken
                const user: OasisUser = data.oasisUser
                setUser(user)
                await AsyncStorage.setItem('@oasis-user', JSON.stringify(user))
                await AsyncStorage.setItem('@oasis-accessToken', accessToken)
                await AsyncStorage.setItem('@oasis-refreshToken', refreshToken)
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
                createUser,
                user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}