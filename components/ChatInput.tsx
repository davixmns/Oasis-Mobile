import {useState} from "react";
import {FontAwesome6} from "@expo/vector-icons";
import styled from "styled-components/native";
import {ActivityIndicator} from "react-native";

interface ChatInputProps {
    message: string,
    setMessage: (comment: string) => void,
    onPress: () => void,
    onFocus?: () => void,
    isLoading?: boolean,
}

export default function ChatInput({message, setMessage, onPress, onFocus, isLoading, ...props}: ChatInputProps) {
    const [height, setHeight] = useState(40);

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
                        placeholder="Write a message..."
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
                        <ActivityIndicator size="large" color="#fff"/>
                    </LoadingContainer>
                ) : (
                    <SendButton onPress={onPress}>
                        <FontAwesome6 name={'arrow-up'} size={20} color={'#000'}/>
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
  padding-bottom: 10px;
  padding-top: 10px;
`;

const Content = styled.View`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 94%;
`;

const InputContainer = styled.View`
  flex-direction: row;
  width: 87%;
  align-items: center;
  justify-content: center;
  border: 1px solid gray;
  border-radius: 20px;
  height: 40px;
`;

const Input = styled.TextInput`
  display: flex;
  font-size: 16px;
  height: 80%;
  color: white;
`;

const SendButton = styled.TouchableOpacity`
  height: 35px;
  width: 35px;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 20px;
`;

const LoadingContainer = styled.View`
  display: flex;
  width: 35px;
  height: 35px;
  align-items: center;
  justify-content: center;
`