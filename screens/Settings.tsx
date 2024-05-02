import React, {useEffect, useRef} from "react";
import {Container, Content} from "./Styles";
import {useNavigation} from "@react-navigation/native";
import {useAuthContext} from "../contexts/AuthContext";
import {Button} from "react-native-paper";
import {Alert, Linking, ScrollView, Text, TouchableOpacity, View} from "react-native";
import styled from "styled-components/native";
import {FontAwesome6} from "@expo/vector-icons";

export default function Settings() {
    const {user, signOut} = useAuthContext()
    const goToLinkendin = () => Linking.openURL('https://www.linkedin.com/in/davi-ximenes-93314a20b/')
    const goToGithub = () => Linking.openURL('https://github.com/davixmns')
    const goToEmail = () => Linking.openURL('mailto:davixmnsl@gmail.com')

    function handleSignOut() {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            {
                text: 'Cancel',
                style: 'cancel'
            },
            {
                text: 'Sign Out',
                onPress: signOut
            }
        ])
    }

    return (
        <SettingsContainer>
            <ScrollContainer>
                <SettingsContent>

                    <OptionsContainer>
                        <SectionTitle>ACCOUNT</SectionTitle>
                        <OptionBox>
                            <OptionBoxContent>
                                <Icon name={'user'}/>
                                <OptionsTitle>User Name</OptionsTitle>
                            </OptionBoxContent>
                            <OptionUserData>{user?.name}</OptionUserData>
                        </OptionBox>
                        <OptionBox>
                            <OptionBoxContent>
                                <Icon name={'envelope'}/>
                                <OptionsTitle>Email</OptionsTitle>
                            </OptionBoxContent>
                            <OptionUserData>{user?.email}</OptionUserData>
                        </OptionBox>
                        <OptionBox>
                            <OptionBoxContent>
                                <Icon name={'square-plus'}/>
                                <OptionsTitle>Subscription</OptionsTitle>
                            </OptionBoxContent>
                            <OptionUserData>Free Plan</OptionUserData>
                        </OptionBox>
                    </OptionsContainer>
                    <OptionsContainer>
                        <SectionTitle>APP</SectionTitle>
                        <OptionBox>
                            <OptionBoxContent>
                                <Icon name={'moon'}/>
                                <OptionsTitle>Color Scheme</OptionsTitle>
                            </OptionBoxContent>
                            <OptionUserData>Dark</OptionUserData>
                        </OptionBox>
                        <OptionBox>
                            <OptionBoxContent>
                                <Icon name={'earth-americas'}/>
                                <OptionsTitle>Main Language</OptionsTitle>
                            </OptionBoxContent>
                            <OptionUserData>English</OptionUserData>
                        </OptionBox>
                    </OptionsContainer>
                    <OptionsContainer>
                        <SectionTitle>DEVELOPER</SectionTitle>
                        <OptionBox>
                            <OptionBoxContent>
                                <Icon name={'at'}/>
                                <OptionsTitle>Davi Ximenes</OptionsTitle>
                            </OptionBoxContent>
                            <OptionUserData>Software Enginner</OptionUserData>
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
                            <OptionsTitle>Sign Out</OptionsTitle>
                        </OptionBoxContent>
                    </SignOutBox>
                </SettingsContent>
            </ScrollContainer>
        </SettingsContainer>
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