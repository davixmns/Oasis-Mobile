import {ChatBotOptionToChoose} from "../interfaces/interfaces";
import {Dimensions, ScrollView, TouchableOpacity} from "react-native";
import styled from "styled-components/native";
import {ChatBotDicionary} from "../utils/ChatBotDicionary";

interface ChatbotOptionCardProps {
    chatBotOption: ChatBotOptionToChoose
    toggle: () => void
}

const width = Dimensions.get('window').width

export function ChatbotOptionCard({chatBotOption, toggle}: ChatbotOptionCardProps) {
    const shouldScroll = chatBotOption.message.message.length > 700

    const chatBotData = ChatBotDicionary[chatBotOption.message.chatBotEnum]

    return (
        <OptionContainer isActive={chatBotOption.isActive} onPress={toggle} activeOpacity={1}>
            <Header>
                <FromImage source={chatBotData.image}/>
                <FromName>{chatBotData.name}</FromName>
            </Header>
            <OptionMessageContent shouldScroll={shouldScroll}>
                {shouldScroll ? (
                    <ScrollView
                        indicatorStyle={'white'}
                        showsVerticalScrollIndicator={true}
                    >
                        <TouchableOpacity onPress={toggle} activeOpacity={1}>
                            <Message>{chatBotOption.message.message}</Message>
                        </TouchableOpacity>
                    </ScrollView>
                ) : (
                    <TouchableOpacity onPress={toggle} activeOpacity={1}>
                        <Message>{chatBotOption.message.message}</Message>
                    </TouchableOpacity>
                )}
            </OptionMessageContent>
        </OptionContainer>
    );
}

const OptionContainer = styled.TouchableOpacity<{ isActive: boolean }>`
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
