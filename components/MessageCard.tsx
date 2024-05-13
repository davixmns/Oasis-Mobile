import {useEffect, useState} from "react";
import {ActivityIndicator, Dimensions, ScrollView, TouchableOpacity} from "react-native";
import styled from "styled-components/native";
import {OasisMessage} from "../interfaces/interfaces";

//@ts-ignore
import chatGgptLogo from '../assets/chatGptLogo.png'
//@ts-ignore
import userPicture from '../assets/defaultPicture.jpeg'
//@ts-ignore
import geminiLogo from '../assets/geminiLogo.png'

const {width} = Dimensions.get('window');

export function MessageCard({oasisMessage, toggle, isActive, isLoading}: {
    oasisMessage: OasisMessage,
    isActive?: boolean,
    toggle?: () => void,
    isLoading?: boolean
}) {
    const [isSaved, setIsSaved] = useState<boolean>(oasisMessage.isSaved!)
    const isChatbotSavedMessage = oasisMessage.from !== 'User' && isSaved
    const isChabotOptionMessage = oasisMessage.from !== 'User' && !isSaved
    const isUserMessage = oasisMessage.from === 'User' && isSaved
    const shouldScroll = !oasisMessage.isSaved && oasisMessage.message.length > 700


    function renderProfileImage() {
        if (oasisMessage.from === 'User') {
            return <FromImage source={userPicture}/>
        } else if (oasisMessage.from === 'ChatGPT') {
            return <FromImage source={chatGgptLogo}/>
        } else if (oasisMessage.from === 'Gemini') {
            return <FromImage source={geminiLogo}/>
        }
    }

    function renderMessage() {
        if (isChabotOptionMessage) {
            return (
                <OptionContainer isActive={isActive!}>
                    <Header>
                        {renderProfileImage()}
                        <FromName>{oasisMessage.from}</FromName>
                    </Header>
                    <OptionMessageContent shouldScroll={shouldScroll}>
                        {isLoading ? (
                            <ActivityIndicator size="large" color="#fff"/>
                        ) : (
                            <>
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
                            </>
                        )}
                    </OptionMessageContent>
                </OptionContainer>
            )
        } else if (isUserMessage) {
            return (
                <UserMessageContainer>
                    <Header>
                        <FromName>You</FromName>
                        {renderProfileImage()}
                    </Header>
                    <Message>{oasisMessage.message}</Message>
                </UserMessageContainer>
            )
        } else if (isChatbotSavedMessage) {
            return (
                <ChatbotMessageContainer>
                    <Header>
                        {renderProfileImage()}
                        <FromName>{oasisMessage.from}</FromName>
                    </Header>
                    <Message>{oasisMessage.message}</Message>
                </ChatbotMessageContainer>
            )
        }
    }

    return (
        <>
            {renderMessage()}
        </>
    )
}

const UserMessageContainer = styled.View`
  gap: 7px;
  width: ${width * 0.90}px;
  align-items: flex-end;
  align-self: flex-end;
  padding: 10px;
`

const ChatbotMessageContainer = styled.View`
  gap: 7px;
  width: ${width * 0.90}px;
  align-items: flex-start;
  align-self: flex-start;
  padding: 10px;
`

const OptionContainer = styled.View<{ isActive: boolean }>`
  display: flex;
  gap: 7px;
  justify-content: flex-start;
  margin-top: 12px;
  margin-right: 12px;
  width: ${width * 0.90}px;
  align-items: flex-start;
  background-color: ${props => props.isActive ? '#303030' : '#212121'};
  border-radius: 10px;
  padding: 10px;
  border: 2px solid ${props => props.isActive ? 'gray' : null};
`

const OptionMessageContent = styled.View <{ shouldScroll: boolean }>`
  border-radius: 10px;
  margin-left: 3px;
  margin-top: 3px;
  max-height: ${props => props.shouldScroll ? '450px' : 'auto'};
`

const UserMessageContent = styled.View <{ shouldScroll: boolean }>`
  border-radius: 10px;
  margin-right: 3px;
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
  font-weight: 500;
`