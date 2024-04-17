import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Animated, Text, View, StyleSheet} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import styled from 'styled-components/native';
import {MyTextField} from "../components/MyTextField";
import {MyButton} from "../components/MyButton";
import {verifyEmail} from "../utils/utils";

export function Login() {
    const animatedColor = useRef(new Animated.Value(0)).current;
    const [signInEmail, setSignInEmail] = useState('');
    const [signInPassword, setSignInPassword] = useState('');
    const [name, setName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [activeScreen, setActiveScreen] = useState('signIn');

    const snapPoints = useMemo(() => ['27%', '40%', '65%', '75%', '95%'], []);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [emailIsCorrect, setEmailIsCorrect] = useState<boolean | null>(null);
    const colors = [
        'rgba(255, 165, 0, 1)', // Orange
        'rgba(255, 50, 100, 1)', // Red
        'rgba(255, 255, 0, 1)', // Yellow
        'rgba(0, 128, 0, 1)', // Green
        'rgba(0, 0, 255, 1)', // Blue
        'rgba(75, 0, 130, 1)', // Indigo
        'rgba(0, 255, 255, 1)', // Cyan
        'rgba(128, 0, 0, 1)' // Maroon
    ];

    useEffect(() => {
        Animated.loop(
            Animated.timing(animatedColor, {
                toValue: 7, // The final value now corresponds to the last color
                duration: 30000, // Adjust the total duration to handle more colors smoothly
                useNativeDriver: false
            })
        ).start();
    }, [animatedColor]);

    const backgroundColor = animatedColor.interpolate({
        inputRange: [0, 1, 2, 3, 4, 5, 6, 7],
        outputRange: colors
    });

    const textColor = animatedColor.interpolate({
        inputRange: [0, 1, 2, 3, 4, 5, 6, 7],
        outputRange: colors.reverse()
    });

    function openBottomSheet(index: number) {
        bottomSheetRef.current?.snapToIndex(index);
    }

    function closeBottomSheet(index: number) {
        bottomSheetRef.current?.snapToIndex(index);
    }

    function onChangeEmail(text: string) {
        setSignInEmail(text);
        setEmailIsCorrect(verifyEmail(text));
    }

    return (
        <AnimatedContainer style={{backgroundColor}}>
            <Content>
                <AnimatedTitle style={{color: textColor}}>Oasis</AnimatedTitle>
                <AnimatedSubtitle style={{color: textColor}}>Your personal AI MultiChat</AnimatedSubtitle>
            </Content>
            <BottomSheet
                snapPoints={snapPoints}
                index={3}
                ref={bottomSheetRef}
                backgroundComponent={({style}) => (
                    <View style={[{
                        backgroundColor: 'black',
                        borderRadius: 40
                    }, style]}/>
                )}
            >
                <BottomSheetContainer>
                    {activeScreen === 'signIn' && (

                        <BottomSheetContent>
                            <RegisterTitleContainer>
                                <RegisterTitle>Sign In</RegisterTitle>
                            </RegisterTitleContainer>
                            <MyTextField
                                placeholder={'Email'}
                                value={signInEmail}
                                keyboardType={'email-address'}
                                onChangeText={onChangeEmail}
                                onFocus={() => openBottomSheet(2)}
                                onSubmitEditing={() => closeBottomSheet(0)}
                                iconName={'envelope'}
                                isCorrect={emailIsCorrect}
                            />
                            <MyTextField
                                placeholder={'Password'}
                                value={signInPassword}
                                onChangeText={setSignInPassword}
                                secureTextEntry={true}
                                onFocus={() => openBottomSheet(2)}
                                onSubmitEditing={() => closeBottomSheet(0)}
                                iconName={'lock'}
                            />
                            <ButtonsContainer>
                                <ButtonBox>
                                    <MyButton
                                        bgColor={'#fff'}
                                        textColor={'#000'}
                                        onPress={() => console.log('Login')}
                                    >
                                        Sign In
                                    </MyButton>
                                </ButtonBox>
                                <ButtonBox>
                                    <MyButton
                                        bgColor={'transparent'}
                                        textColor={'#fff'}
                                        style={{
                                            borderStyle: 'solid',
                                            borderWidth: 1,
                                            borderColor: 'gray'
                                        }}
                                        onPress={() => {
                                            openBottomSheet(3);
                                        }}
                                    >
                                        Sign Up
                                    </MyButton>
                                </ButtonBox>
                            </ButtonsContainer>
                        </BottomSheetContent>
                    )}
                    {activeScreen === 'register' && (
                        <BottomSheetContent style={{marginTop: 20}}>
                            <RegisterTitleContainer>
                                <RegisterTitle>Sign Up</RegisterTitle>
                                <RegisterDescription>Just a few fields to get you started</RegisterDescription>
                            </RegisterTitleContainer>
                            <MyTextField
                                placeholder={'Name'}
                                value={name}
                                onChangeText={setName}
                                onFocus={() => openBottomSheet(4)}
                                iconName={'user'}
                            />
                            <MyTextField
                                placeholder={'Email'}
                                value={registerEmail}
                                keyboardType={'email-address'}
                                onChangeText={setRegisterEmail}
                                onFocus={() => openBottomSheet(4)}
                                iconName={'envelope'}
                            />
                            <MyTextField
                                placeholder={'Password'}
                                value={registerPassword}
                                onChangeText={setRegisterPassword}
                                secureTextEntry={false}
                                onFocus={() => openBottomSheet(4)}
                                iconName={'lock'}
                            />
                        </BottomSheetContent>
                    )}

                </BottomSheetContainer>
            </BottomSheet>
        </AnimatedContainer>
    );
}

const RegisterDescription = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: white;
`

const Container = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const Content = styled.View`
  display: flex;
  width: 90%;
  height: 80%;;
`

const BottomSheetContainer = styled.View`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
`

const BottomSheetContent = styled.View`
  display: flex;
  width: 90%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
`

const ButtonsContainer = styled.View`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 10px;

`

const ButtonBox = styled.View`
  display: flex;
  width: 48%;
  height: 50px;
`

const OasisTitle = styled.Text`
  font-size: 70px;
  font-weight: 600;
`

const OasisSubtitle = styled.Text`
  font-size: 30px;
  font-weight: 600;
`
const RegisterTitleContainer = styled.View`
  display: flex;
  width: 100%;
  align-items: flex-start;
  gap: 10px;
  margin-left: 10px;
`

const RegisterTitle = styled.Text`
  font-size: 35px;
  font-weight: 600;
  color: white;
`


const AnimatedContainer = Animated.createAnimatedComponent(Container);
const AnimatedTitle = Animated.createAnimatedComponent(OasisTitle);
const AnimatedSubtitle = Animated.createAnimatedComponent(OasisSubtitle);