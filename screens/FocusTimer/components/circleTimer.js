import React from 'react'
import { StyleSheet, View, Text, Animated } from 'react-native'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'


export default function CircleTimer({isPlaying, setIsPlaying, startingTime, timerChanged, setTimerChanged}) {
    return (
        <SafeAreaView style={styles.modalContent}>
            <Ionicons
                name='arrow-back'
                size='20'
                style={styles.modalToggle}
                onPress={() => { setTimerModalOpen(false); setTimerChanged(0) }}
            />
            <View style={styles.timerAlignment}>
                <CountdownCircleTimer
                    key={timerChanged}
                    size={300}
                    isPlaying={isPlaying}
                    duration={startingTime}
                    initialRemainingTime={startingTime}
                    colors={[
                        ['#004777', 0.4],
                        ['#F7B801', 0.4],
                        ['#A30000', 0.2],
                    ]}
                    strokeWidth={30}
                >
                    {timeConverter}
                </CountdownCircleTimer>
            </View>
            <View style={styles.buttonActions}>
                <TouchableOpacity
                    style={styles.resetButton}
                    onPress={restartTimer}
                >
                    <Text style={styles.resetText}>Restart</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.resetButton}
                    onPress={() => setIsPlaying(!isPlaying)}
                >
                    <Text style={styles.resetText}>Start/pause</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    clockText: {
        marginBottom: 50,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeText: {
        marginBottom: 5,
    },
})
