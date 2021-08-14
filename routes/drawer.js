import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import HomeStack from './HomeStack';
import ToDoStack from '../screens/ToDoList/routes/toDoStack';
import FocusStack from '../screens/FocusTimer/routes/focusTimerStack'
import SleepStack from '../screens/Sleep/routes/sleepStack';
import GoalTabs from '../screens/GoalSetting/routes/goalTabs';
import ProfilePage from './profilePageStack'
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

const screens = {
    'Home': {
        screen: HomeStack,
        navigationOptions: {
            drawerIcon: () => (
                <Ionicons name = 'home' color = '#000000' size = {25} />
            ),
        }
    },
    'To Do List': {
        screen: ToDoStack,
        navigationOptions: {
            drawerIcon: () => (
                <Ionicons name = 'checkbox-outline' color = '#000000' size = {25} />
            ), 
        }
    },
    'Focus Timer': {
        screen: FocusStack,
        navigationOptions: {
            drawerIcon: () => (
                <Ionicons name = 'timer' color = '#000000' size = {25} />
            ), 
        }
    },
    'Sleep': {
        screen: SleepStack,
        navigationOptions: {
            drawerIcon: () => (
                <Ionicons name = 'bed' color = '#000000' size = {25} />
            ), 
        }
    },
    'Goal Setting': {
        screen: GoalTabs,
        navigationOptions: {
            drawerIcon: () => (
                <Ionicons name = 'flag' color = '#000000' size = {25} />
            ),
        }
    },
    'Profile': {
        screen: ProfilePage,
        navigationOptions: {
            drawerIcon: () => (
                <Ionicons name = 'person' color = '#000000' size = {25} />
            ), 
        }
    }
}

const DrawerNavigator = createDrawerNavigator(screens, {
    contentOptions: {
        labelStyle: {
            fontSize: 16
        },
        inactiveTintColor: '#444'
    }
})

export default DrawerNavigator;
