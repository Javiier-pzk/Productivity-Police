import { createStackNavigator } from 'react-navigation-stack';
import GoalSetting from '../screens/GoalSetting';
import Header from '../shared/header';
import React from 'react';


const screens = {
    GoalSetting: {
        screen: GoalSetting,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => 
                    <Header navigation = { navigation } title = 'Set Goals' />
            }
        }
    }
}

const HomeGoalStack = createStackNavigator(screens, {
    defaultNavigationOptions: {
        headerTintColor: '#fff',
        headerStyle: {backgroundColor: '#32cd32'},
    }
});

export default HomeGoalStack;