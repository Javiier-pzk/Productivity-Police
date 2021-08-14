import { createStackNavigator } from "@react-navigation/stack";
import habits from "../screens/habits";
import Header from '../../../shared/header';
import React, {useState} from 'react';
import {View, Modal, Alert} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import CreateHabitsForm from '../screens/createHabitsForm';
import * as Authentication from '../../../api/auth';
import * as Habits from '../../../api/habits';
import * as Notifications from 'expo-notifications';

const Stack = createStackNavigator();

export default function HabitStack({navigation}) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Habits"
        component={habits}
        options={{
          headerTintColor: '#fff',
          headerStyle: {backgroundColor: '#5f9ea0'},
          headerTitle: () => <Header title="Habits" />,
          headerLeft: () => (
            <MaterialIcons
              style={{ marginLeft: 15 }}
              name="menu"
              size={28}
              color="#fff"
              onPress={() => navigation.openDrawer()}
            />
          ),
          headerRight: () => {
            const [modalOpen, setModalOpen] = useState(false);
            const closeModal = () => setModalOpen(false);

            const handleCreateHabit = async (
              values,
              type,
              cat,
              receiveNotif,
              dateTimeFormatted,
              reminder
            ) => {
              try {
                const subject = values.Subject;
                values.userId = Authentication.getCurrentUserId();
                values.Type = type;
                values.Category = cat;
                values.ReceiveNotif = receiveNotif;
                values.DateTimeFormatted = dateTimeFormatted;
                values.Reminder = reminder;
                if (receiveNotif) {
                  const identifier =
                    await Notifications.scheduleNotificationAsync({
                      content: {
                        title:
                          cat === "Day"
                            ? "Daily Habit Reminder"
                            : `${cat}ly Habit Reminder`,
                        body: subject,
                        data: {},
                        sound: true,
                      },
                      trigger: {
                        hour: parseInt(reminder.substring(0, 2)),
                        minute: parseInt(reminder.substring(3)),
                        repeats: true,
                      },
                    });
                  values.Identifier = identifier;
                } else {
                  values.Identifier = "";
                }
                setModalOpen(false);
                return Habits.createHabit(
                  values,
                  () => {},
                  (error) => Alert.alert(error.message)
                );
              } catch (error) {
                console.warn(error);
              }
            };
            return (
              <View style={{ marginRight: 15 }}>
                <Modal visible={modalOpen} animationType="slide">
                  <CreateHabitsForm
                    closeModal={closeModal}
                    handleCreateHabit={handleCreateHabit}
                  />
                </Modal>
                <MaterialIcons
                  name="add"
                  size={30}
                  color="#fff"
                  onPress={() => setModalOpen(true)}
                />
              </View>
            );
          }
        }}
      />
    </Stack.Navigator>
  );
}
