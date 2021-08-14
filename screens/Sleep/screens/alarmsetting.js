import React, { useEffect, useState, useRef } from 'react';
import { ImageBackground, Text, View, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { globalStyles } from '../presentational/globalStyles';
import * as Authentication from '../../../api/auth';
import * as Notifs from '../../../api/notifis';
import * as Alarms from '../../../api/alarms';
import * as Notifications from 'expo-notifications';
import { MaterialIcons, Ionicons, FontAwesome, } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { Audio } from 'expo-av';
import moment from "moment";
import { clockHours as dataHour, clockSixty as dataSixty } from '../data';
import { EvilIcons } from '@expo/vector-icons';
import Dialog, { DialogContent, DialogTitle, ScaleAnimation } from 'react-native-popup-dialog';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import * as Profile from '../../../api/profile';

export default function AlarmSetting({ navigation }) {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const responseListener = useRef()
    const notificationListener = useRef()
    const [userId, setUserId] = useState(Authentication.getCurrentUserId())

    const [wakeHour, setWakeHour] = useState(new Date().getHours() > 12 ? (new Date().getHours() - 12).toString() : new Date().getHours().toString())
    const [wakeMinutes, setWakeMinutes] = useState(new Date().getMinutes() < 10 ? '0' + new Date().getMinutes().toString() : new Date().getMinutes().toString())
    const [wakeAmpm, setWakeAmpm] = useState(new Date().getHours() >= 12 ? 'PM' : 'AM')
    const [wakeIdentifier, setWakeIdentifier] = useState()
    const [bedHour, setBedHour] = useState(new Date().getHours() > 12 ? (new Date().getHours() - 12).toString() : new Date().getHours().toString())
    const [bedMinutes, setBedMinutes] = useState(new Date().getMinutes() < 10 ? '0' + new Date().getMinutes().toString() : new Date().getMinutes().toString())
    const [bedAmpm, setBedAmpm] = useState(new Date().getHours() >= 12 ? 'PM' : 'AM')
    const [bedIdentifier, setBedIdentifier] = useState()

    const [mode, setMode] = useState('sleepReminder')
    const [popupOpen, setPopupOpen] = useState(false)

    useEffect(() => {
        console.log('notifs registered')
        Notifs.registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(
            response => navigation.navigate('Alarm setting')

        );

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    useEffect(() => {
        console.log('subscribe called')
        return Alarms.subscribe(userId, setWakeTime, setBedTime, setWakeIdentifier, setBedIdentifier);
    }, []
    );

    const handleOnPress = async () => {
        try {
            if (mode === 'sleepReminder') {
                await Notifications.cancelScheduledNotificationAsync(bedIdentifier);
                console.log('bed notif cancelled ' + bedIdentifier)
                const newBedIdentifier = await Notifications.scheduleNotificationAsync({
                    content: {
                        title: 'It is time for bed!',
                        body: 'Remember not to procrastinate on sleep!',
                        data: {},
                        sound: true,
                        vibrate: [1000, 1000, 1000],
                    },
                    trigger: {
                        hour: bedAmpm === 'AM' ? (bedHour === '12' ? 0 : parseInt(bedHour)) : bedHour === '12' ? 12 : parseInt(bedHour) + 12,
                        minute: parseInt(bedMinutes),
                        repeats: true
                    }
                })
                const bedTime = bedAmpm === 'AM' ? (bedHour === '12' ? `${'00'}:${bedMinutes}` : (parseInt(bedHour) < 10 ? `${0}${bedHour}:${bedMinutes}` : `${bedHour}:${bedMinutes}`)) : bedHour === '12' ? `12:${bedMinutes}` : `${(parseInt(bedHour) + 12).toString()}:${bedMinutes}`
                Alarms.editBedTime(bedTime, newBedIdentifier, userId, () => {}, (error) => Alert.alert(error.message))
                Profile.updateBedTime(bedTime, userId, () => {}, error => Alert.alert(error.message));
                Alert.alert('Success!', 'Bedtime successfully updated');
            } else {
                await Notifications.cancelScheduledNotificationAsync(wakeIdentifier);
                console.log('alarm notif cancelled')
                const newWakeIdentifier = await Notifications.scheduleNotificationAsync({
                    content: {
                        title: 'Wake up!',
                        body: 'Rise and Shine!',
                        data: {},
                        sound: true,
                        vibrate: [1000, 1000, 1000],
                    },
                    trigger: {
                        hour: wakeAmpm === 'AM' ? parseInt(wakeHour) : parseInt(wakeHour) === 12 ? parseInt(wakeHour) : parseInt(wakeHour) + 12,
                        minute: parseInt(wakeMinutes),
                        repeats: true
                    }
                })
                console.log('alarm notif re scheduled')
                const wakeTime = wakeAmpm === 'AM' ? (wakeHour === '12' ? `${'00'}:${wakeMinutes}` : (parseInt(wakeHour) < 10 ? `${0}${wakeHour}:${wakeMinutes}` : `${wakeHour}:${wakeMinutes}`)) : wakeHour === '12' ? `12:${wakeMinutes}` : `${(parseInt(wakeHour) + 12).toString()}:${wakeMinutes}`
                Alarms.editWakeTime(wakeTime, newWakeIdentifier, userId, () => {}, (error) => Alert.alert(error.message));
                Profile.updateWakeUpTime(wakeTime, userId, () => {}, error => Alert.alert(error.message));
                Alert.alert('Success!', 'Alarm successfully updated');
            }
        } catch (e) {
            console.log(e);
        }
    }

    const setWakeTime = (time) => {
        if (time === undefined) {

        } else {

            setWakeHour(parseInt(time.substring(0, 2)) > 12 ? (parseInt(time.substring(0, 2)) - 12).toString() : parseInt(time.substring(0, 2)) >= 10 ? time.substring(0, 2) : time.substring(0, 2) === '00' ? '12' : time.substring(1, 2))
            setWakeMinutes(time.substring(3))
            setWakeAmpm(parseInt(time.substring(0, 2)) >= 12 ? 'PM' : 'AM')
            console.log('wake time hours: ' + time.substring(0, 2) + ' and minutes: ' + time.substring(3))
        }
    }


    const setBedTime = (time) => {
        if (time === undefined) {

        } else {

            setBedHour(parseInt(time.substring(0, 2)) > 12 ? (parseInt(time.substring(0, 2)) - 12).toString() : parseInt(time.substring(0, 2)) >= 10 ? time.substring(0, 2) : time.substring(0, 2) === '00' ? '12' : time.substring(1, 2))
            setBedMinutes(time.substring(3))
            setBedAmpm(parseInt(time.substring(0, 2)) >= 12 ? 'PM' : 'AM')
            console.log('bed time hour: ' + time.substring(0, 2) + ' and minutes: ' + time.substring(3))
        }
    }

    


    return (

        <View>
            <ImageBackground
                source={require('../../../assets/starry_background.png')}
                style={{ width: '100%', height: '100%' }}
            >
                <SafeAreaView style={globalStyles.container}>
                    <View style={styles.toggleComponent}>
                        <TouchableOpacity
                            style={styles.recoButton}
                            onPress={() => {
                                setMode('sleepReminder')
                            }}
                        >
                            <Text style={styles.recoTime}>Set reminder</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.recoButton}
                            onPress={() => {
                                setMode('alarm')
                            }}
                        >
                            <Text style={styles.recoTime}>Set alarm</Text>
                        </TouchableOpacity>
                    </View>
                    {mode === 'sleepReminder' ? (
                        <View style={styles.container}>
                            <Text style={styles.title}>Sleep reminder</Text>
                            <View style={styles.pickerComponent}>
                                <Picker
                                    selectedValue={bedHour}
                                    onValueChange={(itemValue, itemIndex) =>
                                        setBedHour(itemValue)
                                    }
                                    style={styles.picker}
                                >
                                    {dataHour.map((item, index) => {
                                        return (<Picker.Item label={item} value={item} key={index} fontFamily='moonglade-bold' color='white' />)
                                    })}
                                </Picker>
                                <Text style={styles.timeText}>:</Text>
                                <Picker
                                    selectedValue={bedMinutes}
                                    onValueChange={(itemValue, itemIndex) =>
                                        setBedMinutes(itemValue)
                                    }
                                    style={styles.picker}
                                >
                                    {dataSixty.map((item, index) => {
                                        return (<Picker.Item label={item} value={item} key={index} fontFamily='moonglade-bold' color='white' />)
                                    })}
                                </Picker>
                                <Picker
                                    selectedValue={bedAmpm}
                                    onValueChange={(itemValue, itemIndex) =>
                                        setBedAmpm(itemValue)
                                    }
                                    style={styles.picker}
                                    itemStyle={{ fontFamily: 'moonglade-bold', }}
                                >
                                    <Picker.Item label={'AM'} value={'AM'} fontFamily='moonglade-bold' color='white' />
                                    <Picker.Item label={'PM'} value={'PM'} fontFamily='moonglade-bold' color='white' />
                                </Picker>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.container}>
                            <Text style={styles.title}>Alarm setting</Text>
                            <View style={styles.pickerComponent}>
                                <Picker
                                    selectedValue={wakeHour}
                                    onValueChange={(itemValue, itemIndex) =>
                                        setWakeHour(itemValue)
                                    }
                                    style={styles.picker}
                                >
                                    {dataHour.map((item, index) => {
                                        return (<Picker.Item label={item} value={item} key={index} fontFamily='moonglade-bold' color='white' />)
                                    })}
                                </Picker>
                                <Text style={styles.timeText}>:</Text>
                                <Picker
                                    selectedValue={wakeMinutes}
                                    onValueChange={(itemValue, itemIndex) =>
                                        setWakeMinutes(itemValue)
                                    }
                                    style={styles.picker}
                                >
                                    {dataSixty.map((item, index) => {
                                        return (<Picker.Item label={item} value={item} key={index} fontFamily='moonglade-bold' color='white' />)
                                    })}
                                </Picker>
                                <Picker
                                    selectedValue={wakeAmpm}
                                    onValueChange={(itemValue, itemIndex) =>
                                        setWakeAmpm(itemValue)
                                    }
                                    style={styles.picker}
                                    itemStyle={{ fontFamily: 'moonglade-bold', }}
                                >
                                    <Picker.Item label={'AM'} value={'AM'} fontFamily='moonglade-bold' color='white' />
                                    <Picker.Item label={'PM'} value={'PM'} fontFamily='moonglade-bold' color='white' />
                                </Picker>
                            </View>
                        </View>
                    )}
                    <View style={styles.recoBar}>
                        <ScrollView
                            horizontal={true}
                            indicatorStyle='white'
                        >
                            <TouchableOpacity
                                style={styles.recoButton}
                                onPress={() => {
                                    if (mode === 'sleepReminder') {
                                        setBedHour('11')
                                        setBedMinutes('00')
                                        setBedAmpm('PM')
                                    } else {
                                        setWakeHour('7')
                                        setWakeMinutes('00')
                                        setWakeAmpm('AM')
                                    }
                                }}
                            >
                                <Text style={styles.recoTime}>{mode === 'sleepReminder' ? '11:00 pm' : '7:00 am'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.recoButton}
                                onPress={() => {
                                    if (mode === 'sleepReminder') {
                                        setBedHour('11')
                                        setBedMinutes('15')
                                        setBedAmpm('PM')
                                    } else {
                                        setWakeHour('7')
                                        setWakeMinutes('15')
                                        setWakeAmpm('AM')
                                    }
                                }}
                            >
                                <Text style={styles.recoTime}>{mode === 'sleepReminder' ? '11:15 pm' : '7:15 am'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.recoButton}
                                onPress={() => {
                                    if (mode === 'sleepReminder') {
                                        setBedHour('11')
                                        setBedMinutes('30')
                                        setBedAmpm('PM')
                                    } else {
                                        setWakeHour('7')
                                        setWakeMinutes('30')
                                        setWakeAmpm('AM')
                                    }
                                }}
                            >

                                <Text style={styles.recoTime}>{mode === 'sleepReminder' ? '11:30 pm' : '7:30 am'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.recoButton}
                                onPress={() => {
                                    if (mode === 'sleepReminder') {
                                        setBedHour('11')
                                        setBedMinutes('45')
                                        setBedAmpm('PM')
                                    } else {
                                        setWakeHour('7')
                                        setWakeMinutes('45')
                                        setWakeAmpm('AM')
                                    }
                                }}
                            >
                                <Text style={styles.recoTime}>{mode === 'sleepReminder' ? '11:45 pm' : '7:45 am'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.recoButton}
                                onPress={() => {
                                    if (mode === 'sleepReminder') {
                                        setBedHour('12')
                                        setBedMinutes('00')
                                        setBedAmpm('AM')
                                    } else {
                                        setWakeHour('8')
                                        setWakeMinutes('00')
                                        setWakeAmpm('AM')
                                    }
                                }}
                            >
                                <Text style={styles.recoTime}>{mode === 'sleepReminder' ? '12:00 am' : '8:00 am'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.recoButton}
                                onPress={() => {
                                    if (mode === 'sleepReminder') {
                                        setBedHour('12')
                                        setBedMinutes('15')
                                        setBedAmpm('AM')
                                    } else {
                                        setWakeHour('8')
                                        setWakeMinutes('15')
                                        setWakeAmpm('AM')
                                    }
                                }}
                            >
                                <Text style={styles.recoTime}>{mode === 'sleepReminder' ? '12:15 am' : '8:15 am'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.recoButton}
                                onPress={() => {
                                    if (mode === 'sleepReminder') {
                                        setBedHour('12')
                                        setBedMinutes('30')
                                        setBedAmpm('PM')
                                    } else {
                                        setWakeHour('8')
                                        setWakeMinutes('30')
                                        setWakeAmpm('AM')
                                    }
                                }}
                            >

                                <Text style={styles.recoTime}>{mode === 'sleepReminder' ? '12:30 am' : '8:30 am'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.recoButton}
                                onPress={() => {
                                    if (mode === 'sleepReminder') {
                                        setBedHour('1')
                                        setBedMinutes('00')
                                        setBedAmpm('AM')
                                    } else {
                                        setWakeHour('9')
                                        setWakeMinutes('00')
                                        setWakeAmpm('AM')
                                    }
                                }}
                            >
                                <Text style={styles.recoTime}>{mode === 'sleepReminder' ? '1:00 am' : '9:00 am'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.recoButton}
                                onPress={() => {
                                    if (mode === 'sleepReminder') {
                                        setBedHour('1')
                                        setBedMinutes('30')
                                        setBedAmpm('AM')
                                    } else {
                                        setWakeHour('9')
                                        setWakeMinutes('30')
                                        setWakeAmpm('AM')
                                    }
                                }}
                            >
                                <Text style={styles.recoTime}>{mode === 'sleepReminder' ? '1:30 am' : '9:30 am'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.recoButton}
                                onPress={() => {
                                    if (mode === 'sleepReminder') {
                                        setBedHour('2')
                                        setBedMinutes('00')
                                        setBedAmpm('AM')
                                    } else {
                                        setWakeHour('10')
                                        setWakeMinutes('00')
                                        setWakeAmpm('AM')
                                    }
                                }}
                            >
                                <Text style={styles.recoTime}>{mode === 'sleepReminder' ? '2:00 am' : '10:00 am'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.recoButton}
                                onPress={() => {
                                    if (mode === 'sleepReminder') {
                                        setBedHour('2')
                                        setBedMinutes('30')
                                        setBedAmpm('AM')
                                    } else {
                                        setWakeHour('10')
                                        setWakeMinutes('30')
                                        setWakeAmpm('AM')
                                    }
                                }}
                            >
                                <Text style={styles.recoTime}>{mode === 'sleepReminder' ? '2:30 am' : '10:30 am'}</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                    <View style={styles.checkComponent}>
                        <View style={styles.arrowBackground}>
                            <MaterialIcons
                                name='check'
                                size={50}
                                style={styles.openModal}
                                onPress={handleOnPress}
                            />
                        </View>
                    </View>
                </SafeAreaView>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 7,
    },
    popupTitle: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 14,
        backgroundColor: '#f3f3f3',
    },
    writeupTitle: {
        fontSize: 18,
        marginVertical: '2%',
        fontFamily: 'nunito-bold',
    },
    writeupSubTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        marginVertical: '1%',
        fontFamily: 'nunito-bold',
    },
    writeupContent: {
        fontSize: 15,
        fontFamily: 'nunito-regular',
        textAlign: 'justify',
    },
    head: { 
        height: 40, 
        backgroundColor: '#f1f8ff' 
    },
    text: { 
        margin: 6 
    },
    backToMain: {
        position: 'absolute',
        marginTop: 55,
        marginHorizontal: 20,
        color: 'white',
        zIndex: 999,
    },
    toggleComponent: {
        marginTop: 60,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    contentContainer: {
        flex: 1,

    },
    pickerComponent: {
        flex: 10,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    picker: {
        alignSelf: 'center',
        justifyContent: 'center',
        width: '30%',
        height: '50%',
    },
    timeText: {
        color: 'white',
        fontFamily: 'moonglade-bold',
        alignSelf: 'center',
        fontSize: 25,

    },
    headerTitle: {
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'moonglade-bold',
        fontSize: 28,
        alignSelf: 'center',
        marginTop: 30,
    },
    title: {
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'moonglade-bold',
        fontSize: 26,
        alignSelf: 'center',
        marginTop: 30,
    },
    recoTime: {
        fontSize: 15,
        color: 'white',
        fontWeight: '500',
        alignSelf: 'center',

    },
    recoBar: {
        flex: 1,
    },
    recoButton: {
        width: 100,
        height: 40,
        borderRadius: 20,
        marginHorizontal: 5,
        backgroundColor: 'rgba(189, 148, 223, 0.3)',
        justifyContent: 'center',
    },
    checkComponent: {
        flex: 6,
        justifyContent: 'center',
        alignItems: 'center',

    },
    arrowBackground: {
        width: 70,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(189, 148, 223, 0.3)',
        borderRadius: 70,
    },
    openModal: {
        color: 'white',
    },
})