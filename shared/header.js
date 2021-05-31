import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function Header({ navigation, title, iconTitle, marginHorizontal }) {

    return (
        <View style = {styles.container}>
            <MaterialIcons
                style = {styles.icons}
                name = 'menu'
                size = { 28 }
                onPress = { () => navigation.openDrawer() }
            />
            <View style = {[styles.headerTitle, {
                marginHorizontal: marginHorizontal
            }]}>
                <Ionicons
                    color = '#fff'
                    size = {28}
                    name = {iconTitle}
                />
                <Text style = {styles.headerText}> {title} </Text>
                <View style = {{marginLeft:30}}></View>
            </View>
        </View>
            
        
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    icons: {
        color: '#fff',
        marginLeft: 5    
    },
    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
       
    },
    headerText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
        letterSpacing: 1,
        alignSelf: 'center'
    }
})