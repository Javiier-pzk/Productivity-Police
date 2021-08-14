import React, { useState, useEffect, useRef } from "react";
import {
  Alert,
  StyleSheet,
  View,
  Text,
  SectionList,
  TouchableOpacity,
  Modal,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { globalStyles } from "../../../Styles/globalStyles";
import moment from "moment";
import { Checkbox, IconButton, List } from "react-native-paper";
import * as Authentication from "../../../api/auth";
import * as Habits from "../../../api/habits";
import * as Profile from "../../../api/profile";
import * as Notifs from "../../../api/notifis";
import * as Notifications from "expo-notifications";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import CreateManualLog from "./createManualLog";
import EditHabitsForm from "./editHabitsForm";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

export default function habits({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState({});
  const [sectionedHabits, setSectionedHabits] = useState([]);
  const [userId, setUserId] = useState(Authentication.getCurrentUserId());
  const [habitId, setHabitId] = useState("");
  const [editHabit, setEditHabit] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    Notifs.registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) =>
        setNotification(notification)
      );

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) =>
        console.log(response)
      );

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
    return Habits.habitsSubscribe(userId, setHabits);
  }, []);

  useEffect(() => {
    if (habits) {
      const categorisedHabits = [];
      const habitsArray = Object.values(habits);
      for (let i = 0; i < habitsArray.length; i++) {
        const habit = habitsArray[i];
        if (
          moment(habit.nextUpdate, "MMMM Do YYYY, h:mm a").diff(
            time,
            "hours",
            true
          ) < 0
        ) {
          handleReset(habit.id, habit.completed, habit.streak);
          Habits.setNextUpdate(
            moment(habit.nextUpdate, "MMMM Do YYYY, h:mm a")
              .add(1, habit.Category.toLowerCase())
              .format("MMMM Do YYYY, h:mm a"),
            { userId: Authentication.getCurrentUserId(), habitId: habit.id },
            () => {},
            (error) => Alert.alert(error.message)
          );
        }
        if (
          habit.currentProgress >= 100 &&
          habit.tapCount === parseInt(habit.Repetitions)
        ) {
          if (!habit.completedBefore) {
            Habits.updateStreakCount(
              habit.streak + 1,
              true,
              { userId: Authentication.getCurrentUserId(), habitId: habit.id },
              () => {},
              (error) => Alert.alert(error.message)
            );
          }
          handleCompleteHabit(habit.id, habit.ReceiveNotif, habit.Identifier);
        } else {
          handleUncompleteHabit(habit.id);
        }
      }
      const habitCount = habitsArray.filter((habit) => !habit.completed).length;
      // const minutelyHabits = habitsArray.filter(
      //   (habit) => habit.Category === "Minute"
      // );
      // const hourlyHabits = habitsArray.filter(
      //   (habit) => habit.Category === "Hour"
      // );
      const dailyHabits = habitsArray.filter(
        (habit) => habit.Category === "Day"
      );
      const weeklyHabits = habitsArray.filter(
        (habit) => habit.Category === "Week"
      );
      const monthlyHabits = habitsArray.filter(
        (habit) => habit.Category === "Month"
      );

      // if (minutelyHabits.length > 0)
      //   categorisedHabits.push({ title: "Minutely", data: minutelyHabits });
      // if (hourlyHabits.length > 0)
      //   categorisedHabits.push({ title: "Hourly", data: hourlyHabits });
      if (dailyHabits.length > 0)
        categorisedHabits.push({ title: "Daily", data: dailyHabits });
      if (weeklyHabits.length > 0)
        categorisedHabits.push({ title: "Weekly", data: weeklyHabits });
      if (monthlyHabits.length > 0)
        categorisedHabits.push({ title: "Monthly", data: monthlyHabits });
      setSectionedHabits(categorisedHabits);
      Profile.updateHabitCount(
        habitCount,
        Authentication.getCurrentUserId(),
        () => {},
        (error) => Alert.alert(error.message)
      );
    } else {
      setSectionedHabits([]);
      Profile.updateHabitCount(
        0,
        Authentication.getCurrentUserId(),
        () => {},
        (error) => Alert.alert(error.message)
      );
      handleCancelAllNotifs();
    }
  }, [habits, time]);

  useEffect(() => {
    let secTimer = setInterval(() => {
      setTime(new Date());
    }, 60000);

    return () => clearInterval(secTimer);
  }, []);

  const closeModal = () => setModalOpen(false);
  const closeEditModal = () => setEditModalOpen(false);

  const addLog = (value) => {
    const log = parseInt(value.Number);
    Habits.updateCurrentProgressManual(
      log,
      { userId: Authentication.getCurrentUserId(), habitId },
      () => {},
      (error) => Alert.alert(error.message)
    );
    setModalOpen(false);
  };

  const handleCancelAllNotifs = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  const handleReset = (habitId, completed, currentStreak) => {
    if (completed) {
      console.log("complete");
      Habits.updateStreakCount(
        currentStreak,
        false,
        { userId: Authentication.getCurrentUserId(), habitId },
        () => {},
        (error) => Alert.alert(error)
      );
    } else {
      console.log("incomplete");
      Habits.updateStreakCount(
        0,
        false,
        { userId: Authentication.getCurrentUserId(), habitId },
        () => {},
        (error) => Alert.alert(error)
      );
    }
    Habits.updateCurrentProgress(
      0,
      0,
      { userId: Authentication.getCurrentUserId(), habitId },
      () => {},
      (error) => Alert.alert(error.message)
    );
    handleUncompleteHabitAndRescheduleNotif(habitId);
  };

  const handleCompleteHabit = async (habitId, receiveNotif, identifier) => {
    if (receiveNotif) {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    }
    Habits.completeHabit(
      { userId: Authentication.getCurrentUserId(), habitId },
      () => {},
      (error) => Alert.alert(error.message)
    );
  };

  const handleUncompleteHabit = (habitId) => {
    Habits.uncompleteHabit(
      { userId: Authentication.getCurrentUserId(), habitId },
      () => {},
      (error) => Alert.alert(error.message)
    );
  };

  const handleUncompleteHabitAndRescheduleNotif = (habitId) => {
    Habits.uncompleteHabit(
      { userId: Authentication.getCurrentUserId(), habitId },
      () => {},
      (error) => Alert.alert(error.message)
    );
    Habits.rescheduleNotifWhenUncomplete(
      { userId: Authentication.getCurrentUserId(), habitId },
      () => {},
      (error) => Alert.alert(error.message)
    );
  };

  const handleEditHabit = async (
    values,
    type,
    cat,
    receiveNotif,
    dateTimeFormatted,
    reminder
  ) => {
    try {
      const subject = values.Subject;
      const repetitions = values.Repetitions;
      if (parseInt(repetitions) < editHabit.tapCount) {
        Habits.updateCurrentProgress(
          100,
          parseInt(repetitions),
          { userId: Authentication.getCurrentUserId(), habitId: editHabit.id },
          () => {},
          (error) => Alert.alert(error.message)
        );
      }
      if (receiveNotif) {
        const identifier = await Notifications.scheduleNotificationAsync({
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
        Habits.editHabit(
          subject,
          repetitions,
          type,
          cat,
          receiveNotif,
          dateTimeFormatted,
          reminder,
          identifier,
          { userId: Authentication.getCurrentUserId(), habitId: editHabit.id },
          () => {},
          (error) => Alert.alert(error.message)
        );
        setEditModalOpen(false);
      } else {
        Habits.editHabit(
          subject,
          repetitions,
          type,
          cat,
          receiveNotif,
          dateTimeFormatted,
          reminder,
          "",
          { userId: Authentication.getCurrentUserId(), habitId: editHabit.id },
          () => {},
          (error) => Alert.alert(error.message)
        );
        setEditModalOpen(false);
      }
    } catch (error) {
      Alert.alert(
        "Invalid date or time",
        "You cannot schedule a task at this date or time"
      );
    }
  };

  const handleDeleteHabit = (habitId, receiveNotif, identifier) => {
    Alert.alert("Delete this habit?", "Deleted habit is not retrievable", [
      {
        text: "Yes",
        onPress: async () => {
          if (receiveNotif) {
            await Notifications.cancelScheduledNotificationAsync(identifier);
          }
          Habits.deleteHabit(
            { userId: Authentication.getCurrentUserId(), habitId },
            () => {},
            (error) => Alert.alert(error.message)
          );
        },
      },
      {
        text: "No",
        style: "destructive",
      },
    ]);
  };

  const renderList = ({ item, index, section, separators }) => {
    return (
      <List.Item
        style={styles.item}
        title={item.Subject}
        description={`${item.tapCount} / ${item.Repetitions} ${item.Type} `}
        left={(props) => (
          <TouchableOpacity
            style={styles.progress}
            onPress={() => {
              if (!item.completed) {
                if (item.Type === "times") {
                  Habits.updateCurrentProgress(
                    item.currentProgress + 100 / item.Repetitions,
                    item.tapCount + 1,
                    {
                      userId: Authentication.getCurrentUserId(),
                      habitId: item.id,
                    },
                    () => {},
                    (error) => Alert.alert(error.message)
                  );
                } else {
                  Alert.alert(
                    "Complete habit?",
                    `We will add ${item.Repetitions - item.tapCount} ${
                      item.Type
                    } for ${
                      item.Category === "Day"
                        ? "today"
                        : item.Category === "Week"
                        ? "this week"
                        : "this month"
                    } to complete this habit`,
                    [
                      {
                        text: "Save Completion",
                        onPress: () => {
                          Habits.updateCurrentProgress(
                            item.currentProgress + (100 - item.currentProgress),
                            item.tapCount +
                              (parseInt(item.Repetitions) - item.tapCount),
                            {
                              userId: Authentication.getCurrentUserId(),
                              habitId: item.id,
                            },
                            () => {},
                            (error) => Alert.alert(error.message)
                          );
                        },
                      },
                      {
                        text: "Enter Log Manually",
                        onPress: () => {
                          setHabitId(item.id);
                          setModalOpen(true);
                        },
                      },
                      {
                        text: "Cancel",
                        style: "destructive",
                      },
                    ]
                  );
                }
              }
            }}
          >
            <Text style={styles.percentage}>
              {" "}
              {Math.round((item.tapCount / item.Repetitions) * 100 * 10) /
                10}%{" "}
            </Text>
            <AnimatedCircularProgress
              size={45}
              width={3}
              fill={(item.tapCount / item.Repetitions) * 100}
              tintColor="#bdf007"
              rotation={0}
              tintColorSecondary="#ff6122"
              onAnimationComplete={() => {}}
              backgroundColor="#3d5875"
            />
          </TouchableOpacity>
        )}
        right={(props) => (
          <View style={styles.streak}>
            {item.completed ? (
              <View style={styles.streak}>
                <MaterialIcons
                  name="local-fire-department"
                  size={28}
                  color="orange"
                />
                <Text style={{ ...globalStyles.titleText, color: "orange" }}>
                  {" "}
                  {item.streak}
                </Text>
              </View>
            // ) : item.Category === 'Minute'
            //   ? moment(item.nextUpdate, "MMMM Do YYYY, h:mm a").diff(time,"seconds",true) < 60 * 0.25
            //     ? <FontAwesome
            //         name = 'hourglass-half'
            //         size = {24}
            //         color = '#f57c63'
            //       />
            //     : null
            //   : item.Category === 'Hour'
            //   ? moment(item.nextUpdate, "MMMM Do YYYY, h:mm a").diff(time,"minutes",true) < 60 * 0.25
            //     ? <FontAwesome
            //         name = 'hourglass-half'
            //         size = {24}
            //         color = '#f57c63'
            //       />
            //     : null
            ) : item.Category === "Day" ? (
              moment(item.nextUpdate, "MMMM Do YYYY, h:mm a").diff(
                time,
                "hours",
                true
              ) <
              24 * 0.25 ? (
                <FontAwesome name="hourglass-half" size={24} color="#f57c63" />
              ) : null
            ) : item.Category === "Week" ? (
              moment(item.nextUpdate, "MMMM Do YYYY, h:mm a").diff(
                time,
                "days",
                true
              ) <
              7 * 0.25 ? (
                <FontAwesome name="hourglass-half" size={24} color="#f57c63" />
              ) : null
            ) : item.Category === "Month" ? (
              moment(item.nextUpdate, "MMMM Do YYYY, h:mm a").diff(
                time,
                "days",
                true
              ) <
              moment(item.nextUpdate, "MMMM Do YYYY, h:mm a").daysInMonth() *
                0.25 ? (
                <FontAwesome name="hourglass-half" size={24} color="#f57c63" />
              ) : null
            ) : null}
            <IconButton
              {...props}
              icon="close"
              onPress={() =>
                handleDeleteHabit(item.id, item.ReceiveNotif, item.Identifier)
              }
            />
          </View>
        )}
        titleStyle={
          item.completed ? styles.completedHabit : globalStyles.titleText
        }
        onPress={() => {
          setEditHabit(item);
          setEditModalOpen(true);
        }}
      />
    );
  };

  return (
    <View style={globalStyles.container}>
      {loading ? (
        <ActivityIndicator
          style={styles.loading}
          size="large"
          color="#4682b4"
        />
      ) : (
        <View style = {{flex:1}}>
          <Modal visible={modalOpen} animationType="slide">
            <CreateManualLog closeModal={closeModal} addLog={addLog} />
          </Modal>
          <Modal visible={editModalOpen} animationType="slide">
            <EditHabitsForm
              item={editHabit}
              closeEditModal={closeEditModal}
              handleEditHabit={handleEditHabit}
            />
          </Modal>
          {sectionedHabits.length === 0 ? (
            <View style={styles.noHabit}>
              <View style={styles.imageView}>
                <View style={styles.ImageBackground}>
                  <ImageBackground
                    source={require("../../../assets/police.png")}
                    style={{ height: 200, width: 200 }}
                    imageStyle={{ borderRadius: 15 }}
                  />
                </View>
              </View>
              <Text style={styles.noHabitText}>
                {" "}
                You have no habits currently.{" "}
              </Text>
              <Text style={styles.noHabitText}>
                {" "}
                Click + to add a new habit now!
              </Text>
            </View>
          ) : (
            <SectionList
              sections={sectionedHabits}
              keyExtractor={(item, index) => item + index}
              renderItem={renderList}
              renderSectionHeader={({ section: { title } }) => (
                <List.Subheader style={styles.category}>
                  {" "}
                  {title}{" "}
                </List.Subheader>
              )}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  date: {
    alignSelf: "center",
    fontWeight: "bold",
    marginBottom: 5,
    color: "#555",
    fontSize: 17,
  },
  category: {
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "#4682b4",
  },
  completedHabit: {
    textDecorationLine: "line-through",
    color: "grey",
    fontFamily: "nunito-bold",
    fontSize: 18,
  },
  item: {
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 0.4,
    borderBottomColor: "#999",
  },
  progress: {
    justifyContent: "center",
    marginRight: 10,
  },
  percentage: {
    position: "absolute",
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 11,
  },
  streak: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  imageView: {
    marginBottom: 40,
    alignSelf: "center",
  },
  ImageBackground: {
    height: 120,
    width: 120,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  noHabit: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  noHabitText: {
    ...globalStyles.bodyText,
    alignSelf: "center",
    fontSize: 18,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
  },
});
