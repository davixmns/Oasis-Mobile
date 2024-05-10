import {OasisMessage} from "../interfaces/interfaces";
import styled from "styled-components/native";

//@ts-ignore
import chatGgptLogo from '../assets/chatGptLogo.png'
//@ts-ignore
import userPicture from '../assets/defaultPicture.jpeg'
//@ts-ignore
import geminiLogo from '../assets/geminiLogo.png'

import {useEffect, useState} from "react";

import {Dimensions, ScrollView, TouchableOpacity} from "react-native";

const {width} = Dimensions.get('window');


export function MessageCard({oasisMessage, toggle, isActive}: {
    oasisMessage: OasisMessage,
    isActive?: boolean,
    toggle?: () => void
}) {
    const [isSaved, setIsSaved] = useState<boolean>(oasisMessage.isSaved!)
    const isChatbotSavedMessage = oasisMessage.from !== 'User' && isSaved
    const isChabotOptionMessage = oasisMessage.from !== 'User' && !isSaved
    const isUserMessage = oasisMessage.from === 'User' && isSaved

    const shouldScroll = oasisMessage.isSaved === false && oasisMessage.message.length > 800




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
        if (isChabotOptionMessage) { // Chatbot option message
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
            )
        } else if (isUserMessage) { // User message
            return (
                <UserMessageContainer>
                    <Header>
                        <FromName>You</FromName>
                        {renderProfileImage()}
                    </Header>
                    <UserMessageContent shouldScroll={shouldScroll}>
                        <Message>{oasisMessage.message}</Message>
                    </UserMessageContent>
                </UserMessageContainer>
            )
        }
    }

    return (
        <>
            {renderMessage()}
        </>
    )
}

const UserMessageContainer = styled.TouchableOpacity`
  display: flex;
  gap: 7px;
  width: ${width * 0.90}px;
  align-items: flex-end;
  border-radius: 10px;
  align-self: flex-end;
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
  background-color: #212121;
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