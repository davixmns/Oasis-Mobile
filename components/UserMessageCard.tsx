import styled from "styled-components/native";
import {OasisMessage} from "../interfaces/interfaces";


export function UserMessageCard({oasisMessage}: { oasisMessage: OasisMessage}) {
    return (
        <UserMessageContainer>
            <Header>
                <FromName>You</FromName>
            </Header>
            <Message>{oasisMessage.message}</Message>
        </UserMessageContainer>
    )
}

const UserMessageContainer = styled.View`
  gap: 7px;
  align-items: flex-end;
  align-self: flex-end;
  padding: 10px;
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
  margin: 5px;
  align-self: center;
`
