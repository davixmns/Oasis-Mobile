import {OasisMessage} from "../interfaces/interfaces";
import styled from "styled-components/native";
import {ChatBotDicionary} from "../utils/ChatBotDicionary";

export function ChatbotMessageCard({oasisMessage}: { oasisMessage: OasisMessage }) {

    const option = ChatBotDicionary[oasisMessage.chatBotEnum]

    return (
        <ChatbotMessageContainer>
            <Header>
                <FromImage source={option.image}/>
                <FromName>{option.name}</FromName>
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
