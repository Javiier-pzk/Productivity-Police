import { createStackNavigator } from 'react-navigation-stack';
import Home from '../screens/Home';
import Header from '../shared/header';
import React from 'react';
import {MaterialIcons} from '@expo/vector-icons'

const screens = {
    Home: {
        screen: Home,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => 
                    <Header title = 'Home' />,
                headerLeft: () => 
                    <MaterialIcons 
                        style = {{marginLeft: 15}}
                        name = 'menu'
                        size = { 28 }
                        color = '#fff'
                        onPress = { () => { 
                            navigation.openDrawer();
                        }}
                    />
            }
        }
    }
}

const HomeStack = createStackNavigator(screens, {
    defaultNavigationOptions: {
        headerTintColor: '#fff',
        headerStyle: {
            backgroundColor: '#4682b4'
        },
        headerLeft: () => null       
    }
});

export default HomeStack;