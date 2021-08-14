import firebase from './firebase';

const db = firebase.database();

export const subscribe = (userId, onValueChanged) => {
    const user = db.ref(`users/${userId}`);
    user.on('value', (snapshot) => onValueChanged(snapshot.val()));
    return () => user.off('value');
}

export const sleepSubscribe = (userId, onValueChangeWakeTime, onValueChangeBedTime, onValueChangedWakeIden, onValueChangedBedIden) => {
    const timeChange = db.ref(`users/${userId}`);
    timeChange.on('value', (snapshot) => {
        onValueChangedWakeIden(snapshot.val().wakeUpTimeIdentifier)
        onValueChangeWakeTime(snapshot.val().wakeUpTime)
        onValueChangeBedTime(snapshot.val().bedTime)
        onValueChangedBedIden(snapshot.val().bedTimeIdentifier)
    })
    return () => timeChange.off('value');
}

export const updateTaskCount = async (taskCount, userId, onSuccess, onError) => {
    try {
        const user = db.ref(`users/${userId}`);
        await user.update({taskCount});
        return onSuccess(user);
    } catch (error) {
        return onError(error)
    }
}

export const updateHabitCount = async (recurringGoals, userId, onSuccess, onError) => {
    try {
        const user = db.ref(`users/${userId}`);
        await user.update({recurringGoals});
        return onSuccess(user);
    } catch (error) {
        return onError(error)
    }
}

export const updateGoalCount = async (longTermGoals, userId, onSuccess, onError) => {
    try {
        const user = db.ref(`users/${userId}`);
        await user.update({longTermGoals});
        return onSuccess(user);
    } catch (error) {
        return onError(error)
    }
}

export const updateBedTime = async (bedTime, userId, onSuccess, onError) => {
    try {
        const user = db.ref(`users/${userId}`);
        await user.update({bedTime});
        return onSuccess(user);
    } catch (error) {
        return onError(error)
    }
}


export const updateWakeUpTime = async (wakeUpTime, userId, onSuccess, onError) => {
    try {
        const user = db.ref(`users/${userId}`);
        await user.update({wakeUpTime});
        return onSuccess(user);
    } catch (error) {
        return onError(error)
    }
}

export const updateLevelAndExp = async (currentLevel, currentExp, userId, onSuccess, onError) => {
    try {
        const user = db.ref(`users/${userId}`);
        await user.update({currentLevel, currentExp});
        return onSuccess(user);
    } catch (error) {
        return onError(error)
    }
}


export const verification = (userId, onValueChanged) => {
    const user = db.ref(`users/${userId}`);
    user.on('value', (snapshot) => onValueChanged(snapshot.val()));
    return () => user.off('value');
}

export const updateVerification = async (emailVerified, userId, onSuccess, onError) => {
    try {
        const user = db.ref(`users/${userId}`);
        await user.update({ emailVerified });
        return onSuccess(user);
    } catch (error) {
        return onError(error)
    }
}

export const updateUsernameAndPhoto = async (username, photoURL, userId, onSuccess, onError) => {
    try {
        const user = db.ref(`users/${userId}`);
        await user.update({ username, photoURL });
        return onSuccess(user);
    } catch (error) {
        return onError(error)
    }
}