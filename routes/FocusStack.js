import { createStackNavigator } from 'react-navigation-stack';
import FocusTimer from '../screens/FocusTimer';
import Header from '../shared/header';
import React from 'react';


const screens = {
    FocusTimer: {
        screen: FocusTimer,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => 
                    <Header navigation = { navigation } title = 'Focus Timer' />
            }
        }
    }
}

const HomeFocusStack = createStackNavigator(screens, {
    defaultNavigationOptions: {
        headerTintColor: '#fff',
        headerStyle: {backgroundColor: '#7b68ee'},
    }
});

export default HomeFocusStack;