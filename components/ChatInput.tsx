import {useState} from "react";
import {FontAwesome6} from "@expo/vector-icons";
import styled from "styled-components/native";

interface ChatInputProps {
    message: string,
    setMessage: (comment: string) => void,
    onPress: () => void,
    onFocus?: () => void,
}

export default function ChatInput({message, setMessage, onPress, onFocus, ...props}: ChatInputProps) {
    const [height, setHeight] = useState(40);

    const handleContentSizeChange = (event: any) => {
        setHeight(event.nativeEvent.contentSize.height);
    };

    return (
        <Container>
            <Content style={{
                height: Math.min(120, Math.max(40, height)),
            }}>
                <Input
                    onFocus={onFocus}
                    multiline
                    placeholder="Write a message..."
                    value={message}
                    onChangeText={setMessage}
                    onContentSizeChange={handleContentSizeChange}
                    placeholderTextColor={'gray'}
                    {...props}
                />
            </Content>
            <IconContainer onPress={onPress}>
                <FontAwesome6 name={'paper-plane'} size={23} color={'#3797EF'}/>
            </IconContainer>
        </Container>
    );
}

const Container = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 98%;
  background-color: black;
  padding-bottom: 10px;
  padding-top: 10px;
`;

const Content = styled.View`
  flex-direction: row;
  width: 86%;
  align-items: center;
  justify-content: center;
  border: 1px solid gray;
  border-radius: 20px;
  height: 40px;
`;

const Input = styled.TextInput`
  display: flex;
  font-size: 16px;
  width: 90%;
  height: 80%;
  color: white;
`;

const IconContainer = styled.TouchableOpacity`
  height: 40px;
  width: 40px;
  align-items: center;
  justify-content: center;
  padding-left: 10px;
`;
