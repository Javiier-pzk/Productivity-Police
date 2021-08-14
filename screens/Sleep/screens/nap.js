import React, { useState } from 'react';
import { Text, View, ImageBackground, StyleSheet, ScrollView, Modal, Vibration, Alert, Animated, } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { globalStyles } from '../presentational/globalStyles';
import { MaterialIcons, Ionicons, FontAwesome, } from '@expo/vector-icons';
import { everyHour as dataHour, everySixty as dataSixty } from '../data';
import { Picker } from '@react-native-picker/picker';
import { Audio } from 'expo-av';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { EvilIcons } from '@expo/vector-icons';
import Dialog, { DialogContent, DialogTitle, ScaleAnimation } from 'react-native-popup-dialog';


export default function Nap({ navigation }) {
    const [songNumber, setSongNumber] = useState(0);
    const [music, setMusic] = useState(new Audio.Sound());
    const [alarm, setAlarm] = useState(new Audio.Sound());

    const [hour, setHour] = useState('0');
    const [minutes, setMinutes] = useState('0');

    const [modalOpen, setmodalOpen] = useState(false);
    const [popupOpen, setPopupOpen] = useState(false);

    const [startingTime, setStartingTime] = useState(0);
    const [timerChanged, setTimerChanged] = useState(0);

    const [wantMusic, setWantMusic] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [musicPlaying, setMusicPlaying] = useState(false);




    const Pattern = [
        1000, 1000, 1000,
    ]

    const completeHandler = () => {
        Vibration.vibrate(Pattern, true)
        playAlarm()
        Alert.alert("Time's up!", " ",
            [{
                text: 'Ok',
                onPress: () => {
                    Vibration.cancel()
                    alarm.stopAsync();
                }
            }, {
                text: 'Snooze',
                style: 'destructive',
                onPress: () => {
                    Vibration.cancel()
                    alarm.stopAsync();
                    setStartingTime(5 * 60)
                    setTimerChanged(timerChanged + 1)
                    setIsPlaying(true);
                }
            }
            ])
    }

    async function loadSong() {
        const { sound } = await Audio.Sound.createAsync(
            Playlist[songNumber].song
        )
        setMusic(sound);
    }

    async function playSong() {
        await music.playAsync();
    }

    // useEffect(() => {
    //     const { sound } = await Audio.Sound.loadAsync(Playlist[songNumber].song)
    //     setMusic(sound);
    //     return () => {
    //         await music.unloadAsync();
    //     }
    // }, [songNumber]);

    async function loadAlarm() {
        console.log('Loading Alarm');
        const { sound } = await Audio.Sound.createAsync(
            require('../../../assets/constellations.mp3')
        );
        setAlarm(sound);
    }

    async function playAlarm() {
        await alarm.setIsLoopingAsync(true)
        await alarm.playAsync()
    }


    const timeConverter = ({ remainingTime, animatedColor }) => {
        const hours = Math.floor(remainingTime / 3600)
        const minutes = Math.floor((remainingTime % 3600) / 60)
        const seconds = remainingTime % 60
        if (hours === 0 && minutes === 0 && seconds === 0) {
            return (

                <Animated.Text style={{ color: animatedColor, ...globalStyles.animatedText }}>
                    Wake up!
                </Animated.Text>
            )
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
        <View>
            <ImageBackground
                source={require('../../../assets/starry_background.png')}
                style={{ width: '100%', height: '100%' }}
            >
                <SafeAreaView style={globalStyles.container}>
                    
                    <View style={styles.pickerComponent}>
                        <Picker
                            selectedValue={hour}
                            onValueChange={(itemValue, itemIndex) =>
                                setHour(itemValue)
                            }
                            style={styles.picker}
                            fontFamily='moonglade-bold'
                            color='white'
                        >
                            {dataHour.map((item, index) => {
                                return (<Picker.Item label={item} value={item} key={index} fontFamily='moonglade-bold' color='white' />)
                            })}
                        </Picker>
                        <Text style={styles.timeText}>hrs</Text>
                        <Picker
                            selectedValue={minutes}
                            onValueChange={(itemValue, itemIndex) =>
                                setMinutes(itemValue)
                            }
                            style={styles.picker}


                        >
                            {dataSixty.map((item, index) => {
                                return (<Picker.Item label={item} value={item} key={index} fontFamily='moonglade-bold' color='white' />)
                            })}
                        </Picker>
                        <Text style={styles.timeText}>mins</Text>
                    </View>
                    <View style={styles.recoBar}>
                        <ScrollView
                            horizontal={true}
                            indicatorStyle='white'
                        >
                            {/* <TouchableOpacity
                                style={styles.recoButton}
                                onPress={() => {
                                    setWantMusic(!wantMusic);
                                }}
                            >
                                <Text style={styles.recoTime}>{wantMusic === true ? 'Music on' : 'Music off'}</Text>
                            </TouchableOpacity> */}
                            <TouchableOpacity
                                style={styles.recoButton}
                                onPress={() => {
                                    setMinutes('15')
                                    setHour('0')
                                }}
                            >
                                <Text style={styles.recoTime}>15 mins</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.recoButton}
                                onPress={() => {
                                    setMinutes('20')
                                    setHour('0')
                                }}
                            >
                                <Text style={styles.recoTime}>20 mins</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.recoButton}
                                onPress={() => {
                                    setMinutes('25')
                                    setHour('0')
                                }}
                            >
                                <Text style={styles.recoTime}>25 mins</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.recoButton}
                                onPress={() => {
                                    setMinutes('30')
                                    setHour('0')
                                }}
                            >
                                <Text style={styles.recoTime}>30 mins</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.recoButton}
                                onPress={() => {
                                    setMinutes('35')
                                    setHour('0')
                                }}
                            >
                                <Text style={styles.recoTime}>35 mins</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.recoButton}
                                onPress={() => {
                                    setMinutes('40')
                                    setHour('0')
                                }}
                            >
                                <Text style={styles.recoTime}>40 mins</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.recoButton}
                                onPress={() => {
                                    setMinutes('45')
                                    setHour('0')
                                }}
                            >
                                <Text style={styles.recoTime}>45 mins</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.recoButton}
                                onPress={() => {
                                    setMinutes('50')
                                    setHour('0')
                                }}
                            >
                                <Text style={styles.recoTime}>50 mins</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.recoButton}
                                onPress={() => {
                                    setMinutes('55')
                                    setHour('0')
                                }}
                            >
                                <Text style={styles.recoTime}>55 mins</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.recoButton}
                                onPress={() => {
                                    setMinutes('0')
                                    setHour('1')
                                }}
                            >
                                <Text style={styles.recoTime}>60 mins</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                    <View style={styles.checkComponent}>
                        <View style={styles.arrowBackground}>
                            <MaterialIcons
                                name='check'
                                size={50}
                                style={styles.openModal}
                                onPress={() => {
                                    if (parseInt(hour) === 0 && parseInt(minutes) === 0) {
                                        Alert.alert('Invalid time', 'Please indicate a time more than 0 minutes', [{ text: 'OK', fontWeight: '700', }])
                                    } else {
                                        loadAlarm();
                                        setmodalOpen(true);
                                        setStartingTime(parseInt(hour * 3600) + parseInt(minutes * 60))
                                        setIsPlaying(true);
                                    }
                                }
                                }
                            />
                        </View>
                    </View>
                    <Modal
                        visible={modalOpen}
                        animationType='fade'
                    >
                        <ImageBackground
                            source={require('../../../assets/starry_background.png')}
                            style={{ width: '100%', height: '100%' }}
                        >

                            <SafeAreaView style={globalStyles.modalContent}>
                                <Ionicons
                                    name='arrow-back'
                                    size={30}
                                    style={styles.backToMain}
                                    onPress={() => {
                                        setmodalOpen(false)
                                        setTimerChanged(0);
                                    }
                                    }
                                />
                                <View style={globalStyles.timerAlignment}>
                                    <CountdownCircleTimer
                                        key={timerChanged}
                                        size={300}
                                        isPlaying={isPlaying}
                                        duration={startingTime}
                                        initialRemainingTime={startingTime}
                                        colors={[
                                            ['#bc78f9', 0.5],
                                            ['#7428c8', 0.5],
                                        ]}
                                        trailColor='rgba(21, 25, 50, 0.5)'
                                        strokeWidth={15}
                                        onComplete={completeHandler}
                                        style={styles.timerPosition}
                                    >
                                        {timeConverter}
                                    </CountdownCircleTimer>
                                </View>
                                {wantMusic == true ?
                                    <View style={globalStyles.buttonActions}>
                                        <View style={styles.musicModBg}>
                                            <Ionicons
                                                name='play-skip-back'
                                                size={40}
                                                color='white'
                                                style={styles.musicModifier}
                                                onPress={() => {

                                                }
                                                }
                                            />
                                        </View>
                                        <View style={styles.musicModBg}>
                                            <Ionicons
                                                name={musicPlaying ? 'md-pause' : 'play'}
                                                size={40}
                                                color='white'
                                                style={styles.musicModifier}
                                                onPress={() => {
                                                    setMusicPlaying(!musicPlaying)
                                                }
                                                }
                                            />
                                        </View>
                                        <View style={styles.musicModBg}>
                                            <Ionicons
                                                name='play-skip-forward'
                                                size={40}
                                                color='white'
                                                style={styles.musicModifier}
                                                onPress={() => {

                                                }
                                                }
                                            />
                                        </View>
                                    </View>
                                    : <View></View>
                                }
                                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 40, }}>
                                    <TouchableOpacity
                                        style={styles.recoButton}
                                        onPress={() => {
                                            setIsPlaying(!isPlaying)
                                        }}
                                    >
                                        <Text style={styles.recoTime}>{isPlaying ? 'Pause' : 'Start'}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.recoButton}
                                        onPress={() => {
                                            setIsPlaying(false)
                                            setTimerChanged(timerChanged + 1)
                                        }}
                                    >
                                        <Text style={styles.recoTime}>Restart</Text>
                                    </TouchableOpacity>
                                </View>
                            </SafeAreaView>
                        </ImageBackground>
                    </Modal>
                </SafeAreaView>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
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
    backToMain: {
        position: 'absolute',
        marginTop: 55,
        marginHorizontal: 20,
        color: 'white',
        zIndex: 999,
    },
    title: {
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'moonglade-bold',
        fontSize: 30,
        alignSelf: 'center',
        marginTop: 30,
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
    openModal: {
        color: 'white',
    },
    pickerComponent: {
        flex: 8,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    arrowBackground: {
        width: 70,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(189, 148, 223, 0.3)',
        borderRadius: 70,
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
    musicModBg: {
        width: 70,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(189, 148, 223, 0.3)',
        borderRadius: 70,
        marginHorizontal: 10,
    },
    musicModifier: {
    },
    toNextTimer: {
        borderWidth: 1,
        backgroundColor: '#151932',
        borderRadius: 10,
        padding: 13,
        borderColor: '#dd4215'
    },
})