import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';
import HomeStack from './HomeStack';
import ToDoStack from './ToDoStack'
import FocusStack from './FocusStack';
import SleepStack from './SleepStack';
import GoalStack from './GoalStack';


const screens = {
    'Home': {
        screen: HomeStack
    },
    'To Do List': {
        screen: ToDoStack
    }, 
    'Focus Timer': {
        screen: FocusStack
    },
    'Sleep' : {
        screen: SleepStack
    },
    'Goal Setting': {
        screen: GoalStack
    }
} 

const DrawerNavigator = createDrawerNavigator(screens);

export default createAppContainer(DrawerNavigator);
