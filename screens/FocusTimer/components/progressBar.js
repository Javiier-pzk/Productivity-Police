import React, {useState, useRef, useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';

const Progress = ({ step, steps, height }) => {
    const animatedValue = useRef(new Animated.Value(-1000)).current
    const reactive = useRef(new Animated.Value(-1000)).current
    const [width, setWidth] = useState(0)

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue:reactive,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.bounce()
        }).start();
    }, []);

    useEffect(() => {
        reactive.setValue(-width + (width * step)/ steps)
    }, [step, width])
    return (
        <>
            <Text style={{
                fontFamily: 'Menlo',
                fontSize: 12,
                fontWeight: '900',
                marginBottom: 8
            }}>
                {step}/{steps}
            </Text>
            <View 
            onLayout={e => {
                const newWidth = e.nativeEvent.layout.width
                setWidth(newWidth)
            }}
            style={{
                height, backgroundColor: 'rgba(0,0,0,0.1)',
                borderRadius: height,
                overflow: 'hidden'
            }}>
                <Animated.View 
                style={{
                    height,
                    borderRadius: height,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    width: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    transform: [{
                        translateX: animatedValue,
                    }]
                }} />
            </View>
        </>
    )
}

export default function ProgressBar({step, steps, height}) {
    const [index, setIndex] = useState(0)
    return (
        <View style={styles.container}>
            <Progress step={step} steps={steps} height={height} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    }
})