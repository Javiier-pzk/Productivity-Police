import { createStackNavigator } from '@react-navigation/stack';
import React from 'react'
import CreateLongTermGoalsForm from '../screens/createLongTermGoalForm';
import CreateCP1Form from '../screens/createCP1Form'
import CreateCP2Form from '../screens/createCP2Form'
import CreateCP3Form from '../screens/createCP3Form'

const Stack = createStackNavigator();

export default function CheckPointStack() {
    return (
        <Stack.Navigator headerMode = 'none'>
            <Stack.Screen
                name = 'New Goal'
                component = {CreateLongTermGoalsForm}
            />
            <Stack.Screen
                name = 'Checkpoint 1'
                component = {CreateCP1Form}
            />
            <Stack.Screen
                name = 'Checkpoint 2'
                component = {CreateCP2Form}
            />
            <Stack.Screen
                name = 'Checkpoint 3'
                component = {CreateCP3Form}
            />
        </Stack.Navigator>
    )
}

