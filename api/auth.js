import { Alert } from 'react-native';
import firebase from './firebase';
import * as Firebase from 'firebase';
import moment from 'moment';

const auth = firebase.auth();

export const signIn = async ({Email, Password}, onSuccess, onError) => {
    try {
        const {user} = await auth.signInWithEmailAndPassword(Email, Password);
        return onSuccess(user);
    } catch (error) {
        return onError(error);
    }
}

export const createAccount = async ({Username ,Email, Password}, onSuccess, onError) => {
    try {
        const {user} = await auth.createUserWithEmailAndPassword(Email, Password);
        if (user) {
            await user.updateProfile({displayName: Username})
            await user.sendEmailVerification();
            const userInfo = firebase.database().ref(`users/${user.uid}`);
            const alarms = firebase.database().ref(`alarms/${user.uid}`);
            const levelAndExp = firebase.database().ref(`levelAndExp/${user.uid}`);
            const newUser = {
                taskCount: 0,
                currentLevel: 1,
                currentExp: 0,
                bedTime: moment(new Date()).format("HH:mm"),
                wakeUpTime: moment(new Date()).format("HH:mm"),
                longTermGoals: 0,
                recurringGoals: 0,
                emailVerified: user.emailVerified,
                username: user.displayName,
                photoURL: user.photoURL,
            }
            const newUserAlarmsSetUp = {
                bedTime: moment(new Date()).format("HH:mm"),
                wakeUpTime: moment(new Date()).format("HH:mm"),
                bedTimeIdentifier: '',
                wakeUpTimeIdentifier: '',
            }
            const newUserLevelAndExpSetUp = {
                currentLevel: 1,
                currentExp: 0
            }
            userInfo.set(newUser);
            alarms.set(newUserAlarmsSetUp);
            levelAndExp.set(newUserLevelAndExpSetUp);
            return onSuccess(user);
        }
    } catch (error) {
        return onError(error);
    }
}

export const signOut = async (onSuccess, onError) => {
    try {
        await auth.signOut();
        return onSuccess();
    } catch (error) {
        return onError(error);
    }
}

export const reauthenticate = (currentPassword) => {
    const user = auth.currentUser;
    const credentials = Firebase
        .default
        .auth
        .EmailAuthProvider
        .credential(user.email, currentPassword);
    return user.reauthenticateWithCredential(credentials);
}

export const getCurrentUserId = () => auth.currentUser ? auth.currentUser.uid : null;

export const emailVerified = () => auth.currentUser ? auth.currentUser.emailVerified : null;

export const getCurrentUserEmail = () => auth.currentUser ? auth.currentUser.email : null;

export const getCurrentUserName = () => auth.currentUser ? auth.currentUser.displayName : null;

export const getCurrentUserPhoto = () => auth.currentUser ? auth.currentUser.photoURL: null

export const sendVerificationEmail = () => auth.currentUser ? auth.currentUser.sendEmailVerification() : null;

export const sendPasswordResetEmail = async (email, onSuccess, onError) => {
    try {
        await auth.sendPasswordResetEmail(email);
        return onSuccess();
    } catch (error) {
        return onError(error)
    }
}

export const updateProfile = ({ Username, Image }) => {
    const user = auth.currentUser;
    if (user) {
        user.updateProfile({
            displayName: Username,
            photoURL: Image
        })
    }
}

export const removePhoto = () => {
    const user = auth.currentUser;
    if (user) {
        user.updateProfile({
            photoURL: null
        })
    }
}

export const updateEmail = ({Email, Password}) => {
    reauthenticate(Password)
    .then(() => auth.currentUser.updateEmail(Email)
            .then(Alert.alert('Email successfully changed'))
            .catch(error => Alert.alert(error.message))
    )
    .catch(error => Alert.alert(error.message))
}
    
export const updatePassword = ({newPassword, oldPassword}) => {
    reauthenticate(oldPassword)
    .then(() => auth.currentUser.updatePassword(newPassword)
            .then(Alert.alert('Password successfully changed'))
            .catch(error => Alert.alert(error.message))
    )
    .catch(error => Alert.alert(error.message))
}
  
export const setOnAuthStateChanged = (onUserAuthenticated, onUserNotFound) => {
    auth.onAuthStateChanged(user=> {
        if (user) {
            return onUserAuthenticated(user);
        } else {
            return onUserNotFound(user);
        }
    });
}

export const checkVerified = (onIdTokenChanged) => {
    try {
        auth.onIdTokenChanged(user => {
            if (user) {
                if (user.emailVerified) {
                    return onIdTokenChanged();
                } else {
                    user.reload()
                }
            }
        })
    } catch (error) {
        Alert.alert(error.message)
    }
} 



              