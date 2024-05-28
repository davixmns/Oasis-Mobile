import {OasisMessage} from "../interfaces/interfaces";
import {Dimensions, ScrollView, TouchableOpacity} from "react-native";
import styled from "styled-components/native";

//@ts-ignore
import chatGgptLogo from "../assets/chatGptLogo.png";
//@ts-ignore
import geminiLogo from "../assets/geminiLogo.png";

interface ChatbotOptionCardProps {
    oasisMessage: OasisMessage
    isActive: boolean,
    toggle: () => void
}

const width = Dimensions.get('window').width

export function ChatbotOptionCard({oasisMessage, isActive, toggle}: ChatbotOptionCardProps) {
    const shouldScroll = !oasisMessage.isSaved && oasisMessage.message.length > 700

    function renderProfileImage() {
        if (oasisMessage.from === 'ChatGPT') return <FromImage source={chatGgptLogo}/>
        if (oasisMessage.from === 'Gemini') return <FromImage source={geminiLogo}/>
    }

    return (
        <OptionContainer isActive={isActive!}>
            <Header>
                {renderProfileImage()}
                <FromName>{oasisMessage.from}</FromName>
            </Header>
            <OptionMessageContent shouldScroll={shouldScroll}>
                {shouldScroll ? (
                    <ScrollView
                        indicatorStyle={'white'}
                        showsVerticalScrollIndicator={true}
                    >
                        <TouchableOpacity onPress={toggle} activeOpacity={1}>
                            <Message>{oasisMessage.message}</Message>
                        </TouchableOpacity>
                    </ScrollView>
                ) : (
                    <TouchableOpacity onPress={toggle} activeOpacity={1}>
                        <Message>{oasisMessage.message}</Message>
                    </TouchableOpacity>
                )}
            </OptionMessageContent>
        </OptionContainer>
    );
}

const OptionContainer = styled.View<{ isActive: boolean }>`
  display: flex;
  width: ${width * 0.9}px;
  gap: 7px;
  justify-content: flex-start;
  margin-right: 12px;
  align-items: flex-start;
  background-color: ${props => props.isActive ? '#303030' : '#212121'};
  border-radius: 10px;
  padding: 10px;
  border: 2px solid ${props => props.isActive ? 'gray' : null};
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

const FromName = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: white;
  margin: 5px;
  align-self: center;
`

const OptionMessageContent = styled.View <{ shouldScroll: boolean }>`
  border-radius: 10px;
  margin-left: 3px;
  margin-top: 3px;
  max-height: ${props => props.shouldScroll ? '450px' : 'auto'};
`

const FromImage = styled.Image`
  width: 30px;
  height: 30px;
  border-radius: 20px;
`
