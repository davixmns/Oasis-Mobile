import {ProviderProps} from "../interfaces/interfaces";
import {createContext, useCallback, useContext, useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {darkColorScheme, lightColorScheme, MyColorScheme} from "../styles/Colors";
import {ThemeProvider} from "styled-components";
import {useColorScheme} from "react-native";
import {StatusBar} from "expo-status-bar";

interface ColorSchemeContextType {
    colorScheme: MyColorScheme
    changeColorScheme: (newColorScheme: string) => Promise<void>;
    theme: string;
}

const ColorSchemeContext = createContext<ColorSchemeContextType>({} as ColorSchemeContextType);

export function useColorSchemeContext() {
    return useContext(ColorSchemeContext);
}

export default function ColorSchemeProvider({children}: ProviderProps) {
    const deviceColorScheme = useColorScheme();
    const [colorScheme, setColorScheme] = useState<string>("system");

    const themes: Record<string, MyColorScheme> = {
        'system': deviceColorScheme === 'dark' ? darkColorScheme : lightColorScheme,
        'light': lightColorScheme,
        'dark': darkColorScheme
    }

    const theme = themes[colorScheme]

    useEffect(() => {
        getStorageColorScheme()
    }, [deviceColorScheme]);

    async function getStorageColorScheme() {
        const savedColorScheme = await AsyncStorage.getItem("@oasis-colorScheme")
        if(savedColorScheme !== 'system'){
            setColorScheme(savedColorScheme || "light")
        }
    }

    async function changeColorScheme(newColorScheme: string) {
        setColorScheme(newColorScheme)
        await AsyncStorage.setItem("@oasis-colorScheme", newColorScheme)
    }

    return (
        <ColorSchemeContext.Provider value={{theme: colorScheme, colorScheme: theme, changeColorScheme}}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ColorSchemeContext.Provider>
    )
}