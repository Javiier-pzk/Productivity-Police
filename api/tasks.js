import firebase from './firebase';
import * as Notifications from 'expo-notifications'
import moment from "moment";

const db = firebase.database();

const newTask = (id, Title, Description, Category, DateTime, DateTimeFormatted, Priority, completed, Identifier) => (
    {id, Title, Description, Category, DateTime, DateTimeFormatted, Priority, completed, Identifier}
);

export const createTask = async ({userId, Title, Description, Category, DateTime, DateTimeFormatted, Priority, Identifier}, onSuccess, onError) => {
    try {
        const task = db.ref(`tasks/${userId}`).push();
        await task.set(newTask(task.key, Title, Description, Category, DateTime, DateTimeFormatted, Priority, false, Identifier));
        return onSuccess(task)
    } catch (error) {
        return onError(error);
    }
}

export const editTask = async (Title, Description, Category, DateTime, DateTimeFormatted, Priority, Identifier, {userId, taskId}, onSuccess, onError) => {
    try {
        const task = db.ref(`tasks/${userId}/${taskId}`);
        await task.update( {Title, Description, Category, DateTime, DateTimeFormatted, Priority, Identifier})
        return onSuccess(task);
    } catch (error) {
        onError(error)
    }
}

export const setTaskCompletion = async (completed, {userId, taskId}, onSuccess, onError ) => {
    try {
        const task = db.ref(`tasks/${userId}/${taskId}`);
        await task.update({ completed });
        return onSuccess(task);
    } catch (error) {
        return onError(error);
    }
 }

export const rescheduleNotifWhenUncomplete = async ({ userId, taskId }, onSuccess, onError) => {
    try {
        const task = db.ref(`tasks/${userId}/${taskId}`);
        const item =  await task.get().then(snapshot => snapshot.val());
        const timeDiff = moment(item.DateTimeFormatted, 'MMMM Do YYYY, h:mm a').diff(new Date(), 'hours', true);
        if (timeDiff > 0) {
            const Identifier = await Notifications.scheduleNotificationAsync({
            content: {
                title: 'You have an upcoming task',
                body:  `${item.Category} - ${item.Title}`,
                data: { 
                    task: {
                    Title: item.Title, 
                    Category: item.Category, 
                    Description: item.Description, 
                    DateTimeFormatted: item.DateTimeFormatted
                    }
                },
                sound: true
            },
            trigger: {date: moment(item.DateTimeFormatted, 'MMMM Do YYYY, h:mm a').toDate()}
            })
            await task.update({ Identifier });
        }
        return onSuccess(task);
    } catch (error) {
        return onError(error);
    }

}

export const completeTask = ({userId, taskId}, onSuccess, onError) => {
    return setTaskCompletion(true, { userId, taskId }, onSuccess, onError);
}

export const uncompleteTask = ({userId, taskId}, onSuccess, onError) => {
    return setTaskCompletion(false, { userId, taskId }, onSuccess, onError);
}

export const deleteTask = async ({userId, taskId}, onSuccess, onError) => {
    try {
        await db.ref(`tasks/${userId}/${taskId}`).remove();
        return onSuccess();
    } catch (error) {
        return onError(error)
    }
}

export const subscribe = (userId, onValueChanged) => {
    const tasks = db.ref(`tasks/${userId}`);
    tasks.on('value', (snapshot) => onValueChanged(snapshot.val()));
    return () => tasks.off('value');
}