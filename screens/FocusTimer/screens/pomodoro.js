import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Animated,
    TouchableOpacity,
    Alert,
    Modal,
    SafeAreaView,
    Vibration,
    ScrollView,
} from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { Ionicons, FontAwesome, } from '@expo/vector-icons';
import { globalStyles } from '../presentational/globalStyles';
import { minutes as dataMinutes } from '../data';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as LevelAPI from '../../../api/level';
import * as Profile from '../../../api/profile';
import * as Authentication from '../../../api/auth';
import { Audio } from 'expo-av';
import { EvilIcons } from '@expo/vector-icons';
import Dialog, { DialogContent, ScaleAnimation, } from 'react-native-popup-dialog';

export default function Pomodoro({ navigation }) {

    const [level, setLevel] = useState(1)
    const [exp, setExp] = useState(0)
    const [maxExp, setMaxExp] = useState(1000);
    const [userId, setUserId] = useState(Authentication.getCurrentUserId());
    const [popupOpen, setPopupOpen] = useState(false);

    const [studyTime, setStudyTime] = useState('25')
    const [shortBreak, setShortBreak] = useState('5')
    const [longBreak, setLongBreak] = useState('15')
    const [timerChanged, setTimerChanged] = useState(0)
    const [cycle, setCycle] = useState(1)
    const maxCycles = 4;
    const [expCycles, setExpCycles] = useState(0)

    const [isPlaying, setIsPlaying] = useState(false)
    const [timerModalOpen, setTimerModalOpen] = useState(false)
    const [studyModalOpen, setStudyModalOpen] = useState(false)
    const [shortModalOpen, setShortModalOpen] = useState(false)
    const [longModalOpen, setLongModalOpen] = useState(false)
    const [uniqueModalOpen, setUniqueModalOpen] = useState(false)
    const [sound, setSound] = useState(new Audio.Sound())

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


    useEffect(() => {
        return LevelAPI.subscribe(userId, setLevel, setExp)
    }, []
    );

    const dialogHandler = () => {
        setPopupOpen(true)
    }


    const saveLevel = () => {
        if (parseInt(studyTime) >= 25 && shortBreak === '5' && longBreak === '15') {
            setIsPlaying(false);
            Alert.alert('Are you sure you want to quit?', 'You have currently accumulated ' + expCycles + ' exp during this session, leaving this \n page will save what progress you have made and restart',
                [{
                    text: 'Yes',
                    onPress: async () => {
                        console.log('level: ' + level + ' exp: ' + exp);
                        setTimerModalOpen(false)
                        setStudyModalOpen(false)
                        setShortModalOpen(false)
                        setLongModalOpen(false)
                        setCycle(1)
                        const totalEXP = expCycles + exp
                        const totalLevels = Math.floor(totalEXP / maxExp) + level;
                        LevelAPI.editLevel(totalLevels, 
                            totalEXP % maxExp,
                            userId, 
                            () => { },
                            (error) => Alert.alert(error.message)
                        )
                        Profile.updateLevelAndExp(
                            totalLevels, 
                            totalEXP % maxExp, 
                            userId, 
                            () => {},
                            (error) => Alert.alert(error.message)
                        )
                        setLevel(totalLevels)
                        setExp(totalEXP % maxExp)

                        setExpCycles(0)
                        Vibration.cancel()
                        sound.stopAsync()
                    }
                }, {
                    text: 'No',
                    style: 'destructive',
                    onPress: () => {
                        Vibration.cancel()
                        sound.stopAsync()
                    }
                }
                ])
        } else {
            Alert.alert('Are you sure you want to quit?', 'All progress will be lost and pomodoro timer will be restarted',
                [{
                    text: 'Yes',
                    onPress: () => {
                        setTimerModalOpen(false)
                        setStudyModalOpen(false)
                        setTimerModalOpen(false)
                        setLongModalOpen(false)
                        setCycle(1)
                        setExpCycles(0)
                    },
                }, {
                    text: 'No',
                    style: 'destructive',
                    onPress: () => {

                    }
                }
                ])
        }
    }


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

    const continueToShortBreak = () => {
        setExpCycles(expCycles + 50)
        playSound()
        Vibration.vibrate(Pattern, true)
        Alert.alert("Time's up!", "Continue to Short break? ",
            [{
                text: 'Yes',
                onPress: () => {
                    sound.stopAsync()
                    setStudyModalOpen(false)
                    setShortModalOpen(true)
                    setIsPlaying(true)
                    setCycle(cycle + 1)
                    Vibration.cancel()
                }
            }, {
                text: 'No',
                style: 'destructive',
                onPress: () => {
                    sound.stopAsync()
                    Vibration.cancel()
                }
            }])
    }

    const Pattern = [
        1000, 1000, 1000,
    ]

    const continueToPomodoro = () => {
        playSound()
        Vibration.vibrate(Pattern, true)
        Alert.alert("Time's up!", "Continue to next pomodoro cycle? ",
            [{
                text: 'Yes',
                onPress: () => {
                    setLongModalOpen(false)
                    setShortModalOpen(false)
                    setStudyModalOpen(true)
                    setIsPlaying(true)
                    sound.stopAsync()
                    Vibration.cancel()
                }
            }, {
                text: 'No',
                style: 'destructive',
                onPress: () => {
                    Vibration.cancel()
                    sound.stopAsync()
                }
            }])
    }

    const continueToPomodoroStart = () => {
        Vibration.vibrate(Pattern, true)
        playSound()
        Alert.alert("Time's up!", "Begin new pomodoro cycle? ",
            [{
                text: 'Yes',
                onPress: () => {
                    setLongModalOpen(false)
                    setShortModalOpen(false)
                    setStudyModalOpen(true)
                    setIsPlaying(true)
                    setTimerChanged(0)
                    sound.stopAsync()
                    Vibration.cancel()
                }
            }, {
                text: 'No',
                style: 'destructive',
                onPress: () => {
                    Vibration.cancel()
                    sound.stopAsync()
                }
            }])
    }

    const continueToLongBreak = () => {
        Vibration.vibrate(Pattern, true)
        playSound()
        setExpCycles(expCycles + 150);
        Alert.alert("Time's up!", "Continue to long break? ",
            [{
                text: 'Yes',
                onPress: () => {
                    setStudyModalOpen(false)
                    setLongModalOpen(true)
                    setIsPlaying(true)
                    setCycle(1)
                    Vibration.cancel()
                    sound.stopAsync()
                }
            }, {
                text: 'No',
                style: 'destructive',
                onPress: () => {
                    Vibration.cancel()
                    sound.stopAsync()
                }
            }])
    }

    const restartTimerWithPause = () => {
        setIsPlaying(false)
        restartTimer()
    }

    const studyHandler = () => {
        setLongModalOpen(false)
        setShortModalOpen(false)
        setStudyModalOpen(true)
        setIsPlaying(true)
        setTimerChanged(timerChanged + 1)
    }

    const timerHandler = () => {
        setLongModalOpen(false)
        setShortModalOpen(false)
        setStudyModalOpen(true)
        setTimerModalOpen(true)
        setIsPlaying(true)
        setTimerChanged(timerChanged + 1)
    }

    const shortHandler = () => {
        setStudyModalOpen(false)
        setShortModalOpen(true)
        setIsPlaying(true)
        setCycle(cycle + 1)
        setTimerChanged(timerChanged + 1)
    }


    const longHandler = () => {
        setStudyModalOpen(false)
        setLongModalOpen(true)
        setIsPlaying(true)
        setTimerChanged(0)
        setCycle(1)
    }

    const setUniqueHandler = () => {
        Alert.alert('Are you sure you want to change pomodoro time?',
            'Pomodoro timer with study time less than 25 minutes will not be rewarded any EXP',
            [{
                text: 'Yes',
                onPress: () => {
                    setUniqueModalOpen(true);
                }
            }, {
                text: 'No',
                style: 'destructive',
                onPress: () => {

                }
            }
            ])
    }

    const setDefaultHandler = () => {
        Alert.alert('Set pomodoro timer to default time?', 'Pomodoro timer will be set to 25 mins study time, 5 mins short break and 15 mins long break',
            [{
                text: 'Yes',
                onPress: () => {
                    setStudyTime('25')
                    setShortBreak('5')
                    setLongBreak('15')
                    setTimerChanged(timerChanged + 1)
                }
            }, {
                text: 'No',
                style: 'destructive',
                onPress: () => { }
            }]
        )
    }

    const timeConverter = ({ remainingTime, animatedColor }) => {
        const hours = Math.floor(remainingTime / 3600)
        const minutes = Math.floor((remainingTime % 3600) / 60)
        const seconds = remainingTime % 60
        if (hours === 0 && minutes === 0 && seconds === 0 && studyModalOpen) {
            return (
                <TouchableOpacity
                    style={styles.toNextTimer}
                    onPress={cycle === maxCycles ? longHandler : shortHandler}
                >
                    <Animated.Text style={{ color: animatedColor, ...globalStyles.animatedText }}>{cycle === maxCycles ? 'Start long break' : 'Start short break'}</Animated.Text>
                </TouchableOpacity>)
        } else if (hours === 0 && minutes === 0 && seconds === 0 && shortModalOpen) {
            return (
                <TouchableOpacity
                    style={styles.toNextTimer}
                    onPress={studyHandler}
                >
                    <Animated.Text style={{ color: animatedColor, ...globalStyles.animatedText }}>Continue</Animated.Text>
                </TouchableOpacity>
            )
        } else if (hours === 0 && minutes === 0 && seconds === 0 && longModalOpen) {
            return (
                <TouchableOpacity
                    style={styles.toNextTimer}
                    onPress={studyHandler}
                >
                    <Animated.Text style={{ color: animatedColor, ...globalStyles.animatedText }}>Start new cycle</Animated.Text>
                </TouchableOpacity>
            )
        } else {
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
            <View style={styles.logo}>
                <AnimatedCircularProgress
                    size={250}
                    width={30}
                    fill={exp / maxExp * 100}
                    tintColor="#bdf007"
                    rotation={0}
                    tintColorSecondary="#ff6122"
                    onAnimationComplete={() => console.log('exp & level updated')}
                    backgroundColor="#3d5875" />
                <View style={{ position: 'absolute', flex: 1, flexDirection: 'column', }}>
                    <Text style={styles.levelWord}>
                        level
                    </Text>
                    <Text style={styles.levelNumber}>
                        {level}
                    </Text>
                    <Text style={{ fontFamily: 'nunito-bold', fontSize: 12, alignSelf: 'center' }}>
                        {exp}/{maxExp}
                    </Text>
                </View>

            </View>
            <View style={styles.pomodoroBox}>
                <Text style={styles.title}>Pomodoro</Text>
                <FontAwesome
                    name='question-circle'
                    size={30}
                    style={styles.FAQ}
                    onPress={() => {
                        setPopupOpen(true)
                        console.log('pressed')
                    }}
                />
            </View>
            <Dialog
                visible={popupOpen}
                onTouchOutside={() => setPopupOpen(false)}
                dialogTitle={<View style={styles.popupTitle}>
                    <Text style={{ fontFamily: 'nunito-bold', fontSize: 16 }}>Pomodoro Focus Timer!</Text>
                    <EvilIcons
                        name="close"
                        size={24}
                        color="black"
                        style={{ position: 'absolute', right: 0, marginRight: '2%', marginTop: '6%' }}
                        onPress={() => setPopupOpen(false)}
                    />
                </View>}
                width={0.8}
                height={0.5}
                dialogAnimation={new ScaleAnimation({
                    initialValue: 0, // optional
                    useNativeDriver: true, // optional
                })}
            >
                <DialogContent style={{ justifyContent: 'center', }}>
                    <ScrollView style={{ height: '95%', width: '100%' }}>
                        <Text style={styles.writeupTitle}>
                            What is the pomodoro study technique?
                        </Text>
                        <Text style={styles.writeupContent}>
                            {'1. The pomodoro study technique consists of such steps:' + '\n'
                            + '2. Set a timer for 25 minutes and start your task ' + '\n'
                            + '3. When time is up, that counts as 1 study cycle, so take a quick 5 minutes break' + '\n' 
                            + '4. After completing 4 study cycles, take a longer break of 15 minutes ' + '\n'
                            + '5. Repeat the process!'}

                        </Text>
                        <Text style={styles.writeupTitle}>
                            How does the pomodoro study technique help?
                        </Text>
                        <Text style={styles.writeupContent}>
                            The pomodoro study technique is a system with the belief that by dividing your work and breaks into regular, short increments you can avoid feeling overwhelmed by a looming task while also avoiding burn out. 
                        </Text>
                        <Text style={styles.writeupTitle}>
                            How does the EXP system work? 
                        </Text>
                        <Text style={styles.writeupContent}>
                            Each study cycle will give you 50 EXP upon completion, while completing a full pomodoro cycle (4 study cycles) will provide an additional 100 EXP. 
                        </Text>
                        <Text style ={styles.writeupTitle}>
                            What if I have to stop in the middle of the session?
                        </Text>
                        <Text style={styles.writeupContent}>
                            You can exit the timer at any time and the amount of EXP you have gained from the number of study cycles you've completed will be updated.
                        </Text>
                        <Text style={styles.writeupTitle}>
                            Can I customise the pomodoro cycle durations?
                        </Text>
                        <Text style={styles.writeupContent}>
                            {'You can customise your own custom pomodoro cycles, changing the study, short break and long break durations. If your study duration is less than 25 minutes while short break and long break durations are modified, ' + 
                            'you will not gain any EXP upon completing any study cycle! You can quick set default settings by clicking the default settings button to set everything back to default.' + '\n'}
                        </Text>
                    </ScrollView>
                </DialogContent>
            </Dialog>
            <Text style={styles.motivation}>Be productive the right way.</Text>
            <TouchableOpacity
                style={styles.timerSelector}
                onPress={() => {
                    loadSound()
                    timerHandler()
                }}
            >
                <Text style={styles.buttonText}>Press to begin!</Text>
            </TouchableOpacity>
            <View style={styles.buttons}>
                <TouchableOpacity
                    style={styles.timerSelector2}
                    onPress={setUniqueHandler}
                >
                    <Text style={styles.buttonText2}>Custom settings</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.timerSelector2}
                    onPress={setDefaultHandler}
                >
                    <Text style={styles.buttonText2}>Default settings</Text>
                </TouchableOpacity>
            </View>
            <View >
                <Modal
                    visible={timerModalOpen}

                >
                    {studyModalOpen ? (
                        <LinearGradient colors={['#614385', '#516395',]} style={styles.gradient}>
                            <SafeAreaView style={globalStyles.modalContent}>
                                <Ionicons
                                    name='arrow-back'
                                    size={30}
                                    style={globalStyles.modalToggle}
                                    onPress={() => {
                                        setIsPlaying(false)
                                        saveLevel()
                                    }
                                    }
                                />
                                <Text style={styles.cycleText}>{cycle + (cycle % 10 === 1 ? 'st' : cycle % 10 === 2 ? 'nd' : cycle % 10 === 3 ? 'rd' : 'th')} cycle</Text>
                                <View style={globalStyles.timerAlignment}>

                                    <CountdownCircleTimer
                                        key={timerChanged}
                                        size={300}
                                        isPlaying={isPlaying}
                                        duration={parseInt(studyTime * 60)}
                                        initialRemainingTime={parseInt(studyTime * 60)}
                                        colors={[
                                            ['#ff88f7', 0.4],
                                            ['#ffef14', 0.4],
                                            ['#dd4215', 0.2],
                                        ]}
                                        strokeWidth={15}
                                        trailColor='#151932'
                                        onComplete={cycle === maxCycles ? continueToLongBreak : continueToShortBreak}
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
                                        onPress={() => {
                                            setIsPlaying(!isPlaying)
                                        }}
                                    >
                                        <Text style={styles.resetText}>{isPlaying ? 'Pause' : 'Start'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </SafeAreaView>
                        </LinearGradient>
                    ) : shortModalOpen ? (
                        <LinearGradient colors={['#614385', '#516395',]} style={styles.gradient}>
                            <SafeAreaView style={globalStyles.modalContent}>
                                <Ionicons
                                    name='arrow-back'
                                    size={30}
                                    style={globalStyles.modalToggle}
                                    onPress={() => {
                                        setIsPlaying(false)
                                        saveLevel()
                                    }}
                                />
                                <Text style={styles.cycleText}>Take a short break!</Text>
                                <View style={globalStyles.timerAlignment}>
                                    <CountdownCircleTimer
                                        key={timerChanged}
                                        size={300}
                                        isPlaying={isPlaying}
                                        duration={parseInt(shortBreak * 60)}
                                        initialRemainingTime={parseInt(shortBreak * 60)}
                                        colors={[
                                            ['#ff88f7', 0.4],
                                            ['#ffef14', 0.4],
                                            ['#dd4215', 0.2],
                                        ]}
                                        strokeWidth={15}
                                        trailColor='#151932'
                                        onComplete={continueToPomodoro}
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
                    ) : (
                        <LinearGradient colors={['#614385', '#516395',]} style={styles.gradient}>
                            <SafeAreaView style={globalStyles.modalContent}>
                                <Ionicons
                                    name='arrow-back'
                                    size={30}
                                    style={globalStyles.modalToggle}
                                    onPress={() => {
                                        setIsPlaying(false)
                                        saveLevel()
                                    }}
                                    onComplete={continueToPomodoroStart}
                                />
                                <Text style={styles.cycleTextAbove}>Good job!</Text>
                                <Text style={styles.cycleTextBelow}>Click to begin new cycle after the break</Text>
                                <View style={globalStyles.timerAlignment}>
                                    <CountdownCircleTimer
                                        key={timerChanged}
                                        size={300}
                                        isPlaying={isPlaying}
                                        duration={parseInt(longBreak * 60)}
                                        initialRemainingTime={parseInt(longBreak * 60)}
                                        colors={[
                                            ['#ff88f7', 0.4],
                                            ['#ffef14', 0.4],
                                            ['#dd4215', 0.2],
                                        ]}
                                        strokeWidth={15}
                                        trailColor='#151932'
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
                    )}
                </Modal>
            </View>
            <View>
                <Modal
                    visible={uniqueModalOpen}
                    animationType='fade'
                >

                    <SafeAreaView style={styles.modalContent}>
                        <ScrollView>
                            <TouchableOpacity
                                style={styles.doneButton}
                                onPress={() => {
                                    setUniqueModalOpen(false)
                                    setTimerChanged(timerChanged + 1)
                                }}
                            >
                                <Text style={styles.doneText}>Done</Text>
                            </TouchableOpacity>
                            <Text style={styles.selection}>Select study time(min):</Text>
                            <Picker
                                style={styles.picker}
                                selectedValue={studyTime}
                                onValueChange={(itemValue, itemIndex) =>
                                    setStudyTime(itemValue)
                                }
                            >
                                {dataMinutes.map((item, index) => {
                                    return (<Picker.Item label={item} value={item} key={index} />)
                                })}
                            </Picker>
                            <Text style={styles.selection}>Select short break time(min):</Text>
                            <Picker
                                style={styles.picker}
                                borderColor='black'
                                selectedValue={shortBreak}
                                onValueChange={(itemValue, itemIndex) =>
                                    setShortBreak(itemValue)
                                }
                            >
                                {dataMinutes.map((item, index) => {
                                    return (<Picker.Item label={item} value={item} key={index} />)
                                })}
                            </Picker>
                            <Text style={styles.selection}>Select long break time(min):</Text>
                            <Picker
                                style={styles.picker}
                                selectedValue={longBreak}
                                onValueChange={(itemValue, itemIndex) =>
                                    setLongBreak(itemValue)
                                }
                            >
                                {dataMinutes.map((item, index) => {
                                    return (<Picker.Item label={item} value={item} key={index} />)
                                })}
                            </Picker>
                            {/* <MaterialIcons
                            name='check'
                            size={20}
                            style={styles.modalToggle}
                            onPress={() => {
                                setUniqueModalOpen(false)
                                setTimerChanged(timerChanged + 1)
                            }}
                        /> */}
                        </ScrollView>
                    </SafeAreaView>
                </Modal>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
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
    picker: {
        flex: 1,
        width: '90%',
        alignSelf: 'center',
        height: '30%',
    },
    testing: {
        flex: 1,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'center',
    },
    logo: {
        marginTop: '10%',
        height: '40%',
        width: '50%',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    toNextTimer: {
        borderWidth: 1,
        backgroundColor: '#151932',
        borderRadius: 10,
        padding: 13,
        borderColor: '#dd4215'
    },
    title: {
        paddingLeft: 20,
        fontSize: 50,
        fontWeight: 'bold',
        marginHorizontal: 5,
    },
    motivation: {
        marginBottom: 40,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 50,
    },
    timerSelector: {
        marginHorizontal: 20,
        width: '30%',
        height: 50,
        borderRadius: 120,
        backgroundColor: "#004d99",
        justifyContent: 'center',
        alignItems: 'center',
    },
    cycleText: {
        marginTop: '25%',
        position: 'absolute',
        alignSelf: 'center',
        fontFamily: 'nunito-bold',
        fontSize: 30,
        color: '#cdc3bf'
    },
    cycleTextAbove: {
        marginTop: '21%',
        position: 'absolute',
        alignSelf: 'center',
        marginVertical: 0,
        fontFamily: 'nunito-bold',
        fontSize: 30,
        color: '#cdc3bf'
    },
    cycleTextBelow: {
        marginTop: '31%',
        position: 'absolute',
        alignSelf: 'center',
        marginVertical: 0,
        fontFamily: 'nunito-bold',
        fontSize: 20,
        color: '#cdc3bf'
    },
    pomodoroBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontFamily: 'nunito-bold',
        fontWeight: 'bold',
        color: '#fff',
    },
    timerSelector2: {
        marginHorizontal: '2%',
        width: 150,
        height: 50,
        borderRadius: 20,
        backgroundColor: "#004d99",
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText2: {
        fontFamily: 'nunito-bold',
        fontWeight: 'bold',
        color: '#fff',
    },
    modalContent: {
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        flex: 1,
        flexDirection: 'column',
    },
    selection: {
        fontFamily: 'nunito-regular',
        fontSize: 16,
        color: '#333',
        marginLeft: '5%',
    },
    modalToggle: {
        marginBottom: 0,
        borderWidth: 1,
        borderColor: '#333',
        alignSelf: 'center',
        padding: 10,
        borderRadius: 10,
    },
    timerPosition: {
        justifyContent: 'center'
    },
    levelWord: {
        fontSize: 18,
        alignSelf: 'center',
        fontFamily: 'nunito-bold',
        color: 'red'
    },
    levelNumber: {
        fontSize: 50,
        alignSelf: 'center',
        fontFamily: 'nunito-regular'
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
})