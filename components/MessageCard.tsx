import {OasisMessage} from "../interfaces/interfaces";
import styled from "styled-components/native";
import {Dimensions, ScrollView, Text} from "react-native";

//@ts-ignore
import chatGgptLogo from '../assets/chatGptLogo.png'
//@ts-ignore
import userPicture from '../assets/defaultPicture.jpeg'
//@ts-ignore
import geminiLogo from '../assets/geminiLogo.png'
import {useState} from "react";

const {width} = Dimensions.get('window');


export function MessageCard({oasisMessage}: {
    oasisMessage: OasisMessage
}) {
    const [isSaved, setIsSaved] = useState<boolean>(oasisMessage.isSaved!)

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
        <Container from={oasisMessage.from} isSaved={isSaved}>
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
            <Content from={oasisMessage.from} isSaved={isSaved}>
                <Message>{oasisMessage.message}</Message>
            </Content>
        </Container>
    )
}

const Container = styled.View<{
    from: string,
    isSaved: boolean
}>`
  display: flex;
  gap: 7px;
  justify-content: flex-end;
  margin-top: 12px;
  margin-left: 12px;
  margin-right: 12px;
  box-shadow: 0 0 3px ${props => props.from === 'ChatGPT' && props.isSaved === false ?
          '#6fa99b' : props.from === 'Gemini' && props.isSaved === false ? '#3594db' : null};
  align-items: ${props => props.from === 'User' ? 'flex-end' : 'flex-start'};
`

const Content = styled.View<{
    isSaved: boolean,
    from: string
}>`
  max-width: 100%;
  border-radius: 10px;
  background-color: black;
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
  max-width: ${width * 0.90}px;
  font-weight: 500;
  padding: 10px;

`