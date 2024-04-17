import React, {forwardRef} from 'react';
import styled from 'styled-components/native';
import {TextInput, TextInputProps} from 'react-native';
import {FontAwesome6} from "@expo/vector-icons";


export interface MyTextFieldProps extends TextInputProps {
    iconName: string;
    isCorrect?: boolean | null;
}

export const MyTextField = forwardRef((props: MyTextFieldProps, ref) => {
    return (
        <Container>
            <FontAwesome6
                name={props.iconName}
                size={22}
                color={'gray'}
                style={{marginBottom: 1}}
            />
            <TextInput
                placeholderTextColor={'gray'}
                style={{
                    width: '78%',
                    height: 50,
                    borderRadius: 15,
                    fontSize: 16,
                    color: 'white',
                }}
                // @ts-ignore
                ref={ref}
                {...props}
            />
            {props.value !== '' && props.isCorrect !== undefined && (
                <IconContainer>
                    <FontAwesome6
                        name={props.isCorrect ? 'check' : 'exclamation'} size={22}
                        color={props.isCorrect ? 'green' : 'red'}
                    />
                </IconContainer>
            )}
        </Container>
    );
})

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
