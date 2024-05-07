import {OasisMessage} from "../interfaces/interfaces";
import styled from "styled-components/native";
import {Text} from "react-native";

//@ts-ignore
import chatGgptLogo from '../assets/chatGptLogo.png'
//@ts-ignore
import userPicture from '../assets/defaultPicture.jpeg'
//@ts-ignore
import geminiLogo from '../assets/geminiLogo.png'

export function MessageCard({oasisMessage}: { oasisMessage: OasisMessage }) {

    function renderProfileImage() {
        if (oasisMessage.from === 'User') {
            return <FromImage source={userPicture}/>
        } else if (oasisMessage.from === 'ChatGPT') {
            return <FromImage source={chatGgptLogo}/>
        } else if (oasisMessage.from === 'Gemini') {
            return <FromImage source={geminiLogo}/>
        }
    }

    return (
        <Container from={oasisMessage.from}>
            <Header>
                {oasisMessage.from === 'User' ? (
                    <>
                        <FromName>{oasisMessage.from === 'User' ? 'You' : oasisMessage.from}</FromName>
                        {renderProfileImage()}
                    </>
                ) : (
                    <>
                        <FromName>{oasisMessage.from === 'User' ? 'You' : oasisMessage.from}</FromName>
                        {renderProfileImage()}
                    </>
                )}
            </Header>
            <Content>
                <Message>{oasisMessage.message}</Message>
            </Content>
        </Container>
    )
}

const Container = styled.View<{ from: string }>`
  display: flex;
  //background-color: antiquewhite;
  gap: 7px;
  width: 100%;
  align-items: ${props => props.from === 'User' ? 'flex-end' : 'flex-start'};
  justify-content: flex-end;
`

const Content = styled.View`
  max-width: 80%;
  border: 0.2px solid #dedede;
  border-radius: 10px;
  align-items: flex-end;
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

const Message = styled.Text`
  font-size: 16px;
  color: #fff;
  margin: 10px;
`