import styled from "styled-components/native";
import {ChatbotEnum} from "../interfaces/interfaces";
import {ChatBotDicionary} from "../utils/ChatBotDicionary";
import {useColorSchemeContext} from "../contexts/ColorSchemeContext";

export function ChatBotHeader({chatBotEnum}: { chatBotEnum: ChatbotEnum }) {
    const {colorScheme} = useColorSchemeContext()

    const chatBotData = ChatBotDicionary[chatBotEnum]

    return (
        <Header>
            {/*@ts-ignore*/}
            <FromImage source={chatBotData.image} tintColor={chatBotEnum === ChatbotEnum.ChatGPT && colorScheme.primaryText}/>
            <FromName>{chatBotData.name}</FromName>
        </Header>
    );
}

const FromName = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.primaryText};
  margin: 5px;
  align-self: center;
`

const FromImage = styled.Image`
    width: 25px;
    height: 25px;
`
const Header = styled.View`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    padding-left: 3px;
    gap: 2px
`
