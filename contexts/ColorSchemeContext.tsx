import {ProviderProps} from "../interfaces/interfaces";
import {createContext, useContext, useEffect, useState} from "react";
import {useColorScheme} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {darkColorScheme, lightColorScheme, MyColorScheme} from "../styles/Colors";
import {ThemeProvider} from "styled-components";

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
    const [colorScheme, setColorScheme] = useState<string>("light");

    async function getDeviceColorScheme() {
        const savedColorScheme = await AsyncStorage.getItem("@oasis-colorScheme")
        if (savedColorScheme) {
            setColorScheme(savedColorScheme)
        } else {
            setColorScheme(deviceColorScheme?.toString() || "light")
        }
    }

    async function changeColorScheme(newColorScheme: string) {
        await AsyncStorage.setItem("@oasis-colorScheme", newColorScheme)
        setColorScheme(newColorScheme)
    }

    useEffect(() => {
        getDeviceColorScheme()
    }, []);

    const theme: MyColorScheme = colorScheme === "light" ? lightColorScheme : darkColorScheme;

    return (
        <ColorSchemeContext.Provider value={{theme: colorScheme, colorScheme: theme, changeColorScheme}}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ColorSchemeContext.Provider>
    )
}