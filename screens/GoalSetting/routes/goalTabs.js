import React from 'react'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MaterialIcons} from '@expo/vector-icons';
import {NavigationContainer} from '@react-navigation/native';
import HabitStack from './habitStack';
import LongTermGoalStack from './longTermGoalStack';

const Tab = createBottomTabNavigator();

const Tabs = ({navigation}) => {

    const openDrawer = () => navigation.openDrawer()

    return (
        <NavigationContainer>
            <Tab.Navigator
                tabBarOptions = {{
                    labelPosition: 'below-icon',
                    labelStyle: {
                        fontSize: 13,
                    },
                    inactiveTintColor: '#748c94',
                }}
            >
                <Tab.Screen 
                    name = 'Habits' 
                    children = {() => <HabitStack navigation = {navigation} />}
                    options = {{
                        tabBarIcon: ({focused}) => (
                           <MaterialIcons
                             name = 'repeat'
                             size = {24}
                             color = {focused ? '#4682b4': '#748c94'}
                             style = {{marginTop: 5}}
                           />
                        )
                    }}  

                />
                <Tab.Screen 
                    name = 'Long Term Goals' 
                    children = {() => <LongTermGoalStack openDrawer = {openDrawer} />}
                    options = {{
                        tabBarIcon: ({focused}) => (
                           <MaterialIcons
                             name = 'receipt-long'
                             size = {24}
                             color = {focused ? '#4682b4': '#748c94'}
                             style = {{marginTop: 5}}
                           />
                        )
                    }}   
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default Tabs;