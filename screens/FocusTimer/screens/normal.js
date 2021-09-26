import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Animated,
    TouchableOpacity,
    Alert,
    Modal,
    SafeAreaView,
    Button,
    Image,
    Vibration,
    ScrollView,
} from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { globalStyles } from '../presentational/globalStyles';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { everyHour as dataHour, everySixty as dataSixty } from '../data';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import KeepAwake from 'react-native-keep-awake';


export default function Normal({ navigation }) {

    const [hour, setHour] = useState(0)
    const [min, setMin] = useState(0)
    const [sec, setSec] = useState(0)
    const [startingTime, setStartingTime] = useState(0)
    const [timerChanged, setTimerChanged] = useState(0)

    const [isPlaying, setIsPlaying] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [timerModalOpen, setTimerModalOpen] = useState(false)
    const [sound, setSound] = useState(new Audio.Sound())

    const restartTimer = () => {
        Alert.alert('Do you want to to restart the timer?', '',
            [{
                text: 'Yes',
                onPress: () => {
                    setTimerChanged(timerChanged + 1)
                },
            }, {
                text: 'No',
                onPress: () => {
                    setIsPlaying(false)
                },
                style: 'destructive',
            }]
        )
    }

    async function loadSound() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(
            require('../../../assets/marimba_ringtone.mp3')
        );
        setSound(sound);
    }

    async function playSound() {
        await sound.setIsLoopingAsync(true)
        await sound.playAsync()
    }

    const Pattern = [
        1000, 1000, 1000,
    ]

    const restartTimerWithPause = () => {
        setIsPlaying(false)
        restartTimer()
    }

    const completeHandler = () => {
        Vibration.vibrate(Pattern, true)
        playSound()
        Alert.alert("Time's up!", '', [{
            Text: 'Ok',
            onPress: () => {
                Vibration.cancel()
                sound.stopAsync();
            }
        }])
    }

    const timeConverter = ({ remainingTime, animatedColor }) => {
        const hours = Math.floor(remainingTime / 3600)
        const minutes = Math.floor((remainingTime % 3600) / 60)
        const seconds = remainingTime % 60
        if (hours === 0 && minutes === 0 && seconds === 0) {
            return <Animated.Text style={{ color: animatedColor, ...globalStyles.animatedText }}>Time's up!</Animated.Text>
        } else {
            <Animated.Text style={{ color: animatedColor, ...globalStyles.animatedText }}>Time remaining</Animated.Text>
            if (hours === 0 && minutes === 0) {
                return <Animated.Text style={{ color: animatedColor, ...globalStyles.animatedNumber }}>{seconds}</Animated.Text>
            } else if (hours === 0) {
                if (seconds < 10) {
                    return <Animated.Text style={{ color: animatedColor, ...globalStyles.animatedNumber }}>{minutes}:{0}{seconds}</Animated.Text>
                } else {
                    return <Animated.Text style={{ color: animatedColor, ...globalStyles.animatedNumber }}>{minutes}:{seconds}</Animated.Text>
                }
            } else {
                if (seconds < 10 && minutes < 10) {
                    return <Animated.Text style={{ color: animatedColor, ...globalStyles.animatedNumber }}>{hours}:{0}{minutes}:{0}{seconds}</Animated.Text>
                } else if (seconds < 10) {
                    return <Animated.Text style={{ color: animatedColor, ...globalStyles.animatedNumber }}>{hours}:{minutes}:{0}{seconds}</Animated.Text>
                } else if (minutes < 10) {
                    return <Animated.Text style={{ color: animatedColor, ...globalStyles.animatedNumber }}>{hours}:{0}{minutes}:{seconds}</Animated.Text>
                } else {
                    return <Animated.Text style={{ color: animatedColor, ...globalStyles.animatedNumber }}>{hours}:{minutes}:{seconds}</Animated.Text>
                }
            }
        }
    }

    return (
        <View style={styles.container}>
            <Modal
                visible={modalOpen}
                animationType='fade'
            >
                <SafeAreaView style={styles.modalContent}>
                    <ScrollView>
                        <TouchableOpacity
                            onPress={() => {
                                setModalOpen(false)
                            }}
                            style={styles.doneButton}
                        >
                            <Text style={styles.doneText}>Done</Text>
                        </TouchableOpacity>
                        <Text style={styles.selection}>Select Hours:</Text>
                        <Picker
                            style={styles.picker}
                            selectedValue={hour}
                            onValueChange={(itemValue, itemIndex) =>
                                setHour(itemValue)
                            }
                        >
                            {dataHour.map((item, index) => {
                                return (<Picker.Item label={item} value={item} key={index} />)
                            })}
                        </Picker>
                        <Text style={styles.selection}>Select Minutes:</Text>
                        <Picker
                            style={styles.picker}
                            selectedValue={min}
                            onValueChange={(itemValue, itemIndex) =>
                                setMin(itemValue)
                            }
                        >
                            {dataSixty.map((item, index) => {
                                return (<Picker.Item label={item} value={item} key={index} />)
                            })}
                        </Picker>
                        <Text style={styles.selection}>Select Seconds:</Text>
                        <Picker
                            style={styles.picker}
                            selectedValue={sec}
                            onValueChange={(itemValue, itemIndex) =>
                                setSec(itemValue)
                            }
                        >
                            {dataSixty.map((item, index) => {
                                return (<Picker.Item label={item} value={item} key={index} />)
                            })}
                        </Picker>
                        {/* <MaterialIcons
                            name='check'
                            size={20}
                            style={styles.modalToggle}
                            onPress={() => {
                                setModalOpen(false)
                            }}
                        /> */}
                    </ScrollView>
                </SafeAreaView>
            </Modal>
            <View style={styles.logo}>
                <Image
                    source={require("../../../assets/timer.png")}
                    style={{ width: 220, height: 220 }}
                />
            </View>
            <View style={styles.clocks}>
                <View style={styles.clockText}>
                    <Text style={styles.timeText}>Hours</Text>
                    <CountdownCircleTimer
                        key={hour}
                        size={120}
                        isPlaying={false}
                        duration={hour}
                        colors={[
                            ['#004777', 0.4],
                            ['#F7B801', 0.4],
                            ['#A30000', 0.2],
                        ]}
                    >
                        {({ remainingTime, animatedColor }) => (
                            <Animated.Text style={{ color: animatedColor, ...styles.animatedText }}>
                                {remainingTime}
                            </Animated.Text>
                        )}
                    </CountdownCircleTimer>
                </View>
                <View style={styles.clockText}>
                    <Text style={styles.timeText}>Minutes</Text>
                    <CountdownCircleTimer
                        key={min}
                        size={120}
                        isPlaying={false}
                        duration={min}
                        colors={[
                            ['#004777', 0.4],
                            ['#F7B801', 0.4],
                            ['#A30000', 0.2],
                        ]}
                    >
                        {({ remainingTime, animatedColor }) => (
                            <Animated.Text style={{ color: animatedColor, ...styles.animatedText }}>
                                {remainingTime}
                            </Animated.Text>
                        )}
                    </CountdownCircleTimer>
                </View>
                <View style={styles.clockText}>
                    <Text style={styles.timeText}>Seconds</Text>
                    <CountdownCircleTimer
                        key={sec}
                        size={120}
                        isPlaying={false}
                        duration={sec}
                        colors={[
                            ['#004777', 0.4],
                            ['#F7B801', 0.4],
                            ['#A30000', 0.2],
                        ]}
                    >
                        {({ remainingTime, animatedColor }) => (
                            <Animated.Text style={{ color: animatedColor, ...styles.animatedText }}>
                                {remainingTime}
                            </Animated.Text>
                        )}
                    </CountdownCircleTimer>
                </View>
            </View>
            <View>
                <Modal
                    visible={timerModalOpen}
                    animationType='fade'
                >
                    <LinearGradient colors={['#614385', '#516395',]} style={styles.gradient}>
                        <SafeAreaView style={globalStyles.modalContent}>
                            <Ionicons
                                name='arrow-back'
                                size={30}
                                style={globalStyles.modalToggle}
                                onPress={() => { setTimerModalOpen(false); setTimerChanged(0) }}
                                color='white'
                            />
                            <View style={globalStyles.timerAlignment}>
                                <CountdownCircleTimer
                                    key={timerChanged}
                                    size={300}
                                    isPlaying={isPlaying}
                                    duration={startingTime}
                                    initialRemainingTime={startingTime}
                                    colors={[
                                        ['#ff88f7', 0.4],
                                        ['#ffef14', 0.4],
                                        ['#dd4215', 0.2],
                                    ]}
                                    trailColor='#151932'
                                    strokeWidth={15}
                                    onComplete={completeHandler}
                                    style={styles.timerPosition}
                                >
                                    {timeConverter}
                                </CountdownCircleTimer>
                            </View>
                            <View style={globalStyles.buttonActions}>
                                <TouchableOpacity
                                    style={styles.resetButton}
                                    onPress={restartTimerWithPause}
                                >
                                    <Text style={styles.resetText}>Restart</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.resetButton}
                                    onPress={() => setIsPlaying(!isPlaying)}
                                >
                                    <Text style={styles.resetText}>{isPlaying ? 'Pause' : 'Start'}</Text>
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>
                    </LinearGradient>
                </Modal>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={() => {
                        setModalOpen(true)
                    }}
                    style={styles.timerSetting}
                >
                    <Text style={styles.setTimerFont}>Set duration</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        if (parseInt(hour) === 0 && parseInt(min) === 0 && parseInt(sec) === 0) {
                            Alert.alert('Invalid time', 'Please indicate a time more than 0 seconds', [{ text: 'OK', fontWeight: '700', }])
                        } else {
                            loadSound()
                            setTimerModalOpen(true)
                            setIsPlaying(true)
                            setTimerChanged(timerChanged + 1)
                            setStartingTime(parseInt(hour * 3600) + parseInt(min * 60) + parseInt(sec))
                        }
                    }}
                    style={styles.timerSetting}
                >
                    <Text style={styles.setTimerFont}>Start timer</Text>
                </TouchableOpacity>
            </View>
        </View>
    )


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    picker: {
        flex: 1,
        width: '90%',
        alignSelf: 'center',
        height: '30%',
    },
    doneButton: {
        position: 'absolute',
        flex: 1,
        alignSelf: 'flex-end',
        marginRight: '5%',
        zIndex: 999,
    },
    doneText: {
        fontSize: 18,
        color: "crimson",
        fontWeight: "bold",
    },
    modalContent: {
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        flex: 1
    },
    gradient: {
        flex: 1,
    },
    logo: {
        marginTop: '20%',
        marginBottom: '20%',
        height: '20%',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalToggle: {
        marginBottom: 0,
        borderWidth: 1,
        borderColor: '#333',
        alignSelf: 'center',
        padding: 10,
        borderRadius: 10,
    },
    selection: {
        fontFamily: 'nunito-regular',
        fontSize: 16,
        color: '#333',
        marginLeft: '5%',
    },
    timerSetting: {
        width: '33%',
        height: 50,
        backgroundColor: "#004d99",
        borderRadius: 20,
        marginHorizontal: 20,
        justifyContent: 'center',
    },
    setTimerFont: {
        fontSize: 18,
        alignSelf: 'center',
        color: '#fff',
        fontWeight: 'bold'
    },
    clocks: {
        flexDirection: 'row',

    },
    clockText: {
        marginBottom: '10%',
        marginHorizontal: '1%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeText: {
        marginBottom: 5,
    },
    animatedText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    timerAlignment: {
        alignSelf: 'center',
        marginTop: 100,
        marginBottom: 30,
        backgroundColor: '#151932',
        borderRadius: 300,
    },
    buttonActions: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    resetButton: {
        width: '25%',
        height: 40,
        borderRadius: 20,
        marginHorizontal: 20,
        justifyContent: 'center',
        backgroundColor: 'coral'
    },
    resetText: {
        fontFamily: 'nunito-bold',
        fontSize: 16,
        alignSelf: 'center',
        color: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
    }
})