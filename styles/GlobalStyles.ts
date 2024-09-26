import styled from "styled-components/native";
import {Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, TouchableWithoutFeedback} from "react-native";

import {Dimensions} from "react-native";

const {height} = Dimensions.get('window')

export const CustomSafeAreaView = styled(SafeAreaView)`
    flex: 1;
    background-color: ${props => props.theme.primaryBackground};
`

export const CustomTouchableWithoutFeedback = styled(TouchableWithoutFeedback).attrs({
    onPress: () => Keyboard.dismiss()
})``

export const CustomKeyboardAvoidingView = styled(KeyboardAvoidingView).attrs({
    behavior: Platform.OS === 'ios' ? 'padding' : 'height',
    keyboardVerticalOffset: Platform.OS === 'ios' ? (height < 650 ? 70 : 110) : 0
})`
    flex: 1;
`