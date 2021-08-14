import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, ImageBackground, TouchableOpacity, SafeAreaView } from 'react-native';
import * as Notifs from '../../../api/notifis';
import * as Notifications from 'expo-notifications';
import { MaterialIcons, Ionicons, FontAwesome, } from '@expo/vector-icons';
import { globalStyles } from '../presentational/globalStyles';


export default function Main({ navigation }) {

    return (
        <View>
            <ImageBackground
                source={require('../../../assets/starry_background.png')}
                style={{ width: '100%', height: '100%' }}
            >
                <SafeAreaView style={globalStyles.container}>
                    <Text style={globalStyles.titleText}>Choose your feature</Text>
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={styles.buttonAlarm}
                            onPress={() => navigation.navigate('Alarm setting')}
                        >
                            <Text style={styles.alarmText}>Alarm</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonAlarm}
                            onPress={() => navigation.navigate('Nap')}
                        >
                            <Text style={styles.alarmText}>Nap</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    icons: {
        position: 'absolute',
        marginTop: 55,
        marginHorizontal: 20,
        color: 'white',
        zIndex: 999,
    },
    buttonsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    buttonAlarm: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    alarmText: {
        fontFamily: 'moonglade-bold',
        fontSize: 40,
        color: 'white',
    }
})