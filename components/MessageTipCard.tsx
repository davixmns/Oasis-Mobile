import styled from "styled-components/native";

export function MessageTipCard({tipMessage, onPress}: {tipMessage: string, onPress: () => void}) {
    const words = tipMessage.split(' ');

    return (
        <TipContainer onPress={onPress}>
            <TipContent>
                <TipBold>{words.slice(0, 3).join(' ')}</TipBold>
                <TipText>{words.slice(3, words.length).join(' ')}</TipText>
            </TipContent>
        </TipContainer>
    );
}

export const TipContainer = styled.TouchableOpacity`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70px;
    max-width: 280px;
    min-width: 150px;
    background-color: #1e1e1e;
    margin-right: 5px;
    margin-left: 5px;
    border-radius: 18px;
`
export const TipContent = styled.View`
    height: 40px;
    margin-left: 20px;
    margin-right: 20px;
`

export const TipBold = styled.Text`
    font-size: 16px;
    color: #fff;
    font-weight: bold;
`

export const TipText = styled.Text`
    font-size: 16px;
    color: #949494;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    text-overflow-ellipsis: ellipsis;
`