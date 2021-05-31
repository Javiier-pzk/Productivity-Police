import { createStackNavigator } from 'react-navigation-stack';
import ToDoApp from '../screens/ToDoApp/ToDo';
import Header from '../shared/header';
import React from 'react';


const screens = {
    ToDoList: {
        screen: ToDoApp,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => 
                    <Header navigation = { navigation } title = 'To Do List' />
            }
        }
    }
}

const ToDoStack = createStackNavigator(screens, {
    defaultNavigationOptions: {
        headerTintColor: '#fff',
        headerStyle: {
            backgroundColor: 'coral'},
    }
});

export default ToDoStack;