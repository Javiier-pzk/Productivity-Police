import { createStackNavigator } from 'react-navigation-stack';
import Main from '../screens/main';
import TaskDetails from '../screens/taskDetails';
import Header from '../../../shared/header';
import {MaterialIcons} from '@expo/vector-icons';
import React, { useState } from "react";
import * as Notifications from 'expo-notifications';
import * as Authentication from '../../../api/auth'
import { Alert, View, Modal} from "react-native";
import CreateTaskForm from "../screens/createTaskForm";
import moment from "moment";
import * as Tasks from '../../../api/tasks';

const screens = {
    'To Do List': {
        screen: Main,
        navigationOptions: ({navigation}) => {
            return {
                headerTitle: () => <Header title = 'To Do List' />,
                headerLeft: () => 
                    <MaterialIcons 
                        style = {{marginLeft: 15}}
                        name = 'menu'
                        size = { 28 }
                        color = '#fff'
                        onPress = { () => { 
                            navigation.openDrawer();
                        }}
                    />,
                headerRight: () => {
                    const [modalOpen, setModalOpen] = useState(false);
                    const closeModal = () => setModalOpen(false);

                    const handleCreateTask = async (values, cat, dateTime, dateTimeFormatted, priority) => {
                        try {
                            const title = values.Title;
                            const description = values.Description;
                            values.userId = Authentication.getCurrentUserId();
                            values.Category = cat;
                            values.DateTime = dateTime;
                            values.DateTimeFormatted = dateTimeFormatted;
                            values.Priority = priority;
                            const identifier = await Notifications.scheduleNotificationAsync({
                                content: {
                                    title: 'You have an upcoming task',
                                    body:  `${cat} - ${title}`,
                                    data: { 
                                    task: {
                                    Title: title, 
                                    Category: cat, 
                                    Description: description, 
                                    DateTimeFormatted: dateTimeFormatted
                                    }
                                    },
                                    sound: true
                                },
                                trigger: {date: dateTime,
}
                            })
                            values.Identifier = identifier;
                            setModalOpen(false);
                            return Tasks.createTask(
                                values,
                                () => {},
                                (error) => Alert.alert(error.message)
                            )
                        } catch (error) {
                            return Alert.alert('Invalid date or time', 
                            'Task completion date and time must be sometime in the future');
                        }
                    }
                    
                    return (
                        <View style = {{marginRight: 15}}>
                            <Modal visible={modalOpen} animationType="slide">
                                <CreateTaskForm 
                                    handleCreateTask={handleCreateTask}  
                                    closeModal = {closeModal}
                                />
                            </Modal>

                            <MaterialIcons 
                                name = 'add' 
                                size = {30} 
                                color = '#fff'
                                onPress = {() => setModalOpen(true)} 
                            />
                        </View>
                    )
                }
            }
        }
    },
    'Task Details': {
        screen: TaskDetails
    }
}


const ToDoStack = createStackNavigator(screens, {
    defaultNavigationOptions: {
        headerTintColor: '#fff',
        headerStyle: {
            backgroundColor: 'coral'
        },
        headerTitleAlign: 'center'
    }
});

export default ToDoStack;
