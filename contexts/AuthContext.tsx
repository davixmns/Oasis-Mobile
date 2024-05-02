import {createContext, useContext, useEffect, useState} from "react";
import {createUserService, tryLoginService} from "../service/apiService";
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
                await Promise.all([
                    AsyncStorage.setItem('@oasis-user', JSON.stringify(user)),
                    AsyncStorage.setItem('@oasis-accessToken', accessToken),
                    AsyncStorage.setItem('@oasis-refreshToken', refreshToken)
                ])
                //@ts-ignore
                navigation.navigate('MyDrawer')
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