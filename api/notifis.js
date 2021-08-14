import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import {Alert, Platform} from 'react-native'
import firebase from './firebase';
import * as Authentication from './auth';

export const registerForPushNotificationsAsync = async () => {
    let token;
    if (Constants.isDevice) {
        const {status: existingStatus} = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const {status} = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted' ) {
            Alert.alert('Failed to get push token for push notification');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token)
        
        const userId = Authentication.getCurrentUserId();
        firebase.database().ref(`tokens/${userId}`)
            .set({
                token: token,
            })
        
    } else {
        Alert.alert('A physical device must be used for push notifcations')
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default' , {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        })
    }

    return token;
}

export const schedulePushNotificationForTasks =  async ({Title, Description, Category, DateTime, DateTimeFormatted}, onSuccess, onError) => {
    try {
        const identifier = await Notifications.scheduleNotificationAsync({
            content: {
                title: 'You have an upcoming task',
                body:  `${Category} - ${Title}`,
                data: {task: {Title, Category, Description, DateTimeFormatted}},
                sound: true
            },
            trigger: {date: DateTime}
        })
        return onSuccess(identifier);
    } catch (error) {
        return onError(error);
    }
}
