import {Container} from "./Styles";
import {useAuthContext} from "../contexts/AuthContext";
import {Alert, Linking, ScrollView, View} from "react-native";
import styled from "styled-components/native";
import {FontAwesome6} from "@expo/vector-icons";
import {useTranslation} from "react-i18next";
import i18n, {changeLanguage} from "../translation/i18n";
import {CustomMenu} from "../components/CustomMenu";
import {PaperProvider} from "react-native-paper";
import {useOasisThemeContext} from "../contexts/OasisThemeContext";

export default function SettingsScreen() {
    const {selectedTheme, updateOasisTheme} = useOasisThemeContext();
    const {user, signOut} = useAuthContext()
    const {t} = useTranslation()
    const goToLinkendin = () => Linking.openURL('https://www.linkedin.com/in/davi-ximenes-93314a20b/')
    const goToGithub = () => Linking.openURL('https://github.com/davixmns')
    const goToEmail = () => Linking.openURL('mailto:davixmnsl@gmail.com')
    const languageOptions = [
        {code: 'en', label: t('english')},
        {code: 'pt', label: t('portuguese')},
        {code: 'es', label: t('spanish')},
    ];
    const themeOptions = [
        {code: 'system', label: t('system')},
        {code: 'light', label: t('light')},
        {code: 'dark', label: t('dark')},
    ];
    const selectedLanguage = languageOptions.find(lang => lang.code === i18n.language)?.label || t('english')
    const currentTheme = themeOptions.find(t => t.code === selectedTheme)?.label || t('system')

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
                <SettingsScroll>
                    <SettingsContent>

                        <OptionsContainer>
                            <SectionTitle>{t('account').toUpperCase()}</SectionTitle>

                            <OptionsContent>
                                <OptionBox>
                                    <OptionBoxContent>
                                        <SettingIcon name={'user'}/>
                                        <OptionsTitle>{t('user_name')}</OptionsTitle>
                                    </OptionBoxContent>
                                    <OptionUserData>{user?.name}</OptionUserData>
                                </OptionBox>

                                <OptionBox style={{borderTopWidth: 0.2, borderTopColor: '#626262'}}>
                                    <OptionBoxContent>
                                        <SettingIcon name={'envelope'}/>
                                        <OptionsTitle>E-mail</OptionsTitle>
                                    </OptionBoxContent>
                                    <OptionUserData>{user?.email}</OptionUserData>
                                </OptionBox>

                                <OptionBox style={{borderTopWidth: 0.2, borderTopColor: '#626262'}}>
                                    <OptionBoxContent>
                                        <SettingIcon name={'square-plus'}/>
                                        <OptionsTitle>{t('subscription')}</OptionsTitle>
                                    </OptionBoxContent>
                                    <OptionUserData>{t('free_plan')}</OptionUserData>
                                </OptionBox>
                            </OptionsContent>
                        </OptionsContainer>

                        <OptionsContainer>
                            <SectionTitle>{t('app').toUpperCase()}</SectionTitle>
                            <OptionsContent>

                                <OptionBox>
                                    <OptionBoxContent>
                                        <SettingIcon name={'moon'}/>
                                        <OptionsTitle>{t('color_scheme')}</OptionsTitle>
                                    </OptionBoxContent>

                                    <CustomMenu
                                        selectedOption={currentTheme}
                                        options={themeOptions.map(option => option.label)}
                                        width={240}
                                        selectOption={async (optionLabel) => {
                                            const selectedOption = themeOptions.find(option => option.label === optionLabel);
                                            if (selectedOption) {
                                                await updateOasisTheme(selectedOption.code);
                                            }
                                        }}
                                        anchor={
                                            <LanguageContainer>
                                                <OptionUserData>{currentTheme}</OptionUserData>
                                                <FontAwesome6 name={'chevron-down'} size={15} color={'grey'}/>
                                            </LanguageContainer>
                                        }
                                    />
                                </OptionBox>

                                <OptionBox style={{borderTopWidth: 0.2, borderTopColor: '#626262'}}>
                                    <OptionBoxContent>
                                        <SettingIcon name={'earth-americas'}/>
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
                                                <FontAwesome6 name={'chevron-down'} size={15} color={'grey'}/>
                                            </LanguageContainer>
                                        }
                                    />
                                </OptionBox>

                            </OptionsContent>
                        </OptionsContainer>

                        <OptionsContainer>
                            <SectionTitle>SESSION</SectionTitle>
                            <OptionsContent>
                                <SignOutOptionBox onPress={handleSignOut}>
                                    <OptionBoxContent>
                                        <SettingIcon name={'arrow-right-from-bracket'}/>
                                        <OptionsTitle>{t('sign_out')}</OptionsTitle>
                                    </OptionBoxContent>
                                    <OptionUserData/>
                                </SignOutOptionBox>
                            </OptionsContent>
                        </OptionsContainer>

                        <OptionsContainer style={{marginTop: 10}}>
                            <SectionTitle>{t('developer').toUpperCase()}</SectionTitle>
                            <OptionBox>
                                <OptionBoxContent>
                                    <SettingIcon name={'at'} style={{paddingLeft: 10}}/>
                                    <OptionsTitle>Davi Ximenes</OptionsTitle>
                                </OptionBoxContent>
                                <OptionUserData>{t('software_engineer')}</OptionUserData>
                            </OptionBox>
                        </OptionsContainer>

                        <SquareContainer>
                            <SquareButton onPress={goToLinkendin}>
                                <MediaIcon name={'linkedin'}/>
                            </SquareButton>
                            <SquareButton onPress={goToGithub}>
                                <MediaIcon name={'github'}/>
                            </SquareButton>
                            <SquareButton onPress={goToEmail}>
                                <MediaIcon name={'envelope'}/>
                            </SquareButton>
                        </SquareContainer>


                    </SettingsContent>
                </SettingsScroll>
            </SettingsContainer>
        </PaperProvider>
    )
}

const MediaIcon = styled(FontAwesome6).attrs({
    size: 25,
})`
    color: ${props => props.theme.primaryText};
`

const SettingIcon = styled(FontAwesome6).attrs({
    size: 18,
})`
    color: ${props => props.theme.primaryText};
    padding: 10px 12px 10px 18px;
`

const SectionTitle = styled.Text`
    color: ${props => props.theme.secondaryText};
    font-size: 12px;
    font-weight: 500;
    margin: 0 0 -5px 10px;
`

const OptionsTitle = styled.Text`
    color: ${props => props.theme.primaryText};
    font-size: 15px;
`

const OptionUserData = styled.Text`
    color: grey;
    font-size: 15px;
`

const SettingsContainer = styled(Container)`
    background-color: ${props => props.theme.settingsBackground};
    justify-content: flex-start;
    align-items: center;
`

const SettingsScroll = styled(ScrollView).attrs({
    contentContainerStyle: {
        flex: 1,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
    }
})``

const SettingsContent = styled.View`
    width: 90%;
    gap: 25px;
`

const OptionsContainer = styled.View`
    width: 100%;
    gap: 10px;
`

const OptionsContent = styled.View`
    width: 100%;
    background-color: ${props => props.theme.settingsItemBackground};
    border-radius: 10px;
`

const OptionBox = styled.View`
    width: 100%;
    height: 45px;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    padding-right: 15px;
`

const SignOutOptionBox = styled.TouchableOpacity`
    width: 100%;
    height: 45px;
    display: flex;
    align-items: center;
    flex-direction: row;
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
    flex: 1;
    height: 50px;
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