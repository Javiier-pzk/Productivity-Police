import React, { useState } from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import Navigator from './routes/mainStack'

const getFonts = () => Font.loadAsync({
  'nunito-regular': require('./assets/Nunito-Regular.ttf'),
  'nunito-bold': require('./assets/Nunito-Bold.ttf')
})

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  if (fontsLoaded) {
    return (
      <Navigator/>  
    )
  } else {
    return (
      <AppLoading
        startAsync = {getFonts}
        onError = {console.warn}
        onFinish = { () => setFontsLoaded(true) }
      />
    )
  }
}
