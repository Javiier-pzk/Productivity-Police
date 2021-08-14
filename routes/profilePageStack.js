import { createStackNavigator } from 'react-navigation-stack';
import ProfileScreen from '../screens/ProfilePage/profileScreen';
import EditProfileScreen from '../screens/ProfilePage/editProfileScreen';
import React from 'react';
import Header from '../shared/header'
import ChangePasswordScreen from '../screens/ProfilePage/changePassword';
import ChangeEmailScreen from '../screens/ProfilePage/changeEmail';
import {MaterialIcons} from '@expo/vector-icons'

const screens = {
    'Account Details': {
        screen: ProfileScreen,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => 
                    <Header title = 'Account Details' />,
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
    },
    'Edit Profile': {
        screen: EditProfileScreen
    }, 
    'Change Email' : {
        screen: ChangeEmailScreen
    },
    'Change Password': {
        screen: ChangePasswordScreen
    }
}

const ProfilePageStack = createStackNavigator(screens, {
    defaultNavigationOptions: {
        headerTintColor: '#fff',
        headerStyle: {
            backgroundColor: '#4682b4'},
        headerTitleAlign: 'center'
    }
})

export default ProfilePageStack;