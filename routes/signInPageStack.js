import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import SplashPage from '../screens/signIn/splashPage';
import SignInPage from '../screens/signIn/signInPage';
import SignUpPage from '../screens/signIn/signUpPage';
import Drawer from './drawer';

const screens = {
    'Splash Page': {
        screen: SplashPage
    },
    'Sign In Page': {
        screen: SignInPage
    },
    'Sign Up Page': {
        screen: SignUpPage
    },
    'Home': {
        screen: Drawer
    }
}

const SignInPageStack = createStackNavigator(screens, {
    defaultNavigationOptions: {
        headerShown: false  
    }
});

export default createAppContainer(SignInPageStack);