import {ChatBotOptionToChoose} from "../interfaces/interfaces";
import {Dimensions, ScrollView, TouchableOpacity} from "react-native";
import styled from "styled-components/native";
import {ChatBotHeader} from "./ChatBotHeader";

interface ChatbotOptionCardProps {
    chatBotOption: ChatBotOptionToChoose
    toggle: () => void
}

const width = Dimensions.get('window').width

export function ChatBotOptionCard({chatBotOption, toggle}: ChatbotOptionCardProps) {
    const shouldScroll = chatBotOption.message.message.length > 700

    return (
        <OptionContainer isActive={chatBotOption.isActive} onPress={toggle} activeOpacity={1}>
            <ChatBotHeader chatBotEnum={chatBotOption.message.chatBotEnum}/>
            <OptionContent shouldScroll={shouldScroll}>
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
            </OptionContent>
        </OptionContainer>
    );
}

const OptionContainer = styled.TouchableOpacity<{ isActive: boolean }>`
    background-color: ${props => props.isActive ? props.theme.activeOptionCard : props.theme.inactiveOptionCard};
    border: 2px solid ${props => props.isActive ? 'darkgray' : 'transparent'};
    width: ${width * 0.85}px;
    display: flex;
    gap: 7px;
    justify-content: flex-start;
    margin-right: 12px;
    align-items: flex-start;
    border-radius: 10px;
    padding: 10px;
    color: gray;
`

const Message = styled.Text`
  font-size: 16px;
  color: ${props => props.theme.primaryText};
`

const OptionContent = styled.View <{ shouldScroll: boolean }>`
  border-radius: 10px;
  margin-left: 3px;
  max-height: ${props => props.shouldScroll ? '450px' : 'auto'};
`