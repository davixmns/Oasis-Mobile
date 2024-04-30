import React, {useEffect, useRef} from "react";
import {Container} from "./Styles";
import {useNavigation} from "@react-navigation/native";
import {useAuthContext} from "../contexts/AuthContext";
import {Button} from "react-native-paper";
import {Text, TouchableOpacity} from "react-native";

export default function Settings(){
    const {user} = useAuthContext()
    const navigation = useNavigation()


    return (
        <Container style={{backgroundColor: '#212121'}}>
            <Text style={{color: 'white'}}>Settings</Text>
            <Text style={{color: 'white'}}>User: {user?.Name}</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={{color: 'white'}}>Go Back</Text>
            </TouchableOpacity>
        </Container>
    );
}
