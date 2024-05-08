import {OasisMessage} from "../interfaces/interfaces";
import styled from "styled-components/native";
import {Dimensions, Text} from "react-native";

//@ts-ignore
import chatGgptLogo from '../assets/chatGptLogo.png'
//@ts-ignore
import userPicture from '../assets/defaultPicture.jpeg'
//@ts-ignore
import geminiLogo from '../assets/geminiLogo.png'

const { width } = Dimensions.get('window'); // Obter a largura da tela do dispositivo


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
                        {renderProfileImage()}
                        <FromName>{oasisMessage.from === 'User' ? 'You' : oasisMessage.from}</FromName>
                    </>
                )}
            </Header>
            <Content from={oasisMessage.from} isSaved={!oasisMessage.isSaved}>
                <Message>{oasisMessage.message}</Message>
            </Content>
        </Container>
    )
}

const Container = styled.View<{from: string}>`
  display: flex;
  gap: 7px;
  justify-content: flex-end;
  margin-left: 12px;
  margin-right: 12px;
  align-items: ${props => props.from === 'User' ? 'flex-end' : 'flex-start'};
`

const Content = styled.View<{isSaved: boolean, from: string}>`
  max-width: 100%;
  border: ${props => props.from === 'ChatGPT' ? '2px solid #6fa99b' : props.from === 'Gemini' ? '2px solid #3594db' : '0.5px solid #fff'};
  border-radius: 10px;
  background-color: ${props => props.isSaved === true && props.from !== 'User' ? '#3A3A3A' : '#000'};
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
  max-width: ${width * 0.8}px;
`