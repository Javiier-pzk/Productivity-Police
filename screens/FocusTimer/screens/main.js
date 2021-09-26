import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Animated,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
  SafeAreaView
} from 'react-native';
import { globalStyles } from '../presentational/globalStyles';
import * as Authentication from '../../../api/auth';
import * as LevelAPI from '../../../api/level';

export default function Main({ navigation }) {
  const [userId, setUserId] = useState(Authentication.getCurrentUserId());
  const [level, setLevel] = useState(0)
  const [exp, setExp] = useState(0)
  const [displayedBadge, setDisplayBadge] = useState('Pomodoro-welcome.png');

  useEffect(() => {
    return LevelAPI.subscribe(userId, setLevel, setExp)
  }, []
  );

  useEffect(() => {
    console.log('display badge changed')
    displayBadgeChooser(level);
  }, [level])

  const displayBadgeChooser = (currentLevel) => (
    level >= 100 ?
      <Image
        style={styles.displayedBadge}
        source={require('../../../assets/centurion.png')}
      />
      : level >= 80 ?
        <Image
          style={styles.displayedBadge}
          source={require('../../../assets/level80-medal.png')}
        />
        : level >= 60 ?
          <Image
            style={styles.displayedBadge}
            source={require('../../../assets/level60-medal.png')}
          />
          : level >= 40 ?
            <Image
              style={styles.displayedBadge}
              source={require('../../../assets/level40-medal.png')}
            />
            : level >= 20 ?
              <Image
                style={styles.displayedBadge}
                source={require('../../../assets/level20-medal.png')}
              />
              :
              <Image
                style={styles.displayedBadge}
                source={require('../../../assets/police.png')}
              />
    
  )

  const buttonAchievementsHandler = () => {
    navigation.navigate('Achievements', { setDisplayBadge, })
  }

  const buttonNormalHandler = () => {
    navigation.navigate('Standard')
  }

  const buttonPomodoroHandler = () => {
    navigation.navigate('Pomodoro')
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* <TouchableOpacity
        style={{
          marginRight: 10,
          alignSelf: 'flex-end',
          marginTop: 10,
          borderWidth: 1,
          borderRadius: 10,
          padding: 8,
          
        }}
        onPress={() => console.log(userId + ' level = ' + level + ' exp = ' + exp)}
      >
        <Text style={{fontFamily: 'nunito-bold',}}>Change display badge</Text>
      </TouchableOpacity> */}

      <View style={styles.badge}>
        {displayBadgeChooser(level)}
      </View>
      <View style={styles.beginning}>
        <Text style={styles.welcomeText}>Welcome to Focus Timer</Text>
        <Text style={styles.selectionText}>Select a timer</Text>
      </View>
      <View style={styles.buttonArrangement}>
        <TouchableOpacity
          style={styles.buttonNormal}
          onPress={buttonNormalHandler}
        >
          <Text style={styles.normalText}>Standard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonPomodoro}
          onPress={buttonPomodoroHandler}
        >
          <Text style={styles.pomodoroText}>Pomodoro</Text>
        </TouchableOpacity>
      </View>


    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  beginning: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 80,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: 'bold',
    borderColor: 'black',
  },
  selectionText: {
    fontSize: 20,
    fontWeight: '400'
  },
  buttonArrangement: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonNormal: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '30%',
    height: 50,
    backgroundColor: "#4682b4",
    marginHorizontal: 10,
    
  },
  normalText: {
    fontFamily: 'nunito-bold',
    fontSize: 18,
    color: '#fff',
  },
  buttonPomodoro: {
    marginHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "#4682b4",
    justifyContent: 'center',
    alignItems: 'center',
    width: '30%',
    height: 50,

  },
  pomodoroText: {
    fontFamily: 'nunito-bold',
    fontSize: 18,
    color: '#fff',
  },
  badge: {
    marginTop: '20%',
    height: '32%',
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  displayedBadge: {
    width: '100%',
    height: '100%',
  },
});