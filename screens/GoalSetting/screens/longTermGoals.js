import React, { useState, useEffect, useRef } from "react";
import {
  Alert,
  StyleSheet,
  View,
  Text,
  SectionList,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { globalStyles } from "../../../Styles/globalStyles";
import moment from "moment";
import { MaterialIcons } from "@expo/vector-icons";
import { IconButton, List } from "react-native-paper";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import * as Authentication from "../../../api/auth";
import * as Goals from "../../../api/goals";
import * as Profile from "../../../api/profile";
import * as Notifs from "../../../api/notifis";
import * as Notifications from "expo-notifications";

export default function LongTermGoals({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState({});
  const [sectionedGoals, setSectionedGoals] = useState([]);
  const [time, setTime] = useState(new Date());
  const [userId, setUserId] = useState(Authentication.getCurrentUserId());
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
      )

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
    return Goals.subscribe(userId, setGoals);
  }, []);

  useEffect(() => {
    if (goals) {
      const categorisedGoals = [];
      const goalsArray = Object.values(goals);
      for (let i = 0; i < goalsArray.length; i++) {
        const goal = goalsArray[i];
        let newCompleted = 0;
        if (
          goal.Checkpoint1 !== undefined &&
          moment(time).diff(
            moment(goal.Checkpoint1.DateTimeFormatted, "Do MMMM YYYY, h:mm a"),
            "minutes",
            true
          ) >= 0 &&
          !goal.Checkpoint1.completed
        ) {
          handleCompleteCP1(goal.Checkpoint1, goal.id);
          newCompleted++;
        }
        if (
          goal.Checkpoint2 !== undefined &&
          moment(time).diff(
            moment(goal.Checkpoint2.DateTimeFormatted, "Do MMMM YYYY, h:mm a"),
            "minutes",
            true
          ) >= 0 &&
          !goal.Checkpoint2.completed
        ) {
          handleCompleteCP2(goal.Checkpoint2, goal.id);
          newCompleted++;
        }
        if (
          goal.Checkpoint3 !== undefined &&
          moment(time).diff(
            moment(goal.Checkpoint3.DateTimeFormatted, "Do MMMM YYYY, h:mm a"),
            "minutes",
            true
          ) >= 0 &&
          !goal.Checkpoint3.completed
        ) {
          handleCompleteCP3(goal.Checkpoint3, goal.id);
          newCompleted++;
        }
        if (
          moment(time).diff(
            moment(goal.DateTimeFormatted, "Do MMMM YYYY, h:mm a"),
            "minutes",
            true
          ) >= 0 &&
          !goal.completed
        ) {
          handleCompleteGoal(goal.id);
          newCompleted++;
        }
        Goals.updateNumCheckpointsCompleted(goal.numCheckpointsCompleted + newCompleted,
          {userId: Authentication.getCurrentUserId(), goalId: goal.id},
          () => {},
          (error) => Alert.alert(error.message)
        )
      }
      const goalCount = goalsArray.filter((goal) => !goal.completed).length;
      const schoolGoals = goalsArray.filter(
        (goal) => goal.Category === "School"
      );
      const workGoals = goalsArray.filter((goal) => goal.Category === "Work");
      const personalGoals = goalsArray.filter(
        (goal) => goal.Category === "Personal"
      );
      const otherGoals = goalsArray.filter(
        (goal) => goal.Category === "Others"
      );

      if (schoolGoals.length > 0)
        categorisedGoals.push({
          title: "School",
          data: schoolGoals.sort((g1, g2) => g1.Priority - g2.Priority),
        });
      if (workGoals.length > 0)
        categorisedGoals.push({
          title: "Work",
          data: workGoals.sort((g1, g2) => g1.Priority - g2.Priority),
        });
      if (personalGoals.length > 0)
        categorisedGoals.push({
          title: "Personal",
          data: personalGoals.sort((g1, g2) => g1.Priority - g2.Priority),
        });
      if (otherGoals.length > 0)
        categorisedGoals.push({
          title: "Others",
          data: otherGoals.sort((g1, g2) => g1.Priority - g2.Priority),
        });

      setSectionedGoals(categorisedGoals);
      Profile.updateGoalCount(
        goalCount,
        Authentication.getCurrentUserId(),
        () => {},
        (error) => Alert.alert(error.message)
      );
    } else {
      setSectionedGoals([]);
      Profile.updateGoalCount(
        0,
        Authentication.getCurrentUserId(),
        () => {},
        (error) => Alert.alert(error.message)
      );
      handleCancelAllNotifs();
    }
  }, [goals, time]);

  const handleCancelAllNotifs = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  const handleCompleteCP1 = (cp1, goalId) => {
    const Checkpoint1 = { ...cp1, completed: true };
    Goals.editCheckpoint1(
      Checkpoint1,
      { userId: Authentication.getCurrentUserId(), goalId },
      () => {},
      (error) => Alert.alert(error.message)
    );
  };

  const handleCompleteCP2 = (cp2, goalId) => {
    const Checkpoint2 = { ...cp2, completed: true };
    Goals.editCheckpoint2(
      Checkpoint2,
      { userId: Authentication.getCurrentUserId(), goalId },
      () => {},
      (error) => Alert.alert(error.message)
    );
  };

  const handleCompleteCP3 = (cp3, goalId) => {
    const Checkpoint3 = { ...cp3, completed: true };
    Goals.editCheckpoint3(
      Checkpoint3,
      { userId: Authentication.getCurrentUserId(), goalId },
      () => {},
      (error) => Alert.alert(error.message)
    );
  };

  const handleCompleteGoal = (goalId) => {
    Goals.completeGoal(
      { userId: Authentication.getCurrentUserId(), goalId },
      () => {},
      (error) => Alert.alert(error.message)
    );
  };

  const handleDeleteGoal = (goal) => {
    Alert.alert("Delete this goal?", "Deleted goal is not retrievable", [
      {
        text: "Yes",
        onPress: async () => {
          await Notifications.cancelScheduledNotificationAsync(goal.Identifier);
          if (goal.Checkpoint1 !== undefined) {
            await Notifications.cancelScheduledNotificationAsync(
              goal.Checkpoint1.Identifier
            );
            if (goal.Checkpoint2 !== undefined) {
              await Notifications.cancelScheduledNotificationAsync(
                goal.Checkpoint2.Identifier
              );
              if (goal.Checkpoint3 !== undefined) {
                await Notifications.cancelScheduledNotificationAsync(
                  goal.Checkpoint3.Identifier
                );
              }
            }
          }
          Goals.deleteGoal(
            { userId: Authentication.getCurrentUserId(), goalId: goal.id },
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
        title={item.Title}
        left={(props) => (
          <View style={styles.progress}>
            <Text style={styles.percentage}>
              {" "}
              {Math.round(
                (item.numCheckpointsCompleted / item.numCheckpoints) * 100 * 10
              ) / 10}
              %
            </Text>
            <AnimatedCircularProgress
              size={45}
              width={3}
              fill={(item.numCheckpointsCompleted / item.numCheckpoints) * 100}
              tintColor="#bdf007"
              rotation={0}
              tintColorSecondary="#ff6122"
              onAnimationComplete={() => {}}
              backgroundColor="#3d5875"
            />
          </View>
        )}
        right={(props) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialIcons
              style={{ position: "absolute", right: 40 }}
              name="edit"
              size={22}
              color="#555"
              onPress={() => navigation.navigate("Edit Goal", item)}
            />
            <IconButton
              {...props}
              icon="close"
              onPress={() => handleDeleteGoal(item)}
            />
          </View>
        )}
        titleStyle={
          item.completed ? styles.completedGoal : globalStyles.titleText
        }
        description={
          item.Checkpoint1 !== undefined && !item.Checkpoint1.completed
            ? `Checkpoint 1 : ${moment(
                item.Checkpoint1.DateTimeFormatted,
                "Do MMMM YYYY, h:mm a"
              ).from(time)}`
            : item.Checkpoint2 !== undefined && !item.Checkpoint2.completed
            ? `Checkpoint 2 : ${moment(
                item.Checkpoint2.DateTimeFormatted,
                "Do MMMM YYYY, h:mm a"
              ).from(time)}`
            : item.Checkpoint3 !== undefined && !item.Checkpoint3.completed
            ? `Checkpoint 3 : ${moment(
                item.Checkpoint3.DateTimeFormatted,
                "Do MMMM YYYY, h:mm a"
              ).from(time)}`
            : `Complete Goal: ${moment(
                item.DateTimeFormatted,
                "Do MMMM YYYY, h:mm a"
              ).from(time)}`
        }
        onPress={() => navigation.navigate("Goal Details", item)}
      />
    );
  };

  useEffect(() => {
    let secTimer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(secTimer);
  }, []);

  return (
    <View style={globalStyles.container}>
      {loading ? (
        <ActivityIndicator style = {styles.loading} size="large" color = '#4682b4' />
      ) : (
        <View style = {{flex:1}}>
          {sectionedGoals.length === 0 ? (
            <View style={styles.noGoal}>
              <View style={styles.imageView}>
                <View style={styles.ImageBackground}>
                  <ImageBackground
                    source={require("../../../assets/police.png")}
                    style={{ height: 200, width: 200 }}
                    imageStyle={{ borderRadius: 15 }}
                  />
                </View>
              </View>
              <Text style={styles.noGoalText}>
                {" "}
                You have no long term goals currently.{" "}
              </Text>
              <Text style={styles.noGoalText}>
                {" "}
                Click + to add a new goal now!
              </Text>
            </View>
          ) : (
            <SectionList
              sections={sectionedGoals}
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
  completedGoal: {
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
  noGoal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  noGoalText: {
    ...globalStyles.bodyText,
    alignSelf: "center",
    fontSize: 18,
  },
  loading: {
    flex: 1,
    justifyContent: 'center'
  }
});
