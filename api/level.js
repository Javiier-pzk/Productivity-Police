import firebase from './firebase';

const db = firebase.database();


export const editLevel = async (currentLevel, currentExp, userId, onSuccess, onError) => {
    try {
        console.log('updated level :' + currentLevel + ' updated exp: ' + currentExp + ' userId: ' + userId )
        const level = db.ref(`levelAndExp/${userId}`);
        await level.update({ currentLevel, currentExp })
        return onSuccess(level);
    } catch (error) {
        onError(error)
    }
}

export const subscribe = (userId, onValueChangedLevel, onValueChangedExp) => {
    const level = db.ref(`levelAndExp/${userId}`);
    level.on('value', (snapshot) => {
        console.log(snapshot.val());
        onValueChangedExp(snapshot.val().currentExp)
        onValueChangedLevel(snapshot.val().currentLevel)
        // console.log('level = ' + snapshot.val().currentLevel + ', exp = ' + snapshot.val().currentExp)
    })
    return () => level.off('value');
}
