import styled from "styled-components/native";

export function MessageTipCard({tipMessage}: {tipMessage: string}) {
    const words = tipMessage.split(' ');

    return (
        <TipContainer>
            <TipContent>
                <TipBold>{words.slice(0, 3)}</TipBold>
                <TipText>{words.slice(3, words.length)}</TipText>
            </TipContent>
        </TipContainer>
    );
}

export const TipContainer = styled.TouchableOpacity`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    height: 70px;
    background-color: #303030;
    margin-right: 10px;
    margin-left: 10px;
    border-radius: 10px;
`

    //espaçamento de 10px
export const TipContent = styled.View`
    width: calc(100% - 20px);
    height: calc(100% - 30px);
    background-color: green;
    
    text-overflow: ellipsis;
    
`

export const TipBold = styled.Text`
    font-size: 16px;
    color: #fff;
    font-weight: bold;
`

export const TipText = styled.Text`
    font-size: 16px;
    color: #fff;
    font-weight: 500;
`