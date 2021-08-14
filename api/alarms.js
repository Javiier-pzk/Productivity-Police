import firebase from './firebase';

const db = firebase.database();

export const editWakeTime = async (wakeUpTime, wakeUpTimeIdentifier, userId, onSuccess, onError) => {
    try {
        console.log('editWakeTime used')
        const wakeAlarm = db.ref(`alarms/${userId}`);
        await wakeAlarm.update({wakeUpTime, wakeUpTimeIdentifier});
        return onSuccess(wakeAlarm);
    } catch (error) {
        onError(error)
    }
}



export const editBedTime = async (bedTime, bedTimeIdentifier, userId, onSuccess, onError) => {
    try {
        console.log('editBedTime used')
        const bedAlarm = db.ref(`alarms/${userId}`);
        await bedAlarm.update({bedTime, bedTimeIdentifier});
        console.log('reached end of editBedTime')
        return onSuccess(bedAlarm);
    } catch (error) {
        onError(error)
    }
}



export const subscribe = (userId, onValueChangeWakeTime, onValueChangeBedTime, onValueChangedWakeIden, onValueChangedBedIden) => {
    const timeChange = db.ref(`alarms/${userId}`);
    timeChange.on('value', (snapshot) => {
        onValueChangedWakeIden(snapshot.val().wakeUpTimeIdentifier)
        onValueChangeWakeTime(snapshot.val().wakeUpTime)
        onValueChangeBedTime(snapshot.val().bedTime)
        onValueChangedBedIden(snapshot.val().bedTimeIdentifier)
    })
    return () => timeChange.off('value');
}