import React, {useEffect, useRef} from "react";
import {Container, Content} from "./Styles";
import {useNavigation} from "@react-navigation/native";
import {useAuthContext} from "../contexts/AuthContext";
import {Button} from "react-native-paper";
import {Text, TouchableOpacity, View} from "react-native";
import styled from "styled-components/native";
import {FontAwesome6} from "@expo/vector-icons";

export default function Settings() {
    const {user} = useAuthContext()
    const navigation = useNavigation()

    return (
        <SettingsContainer>
            <SettingsContent>
                <SectionTitle>ACCOUNT</SectionTitle>
                <OptionsContainer>
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
                </OptionsContainer>
            </SettingsContent>
        </SettingsContainer>
    )
        ;
}

const Icon = styled(FontAwesome6).attrs({
    size: 18,
    color: '#fff'
})`
  padding: 10px 15px 10px 15px;
`

const SectionTitle = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: 500;
  margin: 0 0 10px 10px;
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
  background-color: #212121;
  justify-content: flex-start;
  align-items: center;
`

const SettingsContent = styled(Content)`
  margin-top: 50px;
  align-items: flex-start;
`

const OptionsContainer = styled.View`
  width: 100%;
  gap: 10px;
  border-radius: 10px;
`

const OptionBox = styled.View`
  width: 99%;
  display: flex;
  align-items: center;
  flex-direction: row;
  background-color: #2e2e2e;
  border-radius: 10px;
  justify-content: space-between;
  padding-right: 15px;
`

const OptionBoxContent = styled.View`
  display: flex;
  align-items: center;
  flex-direction: row;
`