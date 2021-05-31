import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';


export default function Header({ navigation, title }) {

    return (
        <View style = {styles.container}>
            <MaterialIcons
                style = {styles.icons}
                name = 'menu'
                size = { 28 }
                onPress = { () => navigation.openDrawer() }
            />
            <View>
                <Text style = {styles.headerText}> {title} </Text>
            </View>
        </View>
            
        
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icons: {
        color: '#fff',
        position: 'absolute',
        left: Platform.OS === 'ios' ? -40 : 1
    },
    headerText: {
        color: '#fff',
        fontFamily: 'nunito-bold',
        fontWeight: 'bold',
        fontSize: 20,
        letterSpacing: 1,
    }
})