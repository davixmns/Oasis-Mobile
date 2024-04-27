import {createContext, useContext, useState} from "react";
import {tryLoginService} from "../service/apiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AuthContextType, ProviderProps} from "../interfaces/interfaces";


const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function useAuthContext() {
    return useContext(AuthContext)
}

export function AuthProvider({children}: ProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    async function tryLogin(email: string, password: string) {
        await tryLoginService(email, password)
            .then(async (response) => {
                const accessToken = response.data.accessToken
                const refreshToken = response.data.refreshToken

                await AsyncStorage.setItem('@oasis-accessToken', accessToken)
                await AsyncStorage.setItem('@oasis-refreshToken', refreshToken)
            })
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isLoading,
                tryLogin
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}