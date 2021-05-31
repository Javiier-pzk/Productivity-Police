import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import SplashPage from '../screens/signIn/splashPage';
import SignInPage from '../screens/signIn/signInPage';
import SignUpPage from '../screens/signIn/signUpPage';
import React from 'react';

const screens = {
    'Splash Page': {
        screen: SplashPage,
    },
    'Sign In Page': {
        screen: SignInPage
    },
    'Sign Up Page': {
        screen: SignUpPage
    }
}

const SignInPageStack = createStackNavigator(screens, {
    defaultNavigationOptions: {
        headerShown: false
    }
});


export default SignInPageStack;