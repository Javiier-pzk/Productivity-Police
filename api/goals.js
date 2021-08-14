import firebase from './firebase';
import * as Notifications from 'expo-notifications'
import moment from "moment";

const db = firebase.database();

const newGoal = (id, Title, EndGoal, Category, DateTimeFormatted, Priority, Checkpoint1, Checkpoint2, Checkpoint3, completed, numCheckpoints, numCheckpointsCompleted, Identifier) => (
    {id, Title, EndGoal, Category, DateTimeFormatted, Priority, Checkpoint1, Checkpoint2, Checkpoint3, completed, numCheckpoints, numCheckpointsCompleted, Identifier}
);

export const createGoal = async ({userId, Title, EndGoal, Category, DateTimeFormatted, Priority, Checkpoint1, Checkpoint2, Checkpoint3, numCheckpoints, Identifier}, onSuccess, onError) => {
    try {
        const goal = db.ref(`goals/${userId}`).push();
        await goal.set(newGoal(goal.key, Title, EndGoal, Category, DateTimeFormatted, Priority, Checkpoint1, Checkpoint2, Checkpoint3, false, numCheckpoints, 0, Identifier));
        return onSuccess(goal)
    } catch (error) {
        return onError(error);
    }
}

export const editGoal = async ({Title, EndGoal, Category, DateTimeFormatted, Priority, Checkpoint1, Checkpoint2, Checkpoint3, completed, numCheckpoints, numCheckpointsCompleted, Identifier}, {userId, goalId}, onSuccess, onError) => {
    try {
        const goal = db.ref(`goals/${userId}/${goalId}`);
        await goal.update({Title, EndGoal, Category, DateTimeFormatted, Priority, Checkpoint1, Checkpoint2, Checkpoint3, completed, numCheckpoints, numCheckpointsCompleted, Identifier})
        return onSuccess(goal);
    } catch (error) {
        onError(error)
    }
}

export const updateGoalNotes = async ({ReflectionNote, Rating, ImprovementNote}, {userId, goalId}, onSuccess, onError) => {
    try {
        const goal = db.ref(`goals/${userId}/${goalId}`);
        await goal.update({ReflectionNote, Rating, ImprovementNote})
        return onSuccess(goal);
    } catch (error) {
        onError(error)
    }
}

export const updateNumCheckpointsCompleted = async (numCheckpointsCompleted, {userId, goalId}, onSuccess, onError) => {
    try {
        const goal = db.ref(`goals/${userId}/${goalId}`);
        await goal.update({numCheckpointsCompleted})
        return onSuccess(goal);
    } catch (error) {
        return onError(error);
    }
}

export const editCheckpoint1 = async (Checkpoint1, {userId, goalId}, onSuccess, onError ) => {
    try {
        const goal = db.ref(`goals/${userId}/${goalId}`);
        await goal.update({ Checkpoint1 });
        return onSuccess(goal);
    } catch (error) {
        return onError(error);
    }
 }

 export const editCheckpoint2 = async (Checkpoint2, {userId, goalId}, onSuccess, onError ) => {
    try {
        const goal = db.ref(`goals/${userId}/${goalId}`);
        await goal.update({ Checkpoint2 });
        return onSuccess(goal);
    } catch (error) {
        return onError(error);
    }
 }

 export const editCheckpoint3 = async (Checkpoint3, {userId, goalId}, onSuccess, onError ) => {
    try {
        const goal = db.ref(`goals/${userId}/${goalId}`);
        await goal.update({ Checkpoint3 });
        return onSuccess(goal);
    } catch (error) {
        return onError(error);
    }
 }

export const setGoalCompletion = async (completed, {userId, goalId}, onSuccess, onError ) => {
    try {
        const goal = db.ref(`goals/${userId}/${goalId}`);
        await goal.update({ completed });
        return onSuccess(goal);
    } catch (error) {
        return onError(error);
    }
 }

export const rescheduleNotifWhenUncomplete = async ({ userId, goalId }, onSuccess, onError) => {
    try {
        const goal = db.ref(`goals/${userId}/${goalId}`);
        const item =  await goal.get().then(snapshot => snapshot.val());
        const timeDiff = moment(item.DateTimeFormatted, 'MMMM Do YYYY, h:mm a').diff(new Date(), 'hours', true);
        if (timeDiff > 0) {
            const Identifier = await Notifications.scheduleNotificationAsync({
            content: {
                title: 'You have an upcoming goal',
                body:  `${item.Category} - ${item.Title}`,
                data: { 
                    goal: {
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
            await goal.update({ Identifier });
        }
        return onSuccess(goal);
    } catch (error) {
        return onError(error);
    }

}

export const completeGoal = ({userId, goalId}, onSuccess, onError) => {
    return setGoalCompletion(true, { userId, goalId }, onSuccess, onError);
}

export const uncompleteGoal = ({userId, goalId}, onSuccess, onError) => {
    return setGoalCompletion(false, { userId, goalId }, onSuccess, onError);
}

export const deleteGoal = async ({userId, goalId}, onSuccess, onError) => {
    try {
        await db.ref(`goals/${userId}/${goalId}`).remove();
        return onSuccess();
    } catch (error) {
        return onError(error)
    }
}

export const subscribe = (userId, onValueChanged) => {
    const goals = db.ref(`goals/${userId}`);
    goals.on('value', (snapshot) => onValueChanged(snapshot.val()));
    return () => goals.off('value');
}