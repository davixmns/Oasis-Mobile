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
        setHeight(event.nativeEvent.contentSize.height + 15);
    };

    return (
        <Container>
            <Content style={{
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
                    style={{ width: '80%'}}
                    {...props}
                />
                {message !== '' && (
                    <IconContainer onPress={onPress}>
                        <FontAwesome6 name={'arrow-up'} size={20} color={'#000'}/>
                    </IconContainer>
                )}
            </Content>
        </Container>
    );
}

const Container = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 98%;
  padding-bottom: 10px;
  padding-top: 10px;
  background-color: black;
`;

const Content = styled.View`
  flex-direction: row;
  width: 95%;
  align-items: center;
  justify-content: flex-start;
  padding-left: 18px;
  border: 1px solid gray;
  border-radius: 20px;
  position: relative;
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
  height: 30px;
  width: 30px;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 20px;
  background-color: white;
  border-radius: 20px;
`;
