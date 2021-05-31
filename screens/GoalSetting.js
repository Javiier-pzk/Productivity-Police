import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { globalStyles } from '../Styles/globalStyles';

export default function GoalSetting() {
    return (
        <View style = {globalStyles.container}>
            <Text style = {globalStyles.titleText}> Goal Setting</Text>
        </View>
    )
}