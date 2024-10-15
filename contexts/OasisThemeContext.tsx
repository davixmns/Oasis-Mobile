import {ProviderProps} from "../interfaces/interfaces";
import {createContext, useContext, useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {darkOasisTheme, lightOasisTheme, OasisTheme} from "../styles/Colors";
import {ThemeProvider} from "styled-components";
import {useColorScheme} from "react-native";
import {StatusBar} from "expo-status-bar";

interface ColorSchemeContextType {
    selectedTheme: string
    oasisTheme: OasisTheme
    updateOasisTheme: (newColorScheme: string) => Promise<void>
}

const OasisThemeContext = createContext<ColorSchemeContextType>({} as ColorSchemeContextType);

export function useOasisThemeContext() {
    return useContext(OasisThemeContext);
}

export default function OasisThemeProvider({children}: ProviderProps) {
    const deviceTheme = useColorScheme();
    const [selectedTheme, setSelectedTheme] = useState<string>("system");
    const oasisThemes: Record<string, OasisTheme> = {
        'system': deviceTheme === 'dark' ? darkOasisTheme : lightOasisTheme,
        'light': lightOasisTheme,
        'dark': darkOasisTheme
    }
    const oasisTheme = oasisThemes[selectedTheme];
    const statusBarTheme = selectedTheme === 'system' ? 'auto' : selectedTheme === 'light' ? 'dark' : 'light';

    useEffect(() => {
        getOasisThemeFromStorage()
    }, [deviceTheme]);

    async function getOasisThemeFromStorage() {
        const savedColorScheme = await AsyncStorage.getItem("@oasis-colorScheme")
        if(savedColorScheme !== 'system'){
            setSelectedTheme(savedColorScheme || "light")
        }
    }

    async function updateOasisTheme(newColorScheme: string) {
        setSelectedTheme(newColorScheme)
        await AsyncStorage.setItem("@oasis-colorScheme", newColorScheme)
    }

    return (
        <OasisThemeContext.Provider value={{selectedTheme, oasisTheme, updateOasisTheme}}>
            <ThemeProvider theme={oasisTheme}>
                <StatusBar style={statusBarTheme}/>
                {children}
            </ThemeProvider>
        </OasisThemeContext.Provider>
    )
}