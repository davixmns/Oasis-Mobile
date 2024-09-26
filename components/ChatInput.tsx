import {useState} from "react";
import {FontAwesome6} from "@expo/vector-icons";
import styled from "styled-components/native";
import {ActivityIndicator} from "react-native";
import {useTranslation} from "react-i18next";
import {useColorSchemeContext} from "../contexts/ColorSchemeContext";

interface ChatInputProps {
    message: string,
    setMessage: (comment: string) => void,
    onPress: () => void,
    onFocus?: () => void,
    isLoading?: boolean,
}

export default function ChatInput({message, setMessage, onPress, onFocus, isLoading, ...props}: ChatInputProps) {
    const [height, setHeight] = useState(40);
    const {t} = useTranslation();
    const {colorScheme} = useColorSchemeContext();

    const handleContentSizeChange = (event: any) => {
        setHeight(event.nativeEvent.contentSize.height + 15);
    };

    return (
        <Container>
            <Content>
                <InputContainer style={{
                    height: Math.min(100, Math.max(40, height)),
                }}>
                    <Input
                        onFocus={onFocus}
                        multiline
                        placeholder={t('write_message')}
                        value={message}
                        onChangeText={setMessage}
                        onContentSizeChange={handleContentSizeChange}
                        placeholderTextColor={'gray'}
                        style={{width: '90%'}}
                        {...props}
                    />
                </InputContainer>
                {isLoading ? (
                    <LoadingContainer>
                        <ActivityIndicator size={'small'} color={colorScheme.primaryText}/>
                    </LoadingContainer>
                ) : (
                    <SendButton onPress={onPress}>
                        <FontAwesome6 name={'arrow-up'} size={20} color={colorScheme.primaryBackground}/>
                    </SendButton>
                )}
            </Content>
        </Container>
    )
        ;
}

const Container = styled.View`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 50px;
    background-color: green;
`;

const Content = styled.View`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    gap: 10px;
    width: 90%;
    background-color: red;
`;

const InputContainer = styled.View`
    flex-direction: row;
    width: 87%;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    background-color: ${props => props.theme.secondaryBackground};
    height: 40px;
`;

const Input = styled.TextInput`
    display: flex;
    font-size: 16px;
    height: 80%;
    background-color: aqua;
    color: ${props => props.theme.primaryText};
`;

const SendButton = styled.TouchableOpacity`
    height: 35px;
    width: 35px;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.theme.primaryText};
    border-radius: 20px;
`;

const LoadingContainer = styled.View`
    display: flex;
    width: 35px;
    height: 35px;
    align-items: center;
    justify-content: center;
`