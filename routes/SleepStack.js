import { createStackNavigator } from 'react-navigation-stack';
import Sleep from '../screens/Sleep';
import Header from '../shared/header';
import React from 'react';


const screens = {
    Sleep: {
        screen: Sleep,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => 
                    <Header navigation = { navigation } title = 'Sleep' />
            }
        }
    }
}

const HomeSleepStack = createStackNavigator(screens, {
    defaultNavigationOptions: {
        headerTintColor: '#fff',
        headerStyle: {backgroundColor: '#483d8b'},
    }
});

export default HomeSleepStack;