import { createStackNavigator } from 'react-navigation-stack';
import Sleep from '../screens/Sleep';
import Header from '../shared/header';
import React from 'react';
import {MaterialIcons} from '@expo/vector-icons'


const screens = {
    Sleep: {
        screen: Sleep,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => 
                    <Header title = 'Sleep' />,
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

const HomeSleepStack = createStackNavigator(screens, {
    defaultNavigationOptions: {
        headerTintColor: '#fff',
        headerStyle: {backgroundColor: '#008080'},
        headerLeft: () => null
    }
});

export default HomeSleepStack;