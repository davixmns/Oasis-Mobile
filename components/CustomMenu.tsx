import {Menu, PaperProvider} from "react-native-paper";
import {TouchableOpacity} from "react-native";
import {useState} from "react";
import styled from "styled-components/native";
import {FontAwesome6} from "@expo/vector-icons";
import {StyleSheet} from "react-native";
import {useOasisThemeContext} from "../contexts/OasisThemeContext";

interface CustomMenuProps {
    options: string[];
    width: number;
    selectOption: (option: string) => void;
    anchor: JSX.Element;
    selectedOption: string;
}

export function CustomMenu({options, selectedOption, selectOption, width, anchor}: CustomMenuProps) {
    const [isVisible, setIsVisible] = useState(false);
    const {oasisTheme} = useOasisThemeContext();

    function handleSelectOption(option: string) {
        selectOption(option);
        setIsVisible(false);
    }

    return (
        <Menu
            visible={isVisible}
            onDismiss={() => setIsVisible(false)}
            anchor={<TouchableOpacity onPress={() => setIsVisible(true)}>{anchor}</TouchableOpacity>}
            contentStyle={[
                {
                    ...styles.menuStyle,
                    backgroundColor: oasisTheme.settingsItemBackground,
                    width: width,
                    height: 45 * options.length
                },
            ]}
            anchorPosition={'top'}
        >
            {options.map((option, index) => (
                <TouchableOpacity key={option} onPress={() => handleSelectOption(option)}>
                    <MenuItem key={option}>
                        {option === selectedOption && (
                            <CheckIcon />
                        )}
                        <OptionText>
                            {option}
                        </OptionText>
                    </MenuItem>
                    {index < options.length - 1 && <WhiteLine />}
                </TouchableOpacity>
            ))}
        </Menu>
    );
}

const styles = StyleSheet.create({
    menuStyle: {
        paddingTop: -10,
        borderRadius: 15,
        bottom: 85,
        right: 8,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 1,
    }
})


const MenuItem = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 45px;
    position: relative;
`

const CheckIcon = styled(FontAwesome6).attrs({
    name: 'check',
    size: 15,
})`
    color: ${props => props.theme.primaryText};
    position: absolute;
    left: 16px;
    top: 15px;
`

const OptionText = styled.Text`
    font-size: 15px;
    color: ${props => props.theme.primaryText};
    margin-left: 40px;
`

const WhiteLine = styled.View`
    width: 100%;
    height: 1px;
    opacity: 0.2;
    background-color: gray;
`