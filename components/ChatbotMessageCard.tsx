import {OasisMessage} from "../interfaces/interfaces";
import styled from "styled-components/native";
import {ChatBotHeader} from "./ChatBotHeader";

export function ChatbotMessageCard({oasisMessage}: { oasisMessage: OasisMessage }) {

    return (
        <ChatbotMessageContainer>
            <ChatBotHeader chatBotEnum={oasisMessage.chatBotEnum} />
            <Message>{oasisMessage.message}</Message>
        </ChatbotMessageContainer>
    );
}

const ChatbotMessageContainer = styled.View`
    gap: 7px;
    align-items: flex-start;
    align-self: flex-start;
    width: 100%;
    padding: 10px;
`

const Message = styled.Text`
    font-size: 16px;
    color: ${props => props.theme.primaryText};
    font-weight: normal;
`