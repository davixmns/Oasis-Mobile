import {createContext, useContext, useEffect, useState} from "react";
import {createUserService, tryLoginService, verifyAccessTokenService} from "../service/apiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {OasisUser, ProviderProps} from "../interfaces/interfaces";
import {useNavigation} from "@react-navigation/native";

interface AuthContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
    isLoading: boolean;
    setIsLoading: (value: boolean) => void;
    tryLogin: (email: string, password: string) => Promise<void>;
    createUser: (user: OasisUser) => Promise<void>;
    user: OasisUser | null;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function useAuthContext() {
    return useContext(AuthContext)
}

export function AuthProvider({children}: ProviderProps) {
    const [user, setUser] = useState<OasisUser | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const navigation = useNavigation()

    useEffect(() => {
        verifyAccessToken()
    }, []);

    async function verifyAccessToken() {
        await verifyAccessTokenService()
            .then((response) => {
                console.log("✅ Token valido")
                setIsAuthenticated(true)
                const userData = response.data.data
                setUser(userData)
            })
            .catch(() => {
                console.log("⚠️ Token invalido")
                setIsAuthenticated(false)
            })
            .finally(async () => {
                // await new Promise((resolve) => setTimeout(resolve, 1000))
                setIsLoading(false)
            })
    }

    async function tryLogin(email: string, password: string) {
        if (email === '' || password === '') return
        await tryLoginService(email, password)
            .then(async (response) => {
                console.log("✅ Login efetuado")
                const data = response.data.data;
                setUser(data.refreshToken)
                await AsyncStorage.setItem('@oasis-user', JSON.stringify(user))
                await AsyncStorage.setItem('@oasis-accessToken', data.accessToken)
                await AsyncStorage.setItem('@oasis-refreshToken', data.refreshToken)
                setIsAuthenticated(true)
            })
            .catch((error) => {
                if (error.response) {
                    console.log("❌ Erro ao logar -> " + error.response.data.message)
                    throw error
                }
            })
    }

    async function createUser(user: OasisUser) {
        await createUserService(user)
            .then(async () => {
                console.log("✅ Usuario criado")
                await tryLogin(user.email, user.password!)
            })
            .catch((error) => {
                if (error.response) {
                    console.log("❌ Erro ao criar usuario -> " + error.response.data.message)
                    throw error
                }
            })
    }

    async function signOut() {
        setIsAuthenticated(false)
        setUser(null)
        await AsyncStorage.removeItem('@oasis-user')
        await AsyncStorage.removeItem('@oasis-accessToken')
        await AsyncStorage.removeItem('@oasis-refreshToken')
        navigation.reset({
            index: 0,
            // @ts-ignore
            routes: [{name: 'Login'}]
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
                user,
                signOut
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}