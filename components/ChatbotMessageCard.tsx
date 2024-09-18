import {ChatbotEnum, OasisMessage} from "../interfaces/interfaces";
import styled from "styled-components/native";

//@ts-ignore
import geminiLogo from '../assets/geminiLogo.png'
//@ts-ignore
import chatGgptLogo from '../assets/chatGptLogo.png'

export function ChatbotMessageCard({oasisMessage}: { oasisMessage: OasisMessage }) {

    function renderProfileImage() {
        if (oasisMessage.from === ChatbotEnum.ChatGPT) return <FromImage source={chatGgptLogo}/>
        if (oasisMessage.from === ChatbotEnum.Gemini) return <FromImage source={geminiLogo}/>
    }

    return (
        <ChatbotMessageContainer>
            <Header>
                {renderProfileImage()}
                <FromName>{oasisMessage.from}</FromName>
            </Header>
            <Message>{oasisMessage.message}</Message>
        </ChatbotMessageContainer>
    );
}

const ChatbotMessageContainer = styled.View`
  gap: 7px;
  align-items: flex-start;
  align-self: flex-start;
  width: 90%;
  padding: 10px;
  margin-left: 3px;
`

const Message = styled.Text`
  font-size: 16px;
  color: #fff;
  font-weight: 500;
`

const Header = styled.View`
  display: flex;
  flex-direction: row;
`

const FromImage = styled.Image`
  width: 30px;
  height: 30px;
  border-radius: 20px;
`

const FromName = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: white;
  margin: 5px;
  align-self: center;
`
