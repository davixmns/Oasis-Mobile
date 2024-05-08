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
        const accessToken = await AsyncStorage.getItem('@oasis-accessToken')
        if (!accessToken){
            console.log("No Access Token finded")
            setIsAuthenticated(false)
            setIsLoading(false)
            return
        }
        await verifyAccessTokenService(accessToken)
            .then((response) => {
                setIsAuthenticated(true)
                const responseUser = response.data.data
                setUser(responseUser)
            })
            .catch(() => {
                console.log("Access Token expired")
                setIsAuthenticated(false)
            })
            .finally(async () => {
                await new Promise((resolve) => setTimeout(resolve, 1000))
                setIsLoading(false)
            })
    }

    async function tryLogin(email: string, password: string) {
        if (email === '' || password === '') return
        await tryLoginService(email, password)
            .then(async (response) => {
                const data = response.data.data
                const accessToken = data.accessToken
                const refreshToken = data.refreshToken
                const user: OasisUser = data.oasisUser
                setUser(user)
                await Promise.all([
                    AsyncStorage.setItem('@oasis-user', JSON.stringify(user)),
                    AsyncStorage.setItem('@oasis-accessToken', accessToken),
                    AsyncStorage.setItem('@oasis-refreshToken', refreshToken)
                ])
                setIsAuthenticated(true)
            })
    }

    async function createUser(user: OasisUser) {
        await createUserService(user)
            .then(async () => {
                await tryLogin(user.email, user.password!)
            })
            .catch((error) => {
                throw error
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