import styled from "styled-components/native";
import {OasisMessage} from "../interfaces/interfaces";

export function UserMessageCard({oasisMessage}: { oasisMessage: OasisMessage }) {
    return (
        <UserMessageContainer>
            <Header>
                <FromName>You</FromName>
            </Header>
            <MessageBubble>
                <Message>{oasisMessage.message}</Message>
            </MessageBubble>
        </UserMessageContainer>
    )
}

const UserMessageContainer = styled.View`
  gap: 7px;
  align-items: flex-end;
  align-self: flex-end;
  padding: 10px;
  width: 90%;
  margin-right: 3px;
`

const Header = styled.View`
  display: flex;
  flex-direction: row;
`

const Message = styled.Text`
  font-size: 16px;
  color: #fff;
  font-weight: 500;
`

const FromName = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: white;
  align-self: center;
`

const MessageBubble = styled.View`
  background-color: #222222;
  padding: 10px;
  border-radius: 10px 0 10px 10px;
`
