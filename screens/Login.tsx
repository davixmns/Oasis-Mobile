import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
    Animated,
    View,
    TouchableWithoutFeedback,
    Keyboard,
    TextInput,
    StyleSheet,
    Alert,
    ActivityIndicator
} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import styled from 'styled-components/native';
import {MyTextField} from "../components/MyTextField";
import {MyButton} from "../components/MyButton";
import {backgroundColors, textColors, verifyEmail, verifyUser} from "../utils/utils";
import {useNavigation} from "@react-navigation/native";
import {Container, Content, ScreenTitle} from "./Styles";
import {FontAwesome6} from "@expo/vector-icons";
import * as Animatable from 'react-native-animatable';
import {useAuthContext} from "../contexts/AuthContext";
import {OasisUser} from "../interfaces/interfaces";

export function Login() {
    const {createUser, tryLogin} = useAuthContext()

    //Background animation
    const animatedColor = useRef(new Animated.Value(0)).current;

    //BottomSheet
    const snapPoints = useMemo(() => ['35%', '50%', '71%', '87%'], []);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [activeScreen, setActiveScreen] = useState('Sign In');

    //Sign In
    const [signInEmail, setSignInEmail] = useState('');
    const [signInPassword, setSignInPassword] = useState('');
    const [signInEmailIsCorrect, setSignInEmailIsCorrect] = useState<boolean | null>(null);
    const signInPasswordRef = useRef<TextInput>();

    //Sign Up
    const [requestIsLoading, setRequestIsLoading] = useState<boolean>(false);
    const [registerName, setRegisterName] = useState('');
    const [registerNameIsCorret, setRegisterNameIsCorret] = useState<boolean | null>(null);
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerEmailIsCorrect, setRegisterEmailIsCorrect] = useState<boolean | null>(null);
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerPasswordIsCorrect, setRegisterPasswordIsCorrect] = useState<boolean | null>(null);
    const signUpEmailRef = useRef<TextInput>(null);
    const signUpPasswordRef = useRef<TextInput>(null);

    useEffect(() => {
        Animated.loop(
            Animated.timing(animatedColor, {
                toValue: backgroundColors.length - 1,
                duration: 60000,
                useNativeDriver: false
            })
        ).start();
    }, [animatedColor]);

    useEffect(() => {
        if (activeScreen === 'Sign In') {
            setRegisterName('')
            setRegisterEmail('')
            setRegisterPassword('')
            setRegisterNameIsCorret(null)
            setRegisterEmailIsCorrect(null)
            setRegisterPasswordIsCorrect(null)
            snapToIndex(0)
        } else {
            setSignInEmail('')
            setSignInPassword('')
            setSignInEmailIsCorrect(null)
            snapToIndex(1)
        }
    }, [activeScreen]);


    const backgroundColor = animatedColor.interpolate({
        inputRange: Array.from({length: backgroundColors.length}, (_, i) => i),
        outputRange: backgroundColors
    });

    const textColor = animatedColor.interpolate({
        inputRange: Array.from({length: textColors.length}, (_, i) => i),
        outputRange: textColors
    });

    function snapToIndex(index: number) {
        bottomSheetRef.current?.snapToIndex(index)
    }

    function focusNextField(currentFieldValue: string, nextFieldRef: any, bottomSheetIndex: number) {
        if (currentFieldValue === '') {
            snapToIndex(bottomSheetIndex);
            return;
        }
        nextFieldRef.current?.focus();
    }

    function closeBottomSheetAndKeyboard() {
        if (activeScreen === 'Sign Up') {
            setSignInEmailIsCorrect(null)
            snapToIndex(1)
        } else {
            snapToIndex(0)
        }
        Keyboard.dismiss()
    }

    async function handleTryLogin() {
        if (!verifyEmail(signInEmail)){
            setSignInEmailIsCorrect(false)
            return
        }
        setRequestIsLoading(true)
        setRequestIsLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        await tryLogin(signInEmail, signInPassword)
            .catch((error) => {
                if (error.response) {
                    console.log(error.response.data.message)
                    Alert.alert('Error', error.response.data.message);
                }
            })
            .finally(() => {
                setRequestIsLoading(false)
            })
    }

    function validateRegisterFields(user: OasisUser) {
        const validatedFields = verifyUser(user)
        let fieldsOk = true
        if(validatedFields[0] === false){
            setRegisterNameIsCorret(false)
            fieldsOk = false
        }
        if(validatedFields[1] === false){
            setRegisterEmailIsCorrect(false)
            fieldsOk = false
        }
        if(validatedFields[2] === false){
            setRegisterPasswordIsCorrect(false)
            fieldsOk = false
        }
        return fieldsOk
    }


    async function handleRegister() {
        const user: OasisUser = {
            name: registerName,
            email: registerEmail,
            password: registerPassword
        };

        if(!validateRegisterFields(user)) return

        setRequestIsLoading(true)
        // await new Promise(resolve => setTimeout(resolve, 1000))
        await createUser(user)
            .then(() => {
                Alert.alert('Success', 'User created successfully');
                setRegisterName('');
                setRegisterEmail('');
                setRegisterPassword('');
                setActiveScreen("Sign In");
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response.data.message)
                    Alert.alert('Error', error.response.data.message);
                }
            })
            .finally(() => {
                setRequestIsLoading(false)
            })
    }

    return (
        <TouchableWithoutFeedback onPress={closeBottomSheetAndKeyboard}>
            <AnimatedContainer style={{backgroundColor}}>
                {/*@ts-ignore*/}
                <Content style={{alignItems: 'unset'}}>
                    <AnimatedTitle style={{color: textColor}}>Oasis</AnimatedTitle>
                    <AnimatedSubtitle style={{color: textColor}}>
                        Exploring new {'\n'}frontiers with AI
                    </AnimatedSubtitle>
                </Content>
                <BottomSheet
                    snapPoints={snapPoints}
                    index={0}
                    ref={bottomSheetRef}
                    enableOverDrag={false}
                    enableContentPanningGesture={false}
                    enableHandlePanningGesture={false}
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
                                <Animatable.View animation={'fadeIn'} duration={1000} style={styles.bottomSheetContent}
                                                 key={activeScreen}>
                                    <RegisterTitleContainer>
                                        <ScreenTitle>Sign In</ScreenTitle>
                                    </RegisterTitleContainer>
                                    {/*EMAIL*/}
                                    <MyTextField
                                        placeholder={'Email'}
                                        value={signInEmail}
                                        keyboardType={'email-address'}
                                        autoCapitalize={'none'}
                                        onChangeText={(text) => {
                                            setSignInEmail(text);
                                            setSignInEmailIsCorrect(text !== '' ? verifyEmail(text) : null);
                                        }}
                                        onFocus={() => snapToIndex(2)}
                                        onSubmitEditing={() => focusNextField(signInEmail, signInPasswordRef, 0)}
                                        iconName={'envelope'}
                                        isCorrect={signInEmailIsCorrect}
                                    />
                                    {/*SENHA*/}
                                    <MyTextField
                                        placeholder={'Password'}
                                        value={signInPassword}
                                        onChangeText={setSignInPassword}
                                        secureTextEntry={true}
                                        autoCapitalize={'none'}
                                        onFocus={() => snapToIndex(2)}
                                        onSubmitEditing={() => snapToIndex(0)}
                                        iconName={'lock'}
                                        ref={signInPasswordRef}
                                    />
                                    <ButtonsContainer style={{flexDirection: 'row', marginTop: 3}} key={activeScreen}>
                                        <ButtonBox>
                                            <MyButton
                                                bgColor={requestIsLoading ? '#000' : '#fff'}
                                                textColor={'#000'}
                                                onPress={handleTryLogin}
                                            >
                                                {requestIsLoading ? (
                                                    <ActivityIndicator
                                                        size={"large"}
                                                        color={'#fff'}
                                                        style={{paddingTop: 10}}
                                                    />
                                                ) : (
                                                    'Login'
                                                )}
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
                                                onPress={() => setActiveScreen('Sign Up')}
                                            >
                                                Sign Up
                                            </MyButton>
                                        </ButtonBox>
                                    </ButtonsContainer>
                                </Animatable.View>
                            ) : (
                                <Animatable.View animation={'fadeIn'} duration={700} style={styles.bottomSheetContent}>
                                    <View>
                                        <TextContainer>
                                            <ScreenTitle>Sign Up</ScreenTitle>
                                            <Xbutton onPress={() => setActiveScreen('Sign In')}>
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
                                            onChangeText={(text) => {
                                                setRegisterName(text);
                                                setRegisterNameIsCorret(text !== '' ? text.length > 2 : null);
                                            }}
                                            iconName={'user'}
                                            onFocus={() => snapToIndex(3)}
                                            onSubmitEditing={() => focusNextField(registerName, signUpEmailRef, 1)}
                                            isCorrect={registerNameIsCorret}
                                        />
                                        <MyTextField
                                            placeholder={'Email'}
                                            value={registerEmail}
                                            keyboardType={'email-address'}
                                            autoCapitalize={"none"}
                                            onChangeText={(text) => {
                                                setRegisterEmail(text);
                                                setRegisterEmailIsCorrect(text !== '' ? verifyEmail(text) : null);
                                            }}
                                            iconName={'envelope'}
                                            onFocus={() => snapToIndex(3)}
                                            onSubmitEditing={() => focusNextField(registerEmail, signUpPasswordRef, 1)}
                                            ref={signUpEmailRef}
                                            isCorrect={registerEmailIsCorrect}
                                        />
                                        <MyTextField
                                            placeholder={'Password'}
                                            value={registerPassword}
                                            autoCapitalize={'none'}
                                            onChangeText={(text) => {
                                                setRegisterPassword(text);
                                                setRegisterPasswordIsCorrect(text !== '' ? text.length > 6 : null);
                                            }}
                                            secureTextEntry={true}
                                            iconName={'lock'}
                                            onFocus={() => snapToIndex(3)}
                                            onSubmitEditing={() => snapToIndex(1)}
                                            ref={signUpPasswordRef}
                                            isCorrect={registerPasswordIsCorrect}
                                        />
                                    </InputsContainer>
                                    <ButtonsContainer style={{marginTop: 25}}>
                                        <MyButton
                                            bgColor={requestIsLoading ? '#000' : '#fff'}
                                            textColor={requestIsLoading ? '#fff' : '#000'}
                                            onPress={handleRegister}
                                        >
                                            {requestIsLoading ? (
                                                <ActivityIndicator size={'large'} color={'#fff'}/>
                                            ) : (
                                                'Sign Up'
                                            )}
                                        </MyButton>
                                    </ButtonsContainer>
                                </Animatable.View>
                            )}
                        </BottomSheetContent>
                    </BottomSheetContainer>
                </BottomSheet>
            </AnimatedContainer>
        </TouchableWithoutFeedback>
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

const styles = StyleSheet.create({
    bottomSheetContent: {
        display: 'flex',
        width: '100%',
        gap: 10
    }
})

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