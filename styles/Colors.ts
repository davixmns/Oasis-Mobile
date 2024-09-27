export interface MyColorScheme {
    primaryBackground: string;
    secondaryBackground: string;
    settingsBackground: string;
    settingsItemBackground?: string

    primaryText: string;
    secondaryText: string;
}

export const darkColorScheme: MyColorScheme = {
    primaryBackground: '#000',
    secondaryBackground: '#1e1e1e',
    settingsBackground: '#1e1e1e',
    settingsItemBackground: '#2c2c2c',

    primaryText: '#fff',
    secondaryText: '#949494',
}

export const lightColorScheme: MyColorScheme = {
    primaryBackground: '#fff',
    secondaryBackground: '#f1f1f1',
    settingsBackground: '#f2f2f7',
    settingsItemBackground: '#fff',

    primaryText: '#000',
    secondaryText: '#949494',
}