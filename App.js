import React, { useState } from 'react';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import Navigator from './routes/signInPageStack';
import store from './redux/configureStore';
import {Provider} from 'react-redux';

const getFonts = () => Font.loadAsync({
  'nunito-regular': require('./assets/Nunito-Regular.ttf'),
  'nunito-bold': require('./assets/Nunito-Bold.ttf'),
  'moonglade-bold': require('./assets/MoongladeBold.ttf'),
  'moonglade-light': require('./assets/Moonglade-Light.ttf'),
  'moonglade-regular': require('./assets/Moonglade-Regular.ttf')
})

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  if (fontsLoaded) {
    return (
      <Provider store = {store}>
       <Navigator/>
      </Provider>
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
