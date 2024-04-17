import React from 'react';
import styled from 'styled-components/native';
import {TextInputProps} from 'react-native';
import {FontAwesome6} from "@expo/vector-icons";


interface MyTextFieldProps extends TextInputProps {
    iconName: string;
    isCorrect?: boolean | null;
}

export function MyTextField({isCorrect, ...props}: MyTextFieldProps) {
    return (
        <Container>
            <FontAwesome6
                name={props.iconName}
                size={22}
                color={'gray'}
                style={{marginBottom: 1}}
            />
            <StyledTextInput
                placeholderTextColor={'gray'}
                {...props} // This will pass all other TextInputProps to the StyledTextInput
            />
            {props.value !== '' && isCorrect !== undefined && (
                <IconContainer>
                    <FontAwesome6
                        name={isCorrect ? 'check' : 'exclamation'} size={22}
                        color={isCorrect ? 'green' : 'red'}
                    />
                </IconContainer>
            )}
        </Container>
    );
}

const Container = styled.View`
  width: 100%;
  height: 50px;
  border-radius: 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: black;
  border: 1px solid gray;
  justify-content: flex-start;
  gap: 12px;
  padding-left: 15px;
`

const IconContainer = styled.View`
  position: absolute;
  right: 10px;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledTextInput = styled.TextInput`
  width: 78%;
  height: 50px;
  border-radius: 15px;
  font-size: 16px;
  color: white;
`;
