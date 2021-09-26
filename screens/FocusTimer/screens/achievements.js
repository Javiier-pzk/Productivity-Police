import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Animated,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { globalStyles } from '../presentational/globalStyles';
import * as Authentication from '../../../api/auth';
import * as LevelAPI from '../../../api/level';


export default function Achievements({ route, navigation }) {
    return (
        <View>
            <Text>Display achievements</Text>
        </View>
    )
}