import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import SplashPage from '../screens/signIn/splashPage';
import SignInPage from '../screens/signIn/signInPage';
import SignUpPage from '../screens/signIn/signUpPage';
import VerifyEmail from '../screens/signIn/verifyEmail'
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
    'Verify Email': {
        screen: VerifyEmail
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