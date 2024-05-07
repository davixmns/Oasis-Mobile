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
                {renderProfileImage()}
                <Text>{oasisMessage.from === 'User' ? 'You' : oasisMessage.from}</Text>
            </Header>
        </Container>
    )
}

const Container = styled.View<{ from: string }>`
  display: flex;
  background-color: antiquewhite;
  width: 90%;
  align-items: ${props => props.from === 'User' ? 'flex-end' : 'flex-start'};
`

const Header = styled.View`
  display: flex;
  flex-direction: row;
`

const FromImage = styled.Image`
  width: 50px;
  height: 50px;
`