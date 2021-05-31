import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { globalStyles } from '../Styles/globalStyles';

export default function Home( { navigation }) {

    const pressHandler = () => navigation.navigate('To Do List');

    return (
        <View style = {globalStyles.container}>
            <TouchableOpacity 
            style = {styles.button}
            onPress = {pressHandler}>
                <Text style = {styles.text}> To Do List </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'coral'
    },
    text: {
        fontSize: 20,
        fontFamily: 'nunito-bold',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 5,
        color: 'white',
        textAlign: 'center'
    }
})