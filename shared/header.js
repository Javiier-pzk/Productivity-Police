import React from 'react';
import { StyleSheet, Text} from 'react-native';

export default function Header({title}) {

    return (
        <Text style = {styles.headerText}> {title} </Text>    
    )
}

const styles = StyleSheet.create({
    headerText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
        letterSpacing: 1,
        alignSelf: 'center'
    }
})