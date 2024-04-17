import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacityProps } from 'react-native';

// Extending TouchableOpacityProps to include custom styling properties
interface MyButtonProps extends TouchableOpacityProps {
    bgColor: string;
    textColor: string;
    children?: React.ReactNode; // Optional children prop to allow anything inside the button
}

export function MyButton({ bgColor, children, textColor, ...props }: MyButtonProps) {
    return (
        <StyledButton
            bgColor={bgColor}
            textColor={textColor}
            {...props}
        >
            <ButtonText textColor={textColor}>{children}</ButtonText>
        </StyledButton>
    );
}

const StyledButton = styled.TouchableOpacity<MyButtonProps>`
  background-color: ${props => props.bgColor};
  color: ${props => props.textColor};
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  border-radius: 15px; 
`;

const ButtonText = styled.Text<{ textColor: string }>`
  color: ${props => props.textColor};
  font-size: 16px;
  font-weight: bold;
`;