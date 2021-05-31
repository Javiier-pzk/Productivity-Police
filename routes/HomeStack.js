import { createStackNavigator } from 'react-navigation-stack';
import Home from '../screens/Home';
import Header from '../shared/header';
import React from 'react';

const screens = {
    Home: {
        screen: Home,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => 
                    <Header navigation = { navigation } 
                        title = 'Home' 
                        iconTitle = 'home' 
                        marginHorizontal = {105}
                    />
            }
        }
    }
}

const HomeStack = createStackNavigator(screens, {
    defaultNavigationOptions: {
        headerTintColor: '#fff',
        headerStyle: {
            backgroundColor: '#708090'
        },
        headerLeft: () => null       
    }
});

export default HomeStack;