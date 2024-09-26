import {Container} from "./Styles";
import {useAuthContext} from "../contexts/AuthContext";
import {Alert, Linking, ScrollView, View} from "react-native";
import styled from "styled-components/native";
import {FontAwesome6} from "@expo/vector-icons";
import {useTranslation} from "react-i18next";
import i18n, {changeLanguage} from "../translation/i18n";
import {CustomMenu} from "../components/CustomMenu";
import {PaperProvider} from "react-native-paper";
import {useColorSchemeContext} from "../contexts/ColorSchemeContext";

export default function SettingsScreen() {
    const {theme, changeColorScheme} = useColorSchemeContext();
    const {user, signOut} = useAuthContext()
    const {t} = useTranslation()
    const goToLinkendin = () => Linking.openURL('https://www.linkedin.com/in/davi-ximenes-93314a20b/')
    const goToGithub = () => Linking.openURL('https://github.com/davixmns')
    const goToEmail = () => Linking.openURL('mailto:davixmnsl@gmail.com')
    const languageOptions = [
        { code: 'en', label: t('english') },
        { code: 'pt', label: t('portuguese') },
        { code: 'es', label: t('spanish') },
    ];
    const themeOptions = [
        { code: 'system', label: t('system') },
        { code: 'light', label: t('light') },
        { code: 'dark', label: t('dark') },
    ];
    const selectedLanguage = languageOptions.find(lang => lang.code === i18n.language)?.label || t('english')
    const selectedTheme = themeOptions.find(t => t.code === theme)?.label || t('system')

    function handleSignOut() {
        Alert.alert(t('sign_out_confirmation'), '', [
            {
                text: t('cancel'),
                style: 'cancel'
            },
            {
                text: t('sign_out'),
                onPress: signOut
            }
        ])
    }

    return (
        <PaperProvider>
            <SettingsContainer>
                <ScrollContainer>
                    <SettingsContent>

                        <OptionsContainer>
                            <SectionTitle>{t('account').toUpperCase()}</SectionTitle>
                            <OptionBox>
                                <OptionBoxContent>
                                    <Icon name={'user'}/>
                                    <OptionsTitle>{t('user_name')}</OptionsTitle>
                                </OptionBoxContent>
                                <OptionUserData>{user?.name}</OptionUserData>
                            </OptionBox>
                            <OptionBox>
                                <OptionBoxContent>
                                    <Icon name={'envelope'}/>
                                    <OptionsTitle>E-mail</OptionsTitle>
                                </OptionBoxContent>
                                <OptionUserData>{user?.email}</OptionUserData>
                            </OptionBox>
                            <OptionBox>
                                <OptionBoxContent>
                                    <Icon name={'square-plus'}/>
                                    <OptionsTitle>{t('subscription')}</OptionsTitle>
                                </OptionBoxContent>
                                <OptionUserData>{t('free_plan')}</OptionUserData>
                            </OptionBox>
                        </OptionsContainer>

                        <OptionsContainer>
                            <SectionTitle>{t('app').toUpperCase()}</SectionTitle>
                            <OptionBox>
                                <OptionBoxContent>
                                    <Icon name={'moon'}/>
                                    <OptionsTitle>{t('color_scheme')}</OptionsTitle>
                                </OptionBoxContent>

                                <CustomMenu
                                    selectedOption={selectedTheme}
                                    options={themeOptions.map(option => option.label)}
                                    width={200}
                                    selectOption={async (optionLabel) => {
                                        const selectedOption = themeOptions.find(option => option.label === optionLabel);
                                        if (selectedOption) {
                                            await changeColorScheme(selectedOption.code);
                                        }
                                    }}
                                    anchor={
                                        <LanguageContainer>
                                            <OptionUserData>{selectedTheme}</OptionUserData>
                                            <FontAwesome6 name={'chevron-down'} size={15} color={'#fff'}/>
                                        </LanguageContainer>
                                    }
                                />


                            </OptionBox>
                            <OptionBox>
                                <OptionBoxContent>
                                    <Icon name={'earth-americas'}/>
                                    <OptionsTitle>{t('language')}</OptionsTitle>
                                </OptionBoxContent>
                                <CustomMenu
                                    selectedOption={selectedLanguage}
                                    options={languageOptions.map(option => option.label)}
                                    width={240}
                                    selectOption={(optionLabel) => {
                                        const selectedOption = languageOptions.find(option => option.label === optionLabel);
                                        if (selectedOption) {
                                            changeLanguage(selectedOption.code);
                                        }
                                    }}
                                    anchor={
                                        <LanguageContainer>
                                            <OptionUserData>{selectedLanguage}</OptionUserData>
                                            <FontAwesome6 name={'chevron-down'} size={15} color={'#fff'}/>
                                        </LanguageContainer>
                                    }
                                />

                            </OptionBox>
                        </OptionsContainer>

                        <OptionsContainer>
                            <SectionTitle>{t('developer').toUpperCase()}</SectionTitle>
                            <OptionBox>
                                <OptionBoxContent>
                                    <Icon name={'at'}/>
                                    <OptionsTitle>Davi Ximenes</OptionsTitle>
                                </OptionBoxContent>
                                <OptionUserData>{t('software_engineer')}</OptionUserData>
                            </OptionBox>
                        </OptionsContainer>

                        <SquareContainer>
                            <SquareButton onPress={goToLinkendin}>
                                <FontAwesome6 name={'linkedin'} size={25} color={'#fff'}/>
                            </SquareButton>
                            <SquareButton onPress={goToGithub}>
                                <FontAwesome6 name={'github'} size={25} color={'#fff'}/>
                            </SquareButton>
                            <SquareButton onPress={goToEmail}>
                                <FontAwesome6 name={'envelope'} size={25} color={'#fff'}/>
                            </SquareButton>
                        </SquareContainer>

                        <SignOutBox onPress={handleSignOut}>
                            <OptionBoxContent>
                                <Icon name={'arrow-right-from-bracket'}/>
                                <OptionsTitle>{t('sign_out')}</OptionsTitle>
                            </OptionBoxContent>
                        </SignOutBox>

                    </SettingsContent>
                </ScrollContainer>
            </SettingsContainer>
        </PaperProvider>
    )
}

const Icon = styled(FontAwesome6).attrs({
    size: 18,
    color: '#fff'
})`
    padding: 10px 12px 10px 15px;
`

const SectionTitle = styled.Text`
    color: white;
    font-size: 12px;
    font-weight: 500;
    margin: 0 0 -5px 10px;
`

const OptionsTitle = styled.Text`
    color: white;
    font-size: 15px;
    font-weight: 500;
`

const OptionUserData = styled.Text`
    color: grey;
    font-size: 15px;
    font-weight: 500;
`

const SettingsContainer = styled(Container)`
    background-color: #1a1b1d;
    justify-content: flex-start;
    align-items: center;
`

const ScrollContainer = styled(ScrollView).attrs({
    contentContainerStyle: {
        backgroundColor: '#1a1b1d',
        flex: 1,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
    }
})``

const SettingsContent = styled.View`
    width: 90%;
    margin-top: 20px;
    gap: 25px;
`

const OptionsContainer = styled.View`
    width: 100%;
    gap: 10px;
    border-radius: 10px;
`

const OptionBox = styled.View`
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: row;
    background-color: #2c2c2e;
    border-radius: 10px;
    justify-content: space-between;
    padding-right: 15px;
`

const SignOutBox = styled.TouchableOpacity`
    display: flex;
    align-items: center;
    flex-direction: row;
    background-color: #2c2c2e;
    border-radius: 10px;
    justify-content: space-between;
    padding-right: 15px;
`

const OptionBoxContent = styled.View`
    display: flex;
    align-items: center;
    flex-direction: row;
`

const SquareContainer = styled.View`
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-between;
    margin-top: -15px;
    width: 100%;
`

const SquareButton = styled.TouchableOpacity`
    width: 30%;
    height: 50px;
    background-color: #2c2c2e;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
`

const LanguageContainer = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    padding: 10px 0 10px 0;
`