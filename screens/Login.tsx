import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Animated, Text, View, StyleSheet} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import styled from 'styled-components/native';
import {MyTextField} from "../components/MyTextField";
import {MyButton} from "../components/MyButton";
import {verifyEmail} from "../utils/utils";
import {useNavigation} from "@react-navigation/native";
import {Container, Content, ScreenTitle} from "./Styles";
import {FontAwesome6} from "@expo/vector-icons";

export function Login() {
    const animatedColor = useRef(new Animated.Value(0)).current;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const snapPoints = useMemo(() => ['35%','58%', '71%', '95%'], []);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [emailIsCorrect, setEmailIsCorrect] = useState<boolean | null>(null);
    const navigation = useNavigation();
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

    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [activeScreen, setActiveScreen] = useState('Sign In');

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

    function onChangeEmail(text: string) {
        setEmail(text);
        setEmailIsCorrect(verifyEmail(text));
    }

    function openSignUp(){
        bottomSheetRef.current?.snapToIndex(1)
        setActiveScreen('Sign Up')
    }

    function closeSignUp(){
        bottomSheetRef.current?.snapToIndex(0)
        setActiveScreen('Sign In')
    }

    function expandBottomSheetSignIn(){
        bottomSheetRef.current?.snapToIndex(2)
    }

    function expandBottomSheetSignUp(){
        bottomSheetRef.current?.snapToIndex(3)
    }

    function snapToIndex(index: number){
        bottomSheetRef.current?.snapToIndex(index)
    }

    return (
        <AnimatedContainer style={{backgroundColor}}>
            {/*@ts-ignore*/}
            <Content style={{alignItems: 'unset'}}>
                <AnimatedTitle style={{color: textColor}}>Oasis</AnimatedTitle>
                <AnimatedSubtitle style={{color: textColor}}>Your personal AI MultiChat</AnimatedSubtitle>
            </Content>
            <BottomSheet
                snapPoints={snapPoints}
                index={0}
                ref={bottomSheetRef}
                backgroundComponent={({style}) => (
                    <View style={[{
                        backgroundColor: 'black',
                        borderRadius: 40
                    }, style]}/>
                )}
            >
                <BottomSheetContainer>
                    <BottomSheetContent>
                        {activeScreen === 'Sign In' ? (
                            <>
                                <RegisterTitleContainer>
                                    <ScreenTitle>Sign In</ScreenTitle>
                                </RegisterTitleContainer>
                                <MyTextField
                                    placeholder={'Email'}
                                    value={email}
                                    keyboardType={'email-address'}
                                    onChangeText={onChangeEmail}
                                    onFocus={expandBottomSheetSignIn}
                                    onSubmitEditing={() => snapToIndex(0)}
                                    iconName={'envelope'}
                                    isCorrect={emailIsCorrect}
                                />
                                <MyTextField
                                    placeholder={'Password'}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={true}
                                    onFocus={expandBottomSheetSignIn}
                                    onSubmitEditing={() => snapToIndex(0)}
                                    iconName={'lock'}
                                />
                                <ButtonsContainer style={{flexDirection: 'row'}}>
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
                                            onPress={openSignUp}
                                        >
                                            Sign Up
                                        </MyButton>
                                    </ButtonBox>
                                </ButtonsContainer>
                            </>
                        ) : (
                            <>
                                <View>
                                    <TextContainer>
                                        <ScreenTitle>Sign Up</ScreenTitle>
                                        <Xbutton onPress={closeSignUp}>
                                            <FontAwesome6 name={'x'} size={30} color={'white'}/>
                                        </Xbutton>
                                    </TextContainer>
                                    <TextContainer>
                                        <Descriptions>Just a few fields to get you started</Descriptions>
                                    </TextContainer>
                                </View>
                                <InputsContainer>
                                    <MyTextField
                                        placeholder={'Name'}
                                        value={registerName}
                                        onChangeText={setRegisterName}
                                        iconName={'user'}
                                        onFocus={expandBottomSheetSignUp}
                                        onSubmitEditing={openSignUp}
                                    />
                                    <MyTextField
                                        placeholder={'Email'}
                                        value={registerEmail}
                                        keyboardType={'email-address'}
                                        onChangeText={setRegisterEmail}
                                        iconName={'envelope'}
                                        onFocus={expandBottomSheetSignUp}
                                        onSubmitEditing={openSignUp}
                                    />
                                    <MyTextField
                                        placeholder={'Password'}
                                        value={registerPassword}
                                        onChangeText={setRegisterPassword}
                                        secureTextEntry={false}
                                        iconName={'lock'}
                                        onFocus={expandBottomSheetSignUp}
                                        onSubmitEditing={openSignUp}
                                    />
                                </InputsContainer>
                                <ButtonsContainer style={{marginTop: 25}}>
                                    <MyButton
                                        bgColor={'#fff'}
                                        textColor={'#000'}
                                    >
                                        Sign Up
                                    </MyButton>
                                    <MyButton
                                        bgColor={'#000'}
                                        textColor={'#fff'}
                                        onPress={closeSignUp}
                                        style={{
                                            borderStyle: 'solid',
                                            borderWidth: 1,
                                            borderColor: 'gray'
                                        }}
                                    >
                                        Cancel
                                    </MyButton>
                                </ButtonsContainer>
                            </>
                        )}
                    </BottomSheetContent>
                </BottomSheetContainer>
            </BottomSheet>
        </AnimatedContainer>
    );
}

const BottomSheetContainer = styled.View`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
`
const Xbutton = styled.TouchableOpacity`
  //background-color: blue;
  height: 100%;
  padding-top: 5px;
`

const BottomSheetContent = styled.View`
  display: flex;
  width: 90%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
`

const InputsContainer = styled.View`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
`

const ButtonsContainer = styled.View`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`

const Descriptions = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: white;
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

const TextContainer = styled.View`
  display: flex;
  width: 98%;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: row;
`

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const AnimatedTitle = Animated.createAnimatedComponent(OasisTitle);
const AnimatedSubtitle = Animated.createAnimatedComponent(OasisSubtitle);