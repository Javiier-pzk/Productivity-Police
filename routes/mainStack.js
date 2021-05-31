import { createStackNavigator, HeaderBackButton } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import SignInStack from './signInPageStack';
import Drawer from './drawer'
import React from 'react';

const screens = {
    'Splash Page': {
        screen: SignInStack
    },
    'Home' : {
        screen: Drawer,
        navigationOptions: {
            headerLeft: () => null
        }
    }
}

const MainStack = createStackNavigator(screens, {
    defaultNavigationOptions: {
        headerShown: false,
        headerBackTitleVisible: false
    }
});


export default createAppContainer(MainStack);