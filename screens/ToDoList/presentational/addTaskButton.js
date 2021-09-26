import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

export default function AddTaskButton({ text, pressHandler }) {

    return(
        <TouchableOpacity onPress = {pressHandler}>
            <View style = {styles.button}>
                <Text style = {styles.text}> {text} </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({ 
    button: {
        backgroundColor: '#003D7C',
        paddingVertical: 14,
        paddingHorizontal: 10
    },
    text: {
        fontSize: 18,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 5,
        color: 'white',
        textAlign: 'center',
    }
})


