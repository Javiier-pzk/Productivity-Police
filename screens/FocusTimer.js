import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { globalStyles } from '../Styles/globalStyles';

export default function FocusTimer() {
    return (
        <View style = {globalStyles.container}>
            <Text style = {globalStyles.titleText}> Focus Timer </Text>
        </View>
    )
}