import {
    Keyboard, KeyboardAvoidingView, Platform, SafeAreaView,
    ActivityIndicator, FlatList, Dimensions, Alert, View
} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {FontAwesome6} from "@expo/vector-icons";
import styled from "styled-components/native";
import * as Animatable from 'react-native-animatable';
import {useState, useRef, useEffect} from "react";
import ChatInput from "../components/ChatInput";
import {OasisChat, OasisMessage} from "../interfaces/interfaces";
import {useChatContext} from "../contexts/ChatContext";
import {MessageSkeleton} from "../components/MessageSkeleton";
import {UserMessageCard} from "../components/UserMessageCard";
import {ChatbotMessageCard} from "../components/ChatbotMessageCard";
import {ChatbotOptionCard} from "../components/ChatbotOptionCard";
import {lowVibration, mediumVibration} from "../utils/utils";

const width = Dimensions.get('window').width;

const gptMessageExample = {
    from: 'ChatGPT',
    message: 'Hello, how can I help you?Lorem ipsum dolor sit amet. Ut molestiae nisi hic ipsa quia qui accusantium corrupti. Ut nostrum impedit vel quidem mollitia ab nisi tenetur id dolorem nisi 33 corrupti velit et cupiditate sequi. In quasi repudiandae qui ipsa voluptatem sed voluptates quia et doloribus reprehenderit.\n' +
        '\n' +
        'Ex quod illum sit atque repellat aut eaque accusamus non quidem omnis sit fugiat optio! Aut sapiente officia aut deserunt atque nam dolor placeat.\n' +
        '\n' +
        'Non suscipit iure ut optio cumque qui inventore repellat? In cupiditate mollitia et blanditiis eius ut rerum Quis cum dicta consequatur.',
    oasisChatId: 1,
    isSaved: false
}

const geminiMessageExample = {
    from: 'Gemini',
    message: 'Hello, how can I help you?Lorem ipsum dolor sit amet. Ut molestiae nisi hic ipsa quia qui accusantium corrupti. Ut nostrum impedit vel quidem mollitia ab nisi tenetur id dolorem nisi 33 corrupti velit et cupiditate sequi. In quasi repudiandae qui ipsa voluptatem sed voluptates quia et doloribus reprehenderit.\n' +
        '\n' +
        'Ex quod illum sit atque repellat aut eaque accusamus non quidem omnis sit fugiat optio! Aut sapiente officia aut deserunt atque nam dolor placeat.\n' +
        '\n' +
        'Non suscipit iure ut optio cumque qui inventore repellat? In cupiditate mollitia et blanditiis eius ut rerum Quis cum dicta consequatur.',
    oasisChatId: 1,
    isSaved: false
}

export function ChatScreen({chatData}: { chatData: OasisChat }) {
    const {chats, sendFirstMessage, saveChatbotMessage, sendMessageToChat} = useChatContext();
    const [messageIsLoading, setMessageIsLoading] = useState<boolean>(false);
    const [userMessage, setUserMessage] = useState('');
    const [chatInfo, setChatInfo] = useState<OasisChat>(chatData);
    const [chatMessages, setChatMessages] = useState<OasisMessage[]>(chatData.messages);
    const [actualChatGptResponse, setActualChatGptResponse] = useState<OasisMessage | null>(null)
    const [actualGeminiResponse, setActualGeminiResponse] = useState<OasisMessage | null>(null)
    const [renderSwippable, setRenderSwippable] = useState<boolean>(false)
    const [gptOptionIsActive, setGptOptionIsActive] = useState<boolean>(false)
    const [geminiOptionIsActive, setGeminiOptionIsActive] = useState<boolean>(false)
    const messageListRef = useRef<FlatList>(null);
    const optionListRef = useRef<FlatList>(null);
    const navigation = useNavigation();

    useEffect(() => {
        async function init() {
            if (chatInfo.isNewChat) {
                await handleSendFirstMessageToChat()
            }
        }

        init();
    }, [chatInfo]);


    async function handleSendFirstMessageToChat() {
        const firstMessage = chatData.messages[0].message;
        if (firstMessage === '') return;
        setMessageIsLoading(true);
        await sendFirstMessage(firstMessage)
            .then((responseData: any) => {
                setChatInfo(responseData.chat)
                const formattedTitle = `${chats.length}. ${responseData.chat.title}`
                navigation.setOptions({title: formattedTitle})
                setActualChatGptResponse(responseData?.chatbotMessages[0])
                setActualGeminiResponse(responseData?.chatbotMessages[1])
                setRenderSwippable(true);
                setUserMessage('')
                chatInfo.isNewChat = false;
            })
            .catch((error) => {
                Alert.alert('Erro ao enviar mensagem', error.response.status)
            })
            .finally(() => {
                setMessageIsLoading(false);
            })
    }

    async function handleSendMessageToChat() {
        if (userMessage == '') return
        const formattedMessage: OasisMessage = {
            from: 'User',
            message: userMessage,
            oasisChatId: chatInfo.oasisChatId,
            isSaved: true,
        }
        Keyboard.dismiss()
        setUserMessage('')
        setChatMessages([formattedMessage, ...chatMessages])
        scrollToStart()
        setMessageIsLoading(true)
        await sendMessageToChat(chatInfo.oasisChatId, [0, 1], userMessage)
            .then((responseData: any) => {
                setActualChatGptResponse(responseData[0])
                setActualGeminiResponse(responseData[1])
                setRenderSwippable(true)
                setUserMessage('')
            })
            .catch((error) => {
                Alert.alert('Erro ao enviar mensagem', error.response.status)
            })
            .finally(() => {
                setMessageIsLoading(false)
            })
    }

    async function handleSaveChatbotMessage() {
        const selectedMessage = gptOptionIsActive ? actualChatGptResponse : actualGeminiResponse
        if (!selectedMessage) return;
        mediumVibration()
        const formattedMessage: OasisMessage = {
            ...selectedMessage,
            isSaved: true,
            oasisChatId: chatInfo.oasisChatId
        }
        await saveChatbotMessage(formattedMessage)
            .then(async () => {
                await setChatMessages([formattedMessage, ...chatMessages])
                closeChatbotSelection()
            })
            .catch((e) => {
                Alert.alert('Erro ao salvar mensagem', e.response)
            })
    }

    function renderMessage({item}: { item: OasisMessage }) {
        const isChatbotSavedMessage = item.from !== 'User' && item.isSaved
        const isUserMessage = item.from === 'User'
        if (isUserMessage) return <UserMessageCard oasisMessage={item}/>
        if (isChatbotSavedMessage) return <ChatbotMessageCard oasisMessage={item}/>
        return <></>
    }

    function renderBottomContent() {
        if (renderSwippable && (gptOptionIsActive || geminiOptionIsActive)) {
            return (
                <Animatable.View animation={'fadeIn'} duration={1000}>
                    <BottomContent style={{paddingHorizontal: 12}}>
                        <SaveButton onPress={handleSaveChatbotMessage}>
                            <SaveText>Save Message</SaveText>
                        </SaveButton>
                        <CancelButton onPress={closeChatbotSelection}>
                            <SaveText style={{color: '#fff'}}>Cancel</SaveText>
                        </CancelButton>
                    </BottomContent>
                </Animatable.View>
            )
        }
        if (!messageIsLoading && !gptOptionIsActive && !geminiOptionIsActive && renderSwippable) {
            return (
                // @ts-ignore
                <BottomContent style={{width: 'unset', gap: 10}}>
                    <ChooseText>Choose a message</ChooseText>
                    <FontAwesome6 name={'circle-up'} size={30} color={'#fff'}/>
                </BottomContent>
            )
        }
        return (
            <BottomContent>
                <ChatInput
                    message={userMessage}
                    setMessage={(text) => {
                        if (text === '\n') {
                            Keyboard.dismiss();
                            return;
                        }
                        setUserMessage(text);
                    }}
                    onPress={handleSendMessageToChat}
                    isLoading={messageIsLoading}
                />
            </BottomContent>
        )
    }

    function scrollToStart() {
        messageListRef.current?.scrollToOffset({offset: 0, animated: true})
    }

    function closeChatbotSelection() {
        setRenderSwippable(false)
        setGptOptionIsActive(false)
        setGeminiOptionIsActive(false)
        setActualChatGptResponse(null)
        setActualGeminiResponse(null)
    }

    async function toggleChatGpt() {
        if (!gptOptionIsActive) {
            lowVibration()
            setGptOptionIsActive(true);
            setGeminiOptionIsActive(false);
        }
    }

    async function toggleGemini() {
        if (!geminiOptionIsActive) {
            lowVibration()
            setGeminiOptionIsActive(true);
            setGptOptionIsActive(false);
        }
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#000'}}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <FlatList
                    data={chatMessages}
                    renderItem={renderMessage}
                    keyExtractor={(item, index) => index.toString()}
                    inverted={true}
                    style={{
                        marginBottom: 8,
                        // backgroundColor: 'blue'
                    }}
                    ref={messageListRef}
                    ListHeaderComponent={
                        <>
                            {renderSwippable && !messageIsLoading && (
                                <FlatList
                                    horizontal
                                    ref={optionListRef}
                                    style={{
                                        paddingLeft: 5,
                                        paddingBottom: 20,
                                        marginTop: 12,
                                        // backgroundColor: 'red'
                                    }}
                                    contentContainerStyle={{alignItems: 'flex-start'}}
                                    data={[actualChatGptResponse!, actualGeminiResponse!].filter(Boolean)}
                                    keyExtractor={(item) => item!.from.toString()}
                                    renderItem={({item}) => (
                                        <Animatable.View animation={'fadeInUp'} duration={1000}>
                                            <ChatbotOptionCard
                                                oasisMessage={item}
                                                toggle={() => item.from === 'ChatGPT' ? toggleChatGpt() : toggleGemini()}
                                                isActive={item.from === 'ChatGPT' ? gptOptionIsActive : geminiOptionIsActive}
                                            />
                                        </Animatable.View>
                                    )}
                                    snapToInterval={width}
                                    decelerationRate={'fast'}
                                    showsHorizontalScrollIndicator={false}
                                />
                            )}
                            {messageIsLoading && <MessageSkeleton/>}
                        </>
                    }
                />

                {renderBottomContent()}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}


const ChooseText = styled.Text`
  font-size: 20px;
  font-weight: 500;
  color: white;
`

const BottomContent = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  margin-bottom: 5px;
  gap: 10px;
  align-self: center;
  //width: 95%;
`

const SaveButton = styled.TouchableOpacity`
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  padding: 10px;
  width: 60%;
`

const CancelButton = styled.TouchableOpacity`
  border: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  padding: 10px;
  width: 35%;
`

const SaveText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: black;
`

