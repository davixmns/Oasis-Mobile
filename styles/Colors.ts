export interface MyColorScheme {
    primaryBackground: string;
    secondaryBackground: string;
    settingsBackground: string;
    settingsItemBackground: string

    loadingBackground: string;
    loadingHighlight: string;

    inactiveOptionCard: string;
    activeOptionCard: string;

    primaryText: string;
    secondaryText: string;
}

export const darkColorScheme: MyColorScheme = {
    primaryBackground: '#000',
    secondaryBackground: '#1e1e1e',

    settingsBackground: '#1e1e1e',
    settingsItemBackground: '#2c2c2c',

    loadingBackground: '#202020',
    loadingHighlight: '#333333',

    inactiveOptionCard: '#1e1e1e',
    activeOptionCard: '#2c2c2c',

    primaryText: '#fff',
    secondaryText: '#949494',
}

export const lightColorScheme: MyColorScheme = {
    primaryBackground: '#fff',
    secondaryBackground: '#f1f1f1',
    settingsBackground: '#f2f2f7',
    settingsItemBackground: '#fff',

    loadingBackground: '#e6e6e6',
    loadingHighlight: '#dfdfdf',

    inactiveOptionCard: '#d8d8d8',
    activeOptionCard: '#ececec',

    primaryText: '#222222',
    secondaryText: '#949494',
}