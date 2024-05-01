import {Container, Content} from "./Styles";
import {ActivityIndicator} from "react-native";
import React from "react";
import styled from "styled-components/native";

export function Splash() {
    return (
        <Container style={{backgroundColor: '#000'}}>
            <Content style={{alignItems: 'flex-start'}}>
                <OasisTitle style={{color: '#fff'}}>Oasis</OasisTitle>
                <ActivityIndicator size={'large'} color={'#fff'} style={{paddingTop: 10, paddingLeft: 5}}/>
            </Content>
        </Container>
    );
}

const OasisTitle = styled.Text`
  font-size: 70px;
  font-weight: 600;
`

const OasisSubtitle = styled.Text`
  font-size: 30px;
  font-weight: 600;
`