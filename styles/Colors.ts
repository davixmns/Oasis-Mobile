export interface MyColorScheme {
    primaryBackground: string;
    secondaryBackground: string;

    primaryText: string;
    secondaryText: string;
}

export const Themes = [
    "light",
    "dark",
]

export const darkColorScheme: MyColorScheme = {
    primaryBackground: '#000',
    secondaryBackground: '#1e1e1e',
    primaryText: '#fff',
    secondaryText: '#949494',
}

export const lightColorScheme: MyColorScheme = {
    primaryBackground: '#fff',
    secondaryBackground: '#F6F6F6',
    primaryText: '#000',
    secondaryText: '#949494',
}